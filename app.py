from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
import time
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

    if(current_step < len(steps) ):
        for key,value in steps[current_step]['dist'].items():
            if( value == float('inf')):
                steps[current_step]['dist'][key]= "inf"

        emit('server',{'dist':steps[current_step]['dist'], 'pre':steps[current_step]['pre']})
        current_step+=1

@socketio.on('clearValues')
def handle_clear():
    steps.clear() # clears steps of pervious things

@socketio.on_error_default
def default_error_handler(e):
    print(e)

if __name__ == '__main__':
    print("Starting server..")
    socketio.run(app, allow_unsafe_werkzeug=True,port=80,debug=True, log_output=True)