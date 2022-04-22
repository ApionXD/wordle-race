import json

from flask import Blueprint, request, session

from game import getGameByUser, Game, add_game
from database import db

matchmaking_blueprint = Blueprint('matchmaking_blueprint', __name__)
# This is the list of people in the matchmaking queue
matchmaking_queue = list()
matchmaker_pipe = None
tot_collection = db["scores"]

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
    matchmaking_queue = dict()
    matchmaking_queue[4] = list()
    matchmaking_queue[5] = list()
    matchmaking_queue[6] = list()
    matchmaking_queue[7] = list()
    matchmaking_queue[8] = list()
    matchmaking_queue[9] = list()
    while True:
        if pipe.poll():
            queue_request = pipe.recv()
            queued_users = matchmaking_queue[queue_request[1]]
            new_user = queue_request[0]
            already_queued = False
            for x in matchmaking_queue.values():
                if new_user in x:
                    already_queued = True
                    break

            if not already_queued:
                queued_users.append(new_user)
                print(f"Added {new_user} to match making for {queue_request[1]} letter!")
        for i, x in matchmaking_queue.items():
            if len(x) >= 2:
                pipe.send([x[0], x[1], i])
                print(f"Matched {x[0]} and {x[1]}")
                matchmaking_queue[i] = x[2:]


@matchmaking_blueprint.route("/queue", methods=['POST'])
def queue_endpoint():
    username = session['username']
    board_size = request.json['boardSize']

    user = tot_collection.find_one({
        "username": username
    })
    if int(user['role'])<1 and board_size>6:
        return json.dumps({
            "response": "Role too low",
        })

    matchmaker_pipe.send((username, board_size))
    return json.dumps({
        "response": "Success",
    })


@matchmaking_blueprint.route("/check_game", methods=['GET'])
def check_game():
    pipe = matchmaker_pipe
    if pipe.poll():
        user_pair = pipe.recv()
        new_game = Game(user_pair[0], user_pair[1],user_pair[2])
        add_game(new_game)
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
            "id": str(game.id),
            "opponentName": other_player
        })

