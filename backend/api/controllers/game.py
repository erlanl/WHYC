from flask import request, session, jsonify
from datetime import datetime, timedelta
from hashlib import sha256
from api.controllers.connectPlayers import *

def run_game():
    start = datetime.now()

    #Tempo de game
    while datetime.now() - start <= timedelta(seconds=60):
        pass

def get_answer(active_rooms):
    data = request.json
    word = data["word"]
    player = data["id"]
    room = compute_hashed_room(data["room"])
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = (listPlayers.index(player) + 1) % 2
    nextPlayer = listPlayers[nextPlayer]
    listWords = active_rooms[room][nextPlayer]["words"]

    exist = word in listWords

    if exist:
        return jsonify({"correct": True}), 200
    elif exist == False:
        return jsonify({"correct": False}), 200

    return jsonify({"message": "We cannot validate the word"}), 400