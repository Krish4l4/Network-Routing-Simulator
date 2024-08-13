from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send
from Algorithms import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Connected")

@socketio.on('disconnect')
def handel_disconnect():
    print("Disconnected")

@socketio.on('process_dijkstra')
def handle_dijkstra(dataValues):
    print(dataValues)
    G = Graph()

    for edge in dataValues['edges']:
        start = edge["start"]
        end = edge["end"]
        weight = edge["weight"]
        G.add_edge(str(start), str(end), weight)
    print(G.shortest_path(str(dataValues['source']),str(dataValues['destination'])))



# @app.route('/process-dijkstra', methods=['POST'])
# def process_dijkstra():
#     nodes, edges = request.json['nodes'], request.json['edges']
#     bool(error)

#     for i in range(len(edges)):
#         if(edges[i]["weight"] < 0):
#             error = True

#     if(error is True):
#         return jsonify({'result': "Error"})
#     return jsonify({'result': "EHlo"})


if __name__ == '__main__':
    print("Starting server..")
    socketio.run(app, allow_unsafe_werkzeug=True,port=5000,debug=True)