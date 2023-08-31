from flask import request, session, jsonify
from datetime import datetime
from hashlib import sha256

def compute_hashed_room(room):
    hash_object = sha256(room.encode())
    return hash_object.hexdigest()

def create_room(active_rooms_lock, active_rooms):
    data = request.json
    hashed_room = compute_hashed_room(data["room"])

    with active_rooms_lock:
        if hashed_room in active_rooms:
            return jsonify({"message": "Room already exists."}), 400

        active_rooms[hashed_room] = [(session.sid, datetime.now())]

    return jsonify({"message": "Room created successfully."}), 200

def join_room(active_rooms_lock, active_rooms):
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

def get_answer():
    data = request.json
    word = data["word"]
    listWords = ["homem", "lua", "espaco", "astronauta", "terra"]

    exist = word in listWords

    if exist:
        return jsonify({"correct": True}), 200
    elif exist == False:
        return jsonify({"correct": False}), 200

    return jsonify({"message": "We cannot validate the word"}), 400