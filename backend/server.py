from datetime import datetime
from threading import Thread, Event
from configFlask import *
from api import api

SESSION_CLEANUP_INTERVAL = 600 # Seconds

def session_cleanup():
    while True:
        print("Cleaning up!")

        now = datetime.now()
        empty_rooms = []

        with api.active_rooms_lock:
            for hashed_room, session_data in api.active_rooms.items():
                active_sessions = []

                for session_id, last_used in session_data:
                    if now - last_used <= app.permanent_session_lifetime:
                        active_sessions.append((session_id, last_used))

                if active_sessions:
                    api.active_rooms[hashed_room] = active_sessions
                else:
                    empty_rooms.append(hashed_room)

            for hashed_room in empty_rooms:
                api.active_rooms.pop(hashed_room, None)

        Event().wait(SESSION_CLEANUP_INTERVAL)

if __name__ == "__main__":
    cleanup_thread = Thread(target=session_cleanup)
    cleanup_thread.start()
    socketio.run(app, host="localhost", port=5001, debug=True)