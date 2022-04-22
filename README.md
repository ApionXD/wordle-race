Wordle race is a competitive version of the beloved wordle. Instead of having the same daily limitations as wordle, wordle race will allows matching against other people while also allowing for more flexibility with different board size features to make the game more competitive and enjoyable.
### Features:
-Multiple Wordle boards per game, as many boards as you want per day. <br>
-Matchmaking based on the size Wordle board you choose. Uses pipes to communicate through processes to allow for the speediest connection between two users. <br>
-A login/register system to create an account or know your score. <br>
-A leaderboard page to show the top players to have ever played the game. <br>
-Role-based access for higher Wordle board sizes to make the bigger word scene more competitive. <br>
-A timer to stimulate a more competitive feeling for the player while also showing the player how the opponents is scoring. <br>
-Persistent login so that you don’t always have to login if your information is stored. <br>
-A game over page that shows the scores of the two players and who won, while also showing all the boards the players played in their last match.<br>

### Instructions:
-Back-end <br>
You must ‘pip install requirements.txt’ in ‘/wordle-race-api/’ to install the requirements for the back-end. Then run ‘py main.py’ to start the back-end.
-Front-end <br>
You will need npm to install the requirements for the front-end. First you must go to ‘./wordle-race-web/’ folder and run ‘npm install’ to install the requirements. After, to run the front-end you must run ‘npm start’ which will start the front-end and try to accept request from the back-end.

### Dependencies:
-Back-End <br>
click
colorama
Flask
importlib-metadata
itsdangerous
Jinja2
MarkupSafe
pymongo
Werkzeug
Wonderwords
zipp
pyenchant <br>
-Front-end <br>
Axios
Little-state-machine
React
Typescript
Web-vitals

### Division Of Work:
The followings provides a general structure but almost every aspect of the program was worked on by multiple people to achieve the required result. The commit history may be a better representation of distribution of labor. 
### Mason: Generally worked on most of front-end aspects, matchmaking, and the overall structure of the game using an object-oriented approach.
### Kunle: Dealt with most things database and login related.
### Tristan: Worked on word checking logic, gameover page, leader board page, and the different size board lengths. 
### Notes:
This project may seem fairly basic on the surface, but the implementation of the features was more complicated 



