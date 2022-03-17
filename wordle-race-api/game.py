from flask import Blueprint, request
import api_draft
import json

game_blueprint = Blueprint('game_blueprint', __name__)
current_games = list()

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


# TODO: add route for play again button that resets wotd
@game_blueprint.route("/newgame", methods=['POST'])
def new_game():
    game_request = request.json
    game = Game("test1", "test2", 5)
    current_games.append(game)

    return json.dumps({
        "response": "Success"
    })


@game_blueprint.route("/check", methods=['POST'])
def check_endpoint():
    check_request = request.json
    game = getGameByUser(check_request["user"])
    guess = request.json['guess']
    board = game.boards[game.player1_board] if game.player1 == check_request["user"] else game.boards[game.player2_board]
    return json.dumps({
        "response": board.verifyGuess(guess)
    })

def getGameByUser(user):
    for x in current_games:
        if x.player1 == user  or x.player2 == user:
            return x