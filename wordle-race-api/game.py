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
    print(current_games)
    game_request = request.json
    if len(current_games) == 0:
        game = Game("test1", "test2", 5)
        current_games.append(game)
    '''else:
        game = getGameByUser(game_request["user"])
        game.gen_new_board()
        game.player1_board = len(game.boards)-1
        for g in current_games:
            for b in g.boards:
                print(b.word)'''

    return json.dumps({
        "response": "Success"
    })

@game_blueprint.route("/newboard", methods=['POST'])
def new_board():
    game_request = request.json
    try:
        game = getGameByUser(game_request["user"])
        if game.player1 == game_request["user"]:
            if game.player1_board == len(game.boards)-1:
                game.gen_new_board()
                game.player1_board = len(game.boards)-1
            else:
                game.player1_board += 1
        else:
            if game.player2_board == len(game.boards)-1:
                game.gen_new_board()
                game.player2_board = len(game.boards)-1
            else:
                game.player2_board += 1
        return json.dumps({
            "response": "Success"
        })
    except:
        return json.dumps({
            "response": "User is not in a game"
        })

@game_blueprint.route("/check", methods=['POST'])
def check_endpoint():
    check_request = request.json
    game = getGameByUser(check_request["user"])
    guess = request.json['guess']
    if guess == '':
        pass
    else:
        board = game.boards[game.player1_board] if game.player1 == check_request["user"] else game.boards[game.player2_board]
        return json.dumps({
            "response": board.verifyGuess(guess)
    })

def getGameByUser(user):
    for x in current_games:
        if x.player1 == user  or x.player2 == user:
            return x