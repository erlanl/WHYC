from flask import Flask, request, session, jsonify
from flask_socketio import SocketIO
from flask_session import Session
from datetime import timedelta
from hashlib import sha256

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(seconds=15)
Session(app)

socketio = SocketIO(app)

active_rooms = {}

def compute_hashed_room(room):
    hash_object = sha256(room.encode())
    return hash_object.hexdigest()

@app.route("/create_room", methods=["POST"])
def create_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    if hashed_room in active_rooms:
        return jsonify({"message": "Room already exists."}), 400

    active_rooms[hashed_room] = [session.sid]
    return jsonify({"message": "Room created successfully."}), 200

@app.route("/join_room", methods=["POST"])
def join_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    if hashed_room not in active_rooms:
        return jsonify({"message": "Room does not exist."}), 400

    if session.sid in active_rooms[hashed_room]:
        return jsonify({"message": "Joined room successfully."}), 200

    if len(active_rooms[hashed_room]) >= 2:
        return jsonify({"message": "Room is full."}), 400

    active_rooms[hashed_room].append(session.sid)
    return jsonify({"message": "Joined room successfully."}), 200

@app.route("/leave_room", methods=["POST"])
def leave_room():
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    if hashed_room not in active_rooms:
        return jsonify({"message": "Room does not exist."}), 400

    if session.sid in active_rooms[hashed_room]:
        active_rooms[hashed_room].remove(session.sid)
        return jsonify({"message": "Left room successfully."}), 200
    else:
        return jsonify({"message": "You are not in this room."}), 400

@app.route("/get_active_rooms", methods=["GET"])
def get_active_rooms():
    return jsonify(active_rooms)

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5001, debug=True)