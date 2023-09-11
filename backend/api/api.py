from threading import Lock

from configFlask import *
from api.controllers.connectPlayers import *
from api.controllers.generateImage import *

active_rooms = {}
active_rooms_lock = Lock()

@app.route("/create_room", methods=["POST"])
def create_room_post():
    return create_room(active_rooms_lock, active_rooms)

@app.route("/join_room", methods=["POST"])
def join_room_post():
    return join_room(active_rooms_lock, active_rooms)
 
@app.route("/leave_room", methods=["POST"])
def leave_room_post():
    return leave_room(active_rooms_lock, active_rooms)

@app.route("/get_active_rooms", methods=["GET"])
def get_active_rooms_get():
    return get_active_rooms(active_rooms)

@app.route("/get_answer", methods=["POST"])
def get_answer_post():
    return get_answer()

@app.route('/generate-image', methods=['POST'])
def generate_image_post():
    return generate_image(active_rooms_lock, active_rooms)

@app.route('/room_full', methods=['POST'])
def is_room_full_post():
    return is_room_full(active_rooms)