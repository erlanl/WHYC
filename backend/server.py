from flask import Flask, request, session, jsonify, make_response
from flask_socketio import SocketIO
from flask_session import Session
from flask_cors import CORS
from datetime import datetime, timedelta
from threading import Thread, Lock, Event
from hashlib import sha256
import openai
import json
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(seconds=60)
Session(app)

CORS(app)
socketio = SocketIO(app)

active_rooms = {}
active_rooms_lock = Lock()

SESSION_CLEANUP_INTERVAL = 30

MODEL_GPT = 'gpt-4'
with open('credentials.json', 'r') as f:
    credentials = json.load(f)

openai.api_key = credentials['openai_api_key']
openai.Model.list()

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

@app.route("/get_answer", methods=["POST"])
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


@app.route('/generate-image', methods=['POST'])
def generate_image():
    key_words = request.json

    dalle_prompt = gpt_call(key_words["key_words"])
    #image_url = dalle_call(dalle_prompt)
    image_url = stable_diffusion_call(dalle_prompt, credentials)
    return make_response(
        jsonify(message='IMAGE URL:', url=image_url)
    )

def gpt_call(key_words):
    gpt_prompt = "crie uma Dall-e prompt em ingles com  as seguintes palavras:"
    for i in key_words:
        gpt_prompt = gpt_prompt + " " + i
    print(f"GPT PROMPT -> {gpt_prompt}")

    gpt_response = openai.ChatCompletion.create(
        model = MODEL_GPT,
        messages = [
            #{"role": "system", "content": ""},
            {"role": "user", "content": gpt_prompt}
        ],
        temperature = 1,
    )
    dalle_prompt = gpt_response['choices'][0]['message']['content']
    dalle_prompt = dalle_prompt[1:-1]
    print(f"DALLE PROMPT -> {dalle_prompt}")
 
    return gpt_prompt

def dalle_call(dalle_prompt):
    dalle_response = openai.Image.create(
        prompt = dalle_prompt,
        n = 1,
        size = "1024x1024"
    )
    image_url = dalle_response['data'][0]['url']
    print(f"IMAGE URL -> {image_url}")

    return image_url

def stable_diffusion_call(stable_diffusion_prompt, credentials):
    url = "https://stablediffusionapi.com/api/v3/text2img"
    data = {
      'prompt': stable_diffusion_prompt,
      'key': credentials['stable_diffusion_api_key'],
      'width': 1024,
      'height': 1024,
      'samples': 1,
      'safety_checker': "yes",
      'self_attention': "yes"
    }
    image_url = requests.post(url, data=data).json()['output']
    print(image_url)
    return image_url[0]


@app.route('/generate-image/test-post', methods=['POST'])
def post_test():
    key_words = request.json

    return make_response(
        jsonify(message='LISTA DE KEYWORDS:', data=key_words)
    )

if __name__ == "__main__":
    cleanup_thread = Thread(target=session_cleanup)
    cleanup_thread.start()
    socketio.run(app, host="localhost", port=5001, debug=True)