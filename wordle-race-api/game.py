import uuid
import time
from database import db
from flask import Blueprint, request, session
import api_draft
import json

game_blueprint = Blueprint('game_blueprint', __name__)
current_games = list()
game_statuses = dict()
user_collection = db["users"]
board_collection = db["boards"]
tot_collection = db["scores"]

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

    guess = request.json['guess']
    board = game.boards[game.player1_board] if game.player1 == session['username'] else game.boards[game.player2_board]

    checkedGuess = board.verifyGuess(guess)

    if (checkedGuess==0):
        return json.dumps({
            "response": "Failure",
            "colors": [0]
        })

    game_score = [game.player1score if game.player1 == player else game.player2score, [-1]]  # gets current score
    row = check_request['curRow'] #sees the row we are on
    game_score = score_game(game_score, checkedGuess, row) #gives points for the game
    if game.player1 == player:
        game.player1score = game_score[0]
    else:
        game.player2score = game_score[0]

    storeInformation(game_score, checkedGuess, session['username'], game, board)
    return json.dumps({
        "response": "Success",
        "colors": [x[1] for x in checkedGuess],
        "score": game_score[0]
    })

def storeInformation(score, checkedGuess, username, game, board):
    words = ""
    count = 0
    for i in checkedGuess:
        words += i[0]+str(i[1])
        if i[1]==2:
            count += 1
    game.guesses.append(words)
    if count>=len(checkedGuess) or len(game.guesses)==len(checkedGuess):
        game.guesses.append(board.get_word())
        board_collection.find_one_and_update({'username': username},{'$push': {'boards':game.guesses}})
        board_collection.find_one_and_update({'username': username}, {'$push': {'score': str(score[0])}})
        user = tot_collection.find_one({
            "username": username
        })
        overallScore = user['score']
        overallScore += score[0]
        tot_collection.find_one_and_update({'username': username}, {'$set': {'score': overallScore}})
        game.guesses = []




def score_game(game_score, checkedGuess, row):
    pointsAdded = 1
    if row == 0:  # points based on rows
        pointsAdded *= 5
    elif row == 1:
        pointsAdded *= 4
    elif row == 2:
        pointsAdded *= 3
    elif row == 3:
        pointsAdded *= 2
    for x in range(len(checkedGuess)):  # currently only gives points for greens
        if checkedGuess[x][1] == 2 and not x in game_score[1]:
            print(checkedGuess[x])
            game_score[1].append(x)
            game_score = [pointsAdded + game_score[0], game_score[1]]
    if len(game_score[1]) - 1 == len(checkedGuess) or row == len(checkedGuess):  # resets what is already known green for new game
        game_score[1] = [-1]
        if row == 0:  # gives extra points if solved it right on first try
            game_score[0] *= 2
    return game_score


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
        self.player1score = 0
        self.player2score = 0
        self.gen_new_board()
        self.guesses = []#Stores guesses for round

    def gen_new_board(self):
        new_board = api_draft.Board(self.size)
        self.boards.append(new_board)

