from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
import time
from Algorithms import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

current_step = 0
path = []

@app.route("/")
def index():
    return render_template('index.html', page_name='index')

@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/aboutus")
def aboutus():
    return render_template("aboutus.html")

@socketio.on('connect')
def handle_connect():
    print("Connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Disconnected")


@socketio.on('process_dijkstra')
def handle_dijkstra(dataValues):
    print(dataValues)

    if(dataValues['state'] == 'Undirected'):
        G = Graph()
    elif(dataValues['state']=='Directed'):
        G = DirectedGraph()
    
    G.reset()

    for edge in dataValues['edges']:
        start = edge["start"]
        end = edge["end"]
        weight = edge["weight"]
        G.add_edge(str(start), str(end), weight)
    global path
    start_time = time.perf_counter()
    path = G.shortest_path(str(dataValues['source']),str(dataValues['destination']))
    print("Execution time: " + str((time.perf_counter()-start_time) * 1000)+ " ms")
    print(path)


@socketio.on('process_bellmanFord')
def handle_dijkstra(dataValues):
    print(dataValues)

    if(dataValues['state'] == 'Undirected'):
        G = Graph()
    elif(dataValues['state']=='Directed'):
        G = DirectedGraph()
    G.reset()

    for edge in dataValues['edges']:
        start = edge["start"]
        end = edge["end"]
        weight = edge["weight"]
        G.add_edge(str(start), str(end), weight)
    global path
    start_time = time.perf_counter()
    path = G.bellman_calculation(str(dataValues['source']))
    print("Execution time: "+ str((time.perf_counter()-start_time) * 1000) +" ms")
    print(path)



@socketio.on('step')
def get_step():
    global current_step

    if(current_step < len(steps) ):
        # float('inf') cannot be sent to the client so convert it
        for key,value in steps[current_step]['dist'].items():
            if( value == float('inf')):
                steps[current_step]['dist'][key]= "inf"

        emit('server',{'dist':steps[current_step]['dist'], 'pre':steps[current_step]['pre'], 'current_node':steps[current_step]['currentNode'], 'neighbor':steps[current_step]['neighbor']})
        current_step+=1
    elif current_step >= len(steps):
        emit('server',{'data': "Stop", 'path': path})
        

@socketio.on('clearValues')
def handle_clear():
    steps.clear() # clears steps of pervious things

    global current_step
    current_step = 0
    global path
    path = []


@socketio.on_error_default
def default_error_handler(e):
    print(e)



if __name__ == '__main__':
    print("Starting server..")
    socketio.run(app, allow_unsafe_werkzeug=True,port=5000,debug=True, log_output=True)