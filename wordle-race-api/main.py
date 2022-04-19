from multiprocessing import Pipe, Process

from flask import Flask, request, redirect

from login import login_blueprint
from game import game_blueprint, Game
from api_draft import api_blueprint
import matchmaking

SECRET_KEY = '192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.register_blueprint(login_blueprint)
app.register_blueprint(api_blueprint)
app.register_blueprint(game_blueprint)
app.register_blueprint(matchmaking.matchmaking_blueprint)

# We are running matchmaking in a separate process, all we do is pass in names, and get a pair of names out
if __name__ == "__main__":
    parent_conn, child_conn = Pipe()
    p = Process(target=matchmaking.run_matchmaking, args=(child_conn,))
    p.start()
    matchmaking.matchmaker_pipe = parent_conn
    app.run(debug=True)
        