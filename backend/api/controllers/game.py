from flask import request, session, jsonify
from datetime import datetime, timedelta
from hashlib import sha256

def run_game():
    start = datetime.now()

    #Tempo de game
    while datetime.now() - start <= timedelta(seconds=60):
        pass