from flask import Blueprint, request, session
import api_draft
import json

game_blueprint = Blueprint('game_blueprint', __name__)
current_games = list()


@game_blueprint.route("/check", methods=['POST'])
def check_endpoint():
    check_request = request.json
    game = getGameByUser(session['username'])
    guess = request.json['guess']
    board = game.boards[game.player1_board] if game.player1 == session['username'] else game.boards[game.player2_board]
    return json.dumps({
        "response": "Success",
        "colors": [x[1] for x in board.verifyGuess(guess)]
    })


def getGameByUser(user):
    for x in current_games:
        if x.player1 == user  or x.player2 == user:
            return x
    return None


class Game:
    def __init__(self, player1, player2, size):
        self.boards = list()
        self.player1 = player1
        self.player2 = player2
        self.size = size
        self.player1_board = 0
        self.player2_board = 0
        self.gen_new_board()

    def gen_new_board(self):
        new_board = api_draft.Board(self.size)
        self.boards.append(new_board)

