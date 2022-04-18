import asyncio
import json
import uuid

from flask import Blueprint, request, session

from game import getGameByUser, Game, current_games

matchmaking_blueprint = Blueprint('matchmaking_blueprint', __name__)
# This is the list of people in the matchmaking queue
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


@matchmaking_blueprint.route("/check_game", methods=['GET'])
def check_game():
    pipe = matchmaker_pipe
    if pipe.poll():
        user_pair = pipe.recv()
        new_game = Game(user_pair[0], user_pair[1], 5)
        current_games.append(new_game)
    username = session['username']
    game = getGameByUser(username)

    if game is None:
        return json.dumps({
            "response": "Success",
            "status": "Still searching"
        })
    else:
        other_player = game.player2 if game.player1 == session['username'] else game.player1
        return json.dumps({
            "response": "Success",
            "status": "Game found",
            "opponentName": other_player
        })

