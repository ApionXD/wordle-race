from flask import Flask, request, redirect

from login import login_blueprint
from game import game_blueprint
from api_draft import api_blueprint

app = Flask(__name__)
app.secret_key = '192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
app.register_blueprint(login_blueprint)
app.register_blueprint(api_blueprint)
app.register_blueprint(game_blueprint)

if __name__ == "__main__":
    app.run(debug=True)