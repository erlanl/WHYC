from flask import request, session, jsonify
from flask_socketio import SocketIO
from datetime import datetime, timedelta
from hashlib import sha256
from api.controllers.connectPlayers import *
from PIL import Image, ImageFilter
from urllib.request import urlretrieve
from io import BytesIO
import base64
from configFlask import *

def run_game(active_rooms, data):
    print("Passei aqui")
    data = data
    start = datetime.now()
    sessionID = data["id"]
    room = compute_hashed_room(data["room"])

    #Tempo de game
    while datetime.now() - start <= timedelta(seconds=60):
        for player in active_rooms[room].keys():
            #print("To verificando")
            #print(active_rooms[room][player]["words"])
            if len(active_rooms[room][player]["words"]) == 0:
                if player == sessionID:
                    socketio.emit('result', {'result': True})
                else:
                    socketio.emit('result', {'result': False})
                    

def get_answer(active_rooms, active_rooms_lock):
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
        with active_rooms_lock:
            active_rooms[room][nextPlayer]["words"].delete(word)
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
    print("ENTREI")
    rejson = request.json
    id = rejson["id"]
    room = compute_hashed_room(rejson["room"])
    listPlayers = list(active_rooms[room].keys())
    nextPlayer = (listPlayers.index(id) + 1)%2
    nextPlayer = listPlayers[nextPlayer]
    while "imageURL" not in active_rooms[room][nextPlayer].keys():
        pass
    url = active_rooms[room][nextPlayer]["imageURL"]
    rd = 10
    blurredImages = []
    imgOr = Image.open(urlretrieve(url=url)[0])
    blurredImages.append(encodeProcess(imgOr))

    for i in range(1, 4):
        print("Cheguei")
        blimg = imgOr.filter(ImageFilter.BoxBlur(rd*i))
        blurredImages.append(encodeProcess(blimg))
        print("OLAA")

    return {
        "data": blurredImages
    }