from flask import request, session, jsonify
from datetime import datetime, timedelta
from hashlib import sha256
from api.controllers.connectPlayers import *
from PIL import Image, ImageFilter
from urllib.request import urlretrieve
from io import BytesIO
import base64

def get_answer(active_rooms_lock, active_rooms):
    data = request.json
    word = data["word"]
    player = data["id"]
    time = data["time"]
    room = compute_hashed_room(data["room"])
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = (listPlayers.index(player) + 1) % 2
    nextPlayer = listPlayers[nextPlayer]
    listWords = active_rooms[room][nextPlayer]["words"]

    exist = word in listWords

    if exist:
        with active_rooms_lock:
            active_rooms[room][player]["score"] += 20000 * (0.3/(60-int(time)))
        return jsonify({"correct": True}), 200
    
    elif exist == False:
        return jsonify({"correct": False}), 200

    return jsonify({"message": "We cannot validate the word"}), 400

def encodeProcess(img: Image):
    buffer = BytesIO()
    blimg = img.save(buffer, format='PNG')
    blimg_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return blimg_base64

def get_image(active_rooms):
    rejson = request.json
    id = rejson["id"]
    room = compute_hashed_room(rejson["room"])
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = (listPlayers.index(id) + 1)%2
    nextPlayer = listPlayers[nextPlayer]
    while active_rooms[room][nextPlayer]["imageURL"] == "":
        pass
    url = active_rooms[room][nextPlayer]["imageURL"]
    rd = 10
    blurredImages = []
    imgOr = Image.open(urlretrieve(url=url)[0])
    blurredImages.append(encodeProcess(imgOr))

    for i in range(1, 4):
        blimg = imgOr.filter(ImageFilter.BoxBlur(rd*i))
        blurredImages.append(encodeProcess(blimg))

    return {
        "data": blurredImages
    }

def change_status(active_rooms):
    rejson = request.json
    id = rejson["id"]
    room = compute_hashed_room(rejson["room"])
    active_rooms[room][id]["status"] = "Pronto"
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = listPlayers[(listPlayers.index(id)+1)%2]
    while active_rooms[room][nextPlayer]["status"] != "Pronto":
        pass
    return {
        "message": True
    }

def check_status_oponent(active_rooms):
    rejson = request.json
    id = rejson["id"]
    room = compute_hashed_room(rejson["room"])
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = listPlayers[(listPlayers.index(id)+1)%2]
    if active_rooms[room][nextPlayer]["status"] == "Vitoria":
        return jsonify({"message": True}), 200
    return jsonify({"message": False}), 200

def define_win(active_rooms):
    rejson = request.json
    id = rejson["id"]
    room = compute_hashed_room(rejson["room"])
    active_rooms[room][id]["status"] = "Vitoria"

    return jsonify({"message": "Ok"}), 200

def define_score_win(active_rooms):
    data = request.json
    room = compute_hashed_room(data["room"])
    id = data["id"]
    
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = listPlayers[(listPlayers.index(id)+1)%2]

    if active_rooms[room][id]["score"] > active_rooms[room][nextPlayer]["score"]:
        active_rooms[room][id]["status"] = "Vitoria"
        return jsonify({"message": True, "score": active_rooms[room][id]["score"], "opScore": active_rooms[room][nextPlayer]["score"]}), 200
    
    active_rooms[room][nextPlayer]["status"] = "Vitoria"
    return jsonify({"message": False, "score": active_rooms[room][id]["score"], "opScore": active_rooms[room][nextPlayer]["score"]}), 200

def redefine_game(active_rooms):
    data = request.json
    room = compute_hashed_room(data["room"])
    id = data["id"]
    
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = listPlayers[(listPlayers.index(id)+1)%2]

    active_rooms[room][id]["imageURL"] = ""
    active_rooms[room][nextPlayer]["imageURL"] = ""
    active_rooms[room][id]["status"] = "Preparando"
    active_rooms[room][nextPlayer]["status"] = "Preparando"

    return jsonify({"message": True}), 200
    