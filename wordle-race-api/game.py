import uuid
import time
from database import db
from flask import Blueprint, request, session
import api_draft
import json

game_blueprint = Blueprint('game_blueprint', __name__)
current_games = list()
game_statuses = dict()
game_score = dict()
user_collection = db["users"]

@game_blueprint.route("/check", methods=['POST'])
def check_endpoint():
    check_request = request.json
    game_status = game_statuses[check_request['id']]
    game = getGameByUser(session['username'])
    player = game.player1 if game.player1 == session['username'] else game.player2
    if game_status == "Completed":
        return json.dumps({
            "response": "Time's up",
        })

    if time.time() - game.start_time >= game.duration:
        del_game(game)
        #TODO send points to user
        user = user_collection.find_one({"username": player})
        if user is not None:
            None
            #change scores need to add table to db
            #user.update_one(scores, )
        return json.dumps({
            "response": "Time's up",
        })

    if not player in game_score.keys():
        game_score[player] = [0, [-1]]

    guess = request.json['guess']
    board = game.boards[game.player1_board] if game.player1 == session['username'] else game.boards[game.player2_board]
    checkedGuess = board.verifyGuess(guess)
    if (checkedGuess==0):
        return json.dumps({
            "response": "Failure",
            "colors": [0]
        })
    numGood = 0
    row = check_request['curRow']
    pointsAdded = 1
    if row == 0: #points based on rows
        pointsAdded *= 5
    elif row == 1:
        pointsAdded *= 4
    elif row == 2:
        pointsAdded *= 3
    elif row == 3:
        pointsAdded *= 2
    for x in range(len(checkedGuess)): #currently only gives points for greens
        if checkedGuess[x][1]==2 and not x in game_score[player][1]:
            game_score[player][1].append(x)
            game_score[player] = [pointsAdded+game_score[player][0], game_score[player][1]]
    if len(game_score[player][1])-1==len(guess) or row==4: #resets what is already known green for new game
        game_score[player][1] = [-1]
        if row==0: #gives extra points if solved it right on first try
            game_score[player][0]*=2

    return json.dumps({
        "response": "Success",
        "colors": [x[1] for x in checkedGuess],
        "score": game_score[player][0]
    })

def add_game(game):
    current_games.append(game)
    game_statuses[str(game.id)] = "Active"

def del_game(game):
    game_statuses[str(game.id)] = "Completed"
    current_games.remove(game)

def getGameByUser(user):
    for x in current_games:
        if x.player1 == user  or x.player2 == user:
            return x
    return None


def getGameById(id):
    for x in current_games:
        if x.id == id:
            return x
    return None



class Game:
    def __init__(self, player1, player2, size, duration=500):
        self.boards = list()
        self.player1 = player1
        self.player2 = player2
        self.size = size
        self.duration = duration
        self.player1_board = 0
        self.player2_board = 0
        self.start_time = time.time()
        self.id = uuid.uuid4()
        self.gen_new_board()

    def gen_new_board(self):
        new_board = api_draft.Board(self.size)
        self.boards.append(new_board)

