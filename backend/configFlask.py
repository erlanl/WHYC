from flask import Flask
from flask_socketio import SocketIO
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)


app.config["SECRET_KEY"] = "mysecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(seconds=60)
Session(app)

CORS(app)
socketio = SocketIO(app)