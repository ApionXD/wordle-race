import asyncio
import json
from flask import Blueprint, request, session

from game import current_games, Game

matchmaking_blueprint = Blueprint('matchmaking_blueprint', __name__)
matchmaking_queue = list()
matchmaker_pipe = None


# For testing only.
'''
@matchmaking_blueprint.route("/newgame", methods=['POST'])
def new_game():
    game_request = request.json
    
    current_games.append(game)

    return json.dumps({
        "response": "Success"
    })
'''
def run_matchmaking(pipe):
    matchmaking_queue = list()
    while True:
        if pipe.poll():
            new_user = pipe.recv()
            matchmaking_queue.append(new_user)
            print(f"Added {new_user} to match making!")
        if len(matchmaking_queue) >= 2:
            pipe.send([matchmaking_queue[0], matchmaking_queue[1]])
            print(f"Matched {matchmaking_queue[0]} and {matchmaking_queue[0]}")
            matchmaking_queue = matchmaking_queue[2:]


@matchmaking_blueprint.route("/queue", methods=['POST'])
def queue_endpoint():
    username = session['username']
    matchmaker_pipe.send(username)
    return json.dumps({
        "response": "Success",
    })

