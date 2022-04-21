import json
import time
import uuid

from flask import Blueprint, request, session

import api_draft
from database import db

game_blueprint = Blueprint('game_blueprint', __name__)
current_games = list()
game_statuses = dict()
user_collection = db["users"]
board_collection = db["boards"]
tot_collection = db["scores"]
game_collection = db["games"]

@game_blueprint.route("/check", methods=['POST'])
def check_endpoint():
    check_request = request.json
    game_status = game_statuses[check_request['id']]
    if game_status == "Completed":
        return json.dumps({
            "response": "Time's up",
        })
    game = getGameByUser(session['username'])
    player = game.player1 if game.player1 == session['username'] else game.player2

    # Ends game if time is up
    if time.time() - game.start_time >= game.duration:
        storeGameinDatabase(game)
        game_statuses[check_request['id']] = "Completed"
        del_game(game)
        return json.dumps({
            "response": "Time's up",
        })
            #change scores need to add table to db
            #user.update_one(scores, )




    guess = request.json['guess']
    board = game.boards[game.player1_board] if game.player1 == session['username'] else game.boards[game.player2_board]

    checkedGuess = board.verifyGuess(guess)

    if (checkedGuess==0):
        return json.dumps({
            "response": "Not Word",
            "colors": [0]
        })

    game_score = [game.player1score if game.player1 == player else game.player2score, [-1]]  # gets current score
    row = check_request['curRow'] #sees the row we are on
    game_score = score_game(game_score, checkedGuess, row) #gives points for the game
    if game.player1 == player:
        game.player1score = game_score[0]
    else:
        game.player2score = game_score[0]
    if board.word == guess:
        new_board(player)

    storeInformation(game_score, checkedGuess, session['username'], game, board)
    return json.dumps({
        "response": "Success",
        "colors": [x[1] for x in checkedGuess],
        "score": game_score[0]
    })

def storeGameinDatabase(game):
    user_obj = {
        #"username": player,
        "id": str(game.id),
        "player1":game.player1,
        "player2":game.player2,
        "player1score": game.player1score,
        "player2score": game.player2score,
        "boardp1": game.p1guesses,
        "boardp2": game.p2guesses
    }
    game_collection.insert_one(user_obj)

#needs to be adjusted to work with other things
def storeInformation(score, checkedGuess, username, game, board):
    words = ""
    count = 0
    for i in checkedGuess:
        words += i[0]+str(i[1])
        if i[1]==2:
            count += 1
    player = game.p1guesses
    if game.player2 == username:
        player = game.p2guesses
    player.append(words)
    if count>=len(checkedGuess) or len(player)==len(checkedGuess):
        player.append(board.get_word())
        board_collection.find_one_and_update({'username': username},{'$push': {'boards':player}})
        board_collection.find_one_and_update({'username': username}, {'$push': {'score': [str(score[0])]}})
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
            game_score[1].append(x)
            game_score = [pointsAdded + game_score[0], game_score[1]]
    if len(game_score[1]) - 1 == len(checkedGuess) or row == len(checkedGuess):  # resets what is already known green for new game
        game_score[1] = [-1]
        if row == 0:  # gives extra points if solved it right on first try
            game_score[0] *= 2
    return game_score


def new_board(user):
    game = getGameByUser(user)
    if game.player1 == user:
        if game.player1_board == len(game.boards)-1:
            game.gen_new_board()
            game.player1_board += 1
        else:
            game.player1_board += 1
    else:
        if (game.player2_board == len(game.boards)-1):
            game.gen_new_board()
            game.player2_board += 1
        else:
            game.player2_board += 1

# This gets called when the user has run out of guesses
@game_blueprint.route("/skip_board", methods=['POST'])
def skip_board():
    new_board(session['username'])
    return json.dumps({
        "response": "Success"
    })

@game_blueprint.route("/gameresults", methods=['POST'])
def game_results():
    # TODO: gather information
    check_request = request.json
    game = game_collection.find_one({"id": str(check_request["id"])})
    player = game["player1"]
    player2 = game["player2"]
    winner = "Tie"
    player1score = game["player1score"]
    player2score = game["player2score"]
    if (player1score>player2score):
        winner = player
    if (player2score>player1score):
        winner = player2
    return json.dumps({
        "player1": player,
        "player2": player2,
        "player1score": player1score,
        "player2score": player2score,
        "winner": winner
    })

@game_blueprint.route('/leaderboard', methods=['GET'])
def leader_board():
    top5 = tot_collection.aggregate([
            {'$sort': {'score': -1}},
            {'$limit': 5}
            ])
    top5users = list()
    top5scores = list()
    for _ in range(5):
        tmp = top5.next()
        top5users.append(tmp["username"])
        top5scores.append(tmp["score"])
    print(top5users, top5scores)
    return json.dumps({
        "top5users": top5users,
        "top5scores": top5scores
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

@game_blueprint.route('/opponent_score', methods=['GET'])
def op_score():
    game = getGameByUser(session['username'])
    score = 0
    if game.player1 == session['username']:
        game.player2score
    elif game.player2 == session['username']:
        game.player1score
    return json.dumps({
        "response": "Success",
        "score": score
    })

class Game:
    def __init__(self, player1, player2, size, duration=30):
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
        self.p1guesses = []#Stores guesses for round
        self.p2guesses = []
    def gen_new_board(self):
        new_board = api_draft.Board(self.size)
        self.boards.append(new_board)

