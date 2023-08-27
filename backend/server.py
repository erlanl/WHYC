from flask import Flask, request, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecretkey"

socketio = SocketIO(app)

active_rooms = {}
correct_guesses = ["sonic", "tails", "knuckles", "amy", "shadow"]

@app.route("/create_room", methods=["POST"])
def create_room():
    data = request.json
    room = data["room"]

    if room in active_rooms:
        return jsonify({"message": "Room already exists."}), 400

    active_rooms[room] = 1
    return jsonify({"message": "Room created successfully."}), 200

@app.route("/join_room", methods=["POST"])
def join_room():
    data = request.json
    room = data["room"]

    if room not in active_rooms:
        return jsonify({"message": "Room does not exist."}), 400

    if active_rooms[room] >= 2:
        return jsonify({"message": "Room is full."}), 400

    active_rooms[room] += 1
    return jsonify({"message": "Joined room successfully."}), 200

@app.route("/leave_room", methods=["POST"])
def leave_room():
    data = request.json
    room = data["room"]

    if room not in active_rooms:
        return jsonify({"message": "Room does not exist."}), 400

    if active_rooms[room] > 0:
        active_rooms[room] -= 1
        return jsonify({"message": "Left room successfully."}), 200
    else:
        return jsonify({"message": "You are not in this room."}), 400

@app.route("/get_active_rooms", methods=["GET"])
def get_active_rooms():
    return jsonify(active_rooms)

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5001, debug=True)