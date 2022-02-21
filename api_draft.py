import collections
from wonderwords import RandomWord
from flask import Flask, request
import json


# setup
app = Flask(__name__)
r = RandomWord()
wotd = ''

@app.route("/check", methods=['POST'] )
def check_endpoint():
    global wotd
    if wotd == '':
        wotd = generateWotd()
        print(wotd)
    guess = request.json['guess']
    return json.dumps(verifyGuess(guess))

def generateWotd(pos = ['nouns', 'verbs', 'adjectives'], length = 5):
    # defaults to nouns/verbs/adjectives of length 5
    return r.word(include_parts_of_speech = pos, word_min_length = length, word_max_length = length)


def validate(s):
    return s.isalpha()


def verifyGuess(guess):
    if not validate(guess):
        print('ERROR: INVALID GUESS')
        return 0
    guess = guess.lower()
    returnArray = [tuple(('',0)) for x in range(len(guess))]
    
    # check for duplicates in the wotd
    wotdDupes = collections.defaultdict(int)
    for c in wotd:
        wotdDupes[c] += 1

    # check each letter
    # 2 = correct, 1 = correct letter wrong location, 0 = wrong
    # also include index for resorting
    # first pass
    for i, c in enumerate(guess):
        if guess[i] == wotd[i]:
            returnArray[i] = tuple((guess[i], 2))
    # second pass
    for i, c in enumerate(guess):
        if guess[i] == wotd[i]:
            pass
        elif guess[i] in wotd:
            # handle duplicates
            if tuple((guess[i], 2)) in returnArray or tuple((guess[i], 1)) in returnArray:
                if sum(1 for t in returnArray if t[0] == guess[i]) >= wotdDupes[guess[i]]:
                    returnArray[i] = tuple((guess[i], 0))
                else:
                    returnArray[i] = tuple((guess[i], 1))
            else:
                returnArray[i] = tuple((guess[i], 1))
        else:
            returnArray[i] = tuple((guess[i], 0))
    return returnArray


def main():
    global wotd
    wotd = 'toast'
    # wotd = generateWotd()
    print(wotd)
    print(verifyGuess('shoot'))


if __name__ == "__main__":
    app.run()