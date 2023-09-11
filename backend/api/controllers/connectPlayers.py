from flask import request, session, jsonify
from datetime import datetime, timedelta
from hashlib import sha256
import random
import string

def compute_hashed_room(room):
    hash_object = sha256(room.encode())
    return hash_object.hexdigest()

def createID():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8))


def create_room(active_rooms_lock, active_rooms):
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    sessionID = createID()
    with active_rooms_lock:
        if hashed_room in active_rooms:
            return jsonify({"message": "Room already exists."}), 400

        active_rooms[hashed_room] = {f"{sessionID}": {"date": datetime.now()}}
        #active_rooms[hashed_room] = [(sessionID, datetime.now())]

    return jsonify({"message": "Room created successfully.",
                    "id": sessionID}), 200

def join_room(active_rooms_lock, active_rooms):
    data = request.json
    print(data["room"])
    hashed_room = compute_hashed_room(data["room"])

    with active_rooms_lock:
        if hashed_room not in active_rooms:
            return jsonify({"message": "Room does not exist."}), 400

        
        sessionID = createID()
        active_sessions = active_rooms[hashed_room]

        if len(active_rooms[hashed_room]) >= 2:
            return jsonify({"message": "Room is full."}), 400

        active_sessions[f"{sessionID}"] = {"date": datetime.now()}
        #active_sessions.append((sessionID, datetime.now()))

        if len(active_sessions) == 2:
            return jsonify({"message": "Joined full room successfully.",
                            "id": sessionID}), 200

    return jsonify({"message": "Joined room successfully.",
                    "id": sessionID}), 200

def leave_room(active_rooms_lock, active_rooms):
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

def get_active_rooms(active_rooms):
    return jsonify(active_rooms), 200

def is_room_full(active_rooms):
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    start = datetime.now()
    while datetime.now() - start <= timedelta(seconds=30):
       if len(active_rooms[hashed_room]) == 2:
        return jsonify({"is_full": True}), 200

    return jsonify({"is_full": False}), 200