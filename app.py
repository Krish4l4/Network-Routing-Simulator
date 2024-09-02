from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send
from Algorithms import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

current_step = 0


@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Disconnected")


@socketio.on('process_dijkstra')
def handle_dijkstra(dataValues):
    print(dataValues)
    G = Graph()
    G.reset()

    for edge in dataValues['edges']:
        start = edge["start"]
        end = edge["end"]
        weight = edge["weight"]
        G.add_edge(str(start), str(end), weight)
    print(G.shortest_path(str(dataValues['source']),str(dataValues['destination'])))

@socketio.on('step')
def get_step():
    global current_step
    print(steps) # clears steps of pervious things

    if(current_step < len(steps)):
        print(current_step)
        print(steps[current_step]['dist'], steps[current_step]['pre'])
        emit('server',{'dist':steps[current_step]['dist'], 'pre':steps[current_step]['pre']})
        current_step+=1

@socketio.on('clearValues')
def handle_clear():
    steps.clear() # clears steps of pervious things

<<<<<<< HEAD
=======
    global current_step
    current_step = 0
    global path
    path = []

@socketio.on_error_default
def default_error_handler(e):
    print(e)

>>>>>>> a26c760 (Completed till Dijkstra's (all) ,can be changes in highlights)
if __name__ == '__main__':
    print("Starting server..")
    socketio.run(app, allow_unsafe_werkzeug=True,port=80,debug=True)