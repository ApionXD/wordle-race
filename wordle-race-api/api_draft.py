import collections
from wonderwords import RandomWord
from flask import Blueprint
import json


api_blueprint = Blueprint('api_blueprint', __name__)

class Board:
    r = RandomWord()

    def __init__(self, size):
        self.size = size
        self.word = Board.generateword(length=size)
        print(self.word)

    def generateword(pos=['nouns', 'verbs', 'adjectives'], length=5):
        # defaults to nouns/verbs/adjectives of length 5
        return Board.r.word(include_parts_of_speech=pos, word_min_length=length, word_max_length=length)

    def verifyGuess(self, guess):
        if not Board.validate(guess):
            print('ERROR: INVALID GUESS')
            return 0
        guess = guess.lower()
        returnArray = [tuple(('', 0)) for x in range(len(guess))]

        # check for duplicates in the word
        wordDupes = collections.defaultdict(int)
        for c in self.word:
            wordDupes[c] += 1

        # check each letter
        # 2 = correct, 1 = correct letter wrong location, 0 = wrong
        # also include index for resorting
        # first pass
        for i, c in enumerate(guess):
            if guess[i] == self.word[i]:
                returnArray[i] = tuple((guess[i], 2))
        # second pass
        for i, c in enumerate(guess):
            if guess[i] == self.word[i]:
                pass
            elif guess[i] in self.word:
                # handle duplicates
                if tuple((guess[i], 2)) in returnArray or tuple((guess[i], 1)) in returnArray:
                    if sum(1 for t in returnArray if t[0] == guess[i]) >= wordDupes[guess[i]]:
                        returnArray[i] = tuple((guess[i], 0))
                    else:
                        returnArray[i] = tuple((guess[i], 1))
                else:
                    returnArray[i] = tuple((guess[i], 1))
            else:
                returnArray[i] = tuple((guess[i], 0))
        return returnArray

    def validate(s):
        return s.isalpha()


