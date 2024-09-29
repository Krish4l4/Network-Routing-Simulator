from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(msg1, msg2):
    print(msg1)
    print(msg2)


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
    socketio.run(app, allow_unsafe_werkzeug=True)