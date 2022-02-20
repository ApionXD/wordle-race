import collections
from random_word import RandomWords

r = RandomWords()
wotd = 'toast'
# w = r.get_random_word(hasDictionaryDef = 'True', includePartOfSpeech = 'noun,verb,adjective', minDictionaryCount = 10, minLength = 5, maxLength = 5)
# print 5 test words:
for i in range(5):
    print(r.get_random_word(hasDictionaryDef = 'True', includePartOfSpeech = 'noun,verb,adjective', minDictionaryCount = 10, minLength = 5, maxLength = 5))

def validate(s):
    if s.isalpha():
        return 'valid'
    else:
        return 'invalid'

def verifyGuess(guess):
    returnArray = ['','','','','']
    # check for duplicates in the wotd and the guess
    wotdDupes = collections.defaultdict(int)
    guessDupes = collections.defaultdict(int)
    for c in wotd:
        wotdDupes[c] += 1
    for c in guess:
        wotdDupes[c] += 1
    # check each letter
    # 2 = correct, 1 = correct letter wrong location, 0 = wrong
    for i in range(5):
        if guess[i] == wotd[i]:
            returnArray[i] = tuple((guess[i], 2))
        elif guess[i] in wotd:
            # REMINDER: handle duplicates later
            returnArray[i] = tuple((guess[i], 1))
        else:
            returnArray[i] = tuple((guess[i], 0))
    return returnArray

print(verifyGuess('shoot'))