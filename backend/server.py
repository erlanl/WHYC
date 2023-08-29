from flask import Flask, request, session, jsonify
from flask_socketio import SocketIO
from flask_session import Session
from datetime import datetime, timedelta
from threading import Thread, Lock, Event
from hashlib import sha256

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(seconds=60)
Session(app)

socketio = SocketIO(app)

active_rooms = {}
active_rooms_lock = Lock()

SESSION_CLEANUP_INTERVAL = 30

def compute_hashed_room(room):
    hash_object = sha256(room.encode())
    return hash_object.hexdigest()

def session_cleanup():
    while True:
        print("Cleaning up!")

        now = datetime.now()
        empty_rooms = []

        with active_rooms_lock:
            for hashed_room, session_data in active_rooms.items():
                active_sessions = []

                for session_id, last_used in session_data:
                    if now - last_used <= app.permanent_session_lifetime:
                        active_sessions.append((session_id, last_used))

                if active_sessions:
                    active_rooms[hashed_room] = active_sessions
                else:
                    empty_rooms.append(hashed_room)

            for hashed_room in empty_rooms:
                active_rooms.pop(hashed_room, None)

        Event().wait(SESSION_CLEANUP_INTERVAL)

@app.route("/create_room", methods=["POST"])
def create_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    with active_rooms_lock:
        if hashed_room in active_rooms:
            return jsonify({"message": "Room already exists."}), 400

        active_rooms[hashed_room] = [(session.sid, datetime.now())]

    return jsonify({"message": "Room created successfully."}), 200

@app.route("/join_room", methods=["POST"])
def join_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    with active_rooms_lock:
        if hashed_room not in active_rooms:
            return jsonify({"message": "Room does not exist."}), 400

        session_id = session.sid
        active_sessions = active_rooms[hashed_room]

        if any(session_info[0] == session_id for session_info in active_sessions):
            return jsonify({"message": "Rejoined room successfully."}), 200

        if len(active_rooms[hashed_room]) >= 2:
            return jsonify({"message": "Room is full."}), 400

        active_sessions.append((session_id, datetime.now()))

        if len(active_sessions) == 2:
            return jsonify({"message": "Joined full room successfully."}), 200

    return jsonify({"message": "Joined room successfully."}), 200

@app.route("/leave_room", methods=["POST"])
def leave_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    with active_rooms_lock:
        if hashed_room not in active_rooms:
            return jsonify({"message": "Room does not exist."}), 400

        session_id = session.sid
        active_sessions = active_rooms[hashed_room]

        for session_info in active_sessions:
            if session_info[0] == session_id:
                active_sessions.remove(session_info)
                return jsonify({"message": "Left room successfully."}), 200

    return jsonify({"message": "You are not in this room."}), 400

@app.route("/get_active_rooms", methods=["GET"])
def get_active_rooms():
    return jsonify(active_rooms), 200

if __name__ == "__main__":
    cleanup_thread = Thread(target=session_cleanup)
    cleanup_thread.start()
    socketio.run(app, host="localhost", port=5001, debug=True)