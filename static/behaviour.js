/*
 nodes[] : nodes[{x,y}] represents x-postion and y-postion in canvas, and node's name 
 edges[] : edges[{start, end, weight}] represents start node,end node and weight of edge
 draggindNode: to track if a node in dragged
*/
let nodes = [];
let edges = [];
let draggingNode = null;
let socket;
let table;
let algo = "Not Running";
let currentNode;
let neighbourNode;

function setup() {
  createCanvas(720, 480);

  // Add Event listener to attach event handler to specified element
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
  document
    .getElementById("myForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      validateForm();
    });
  document
    .getElementById("addEdgeBtn")
    .addEventListener("click", addEdgeViewer);
  document.getElementById("clear").addEventListener("click", clearCanvas);
  document.getElementById("dijkstra").addEventListener("click", runDijkstra);
  document
    .getElementById("stepAlgorithm")
    .addEventListener("click", stepUpdater);
}

function draw() {
  background(230);

  //iterativley draw edges
  for (let i = 0; i < edges.length; i++) {
    var n1 = nodes[edges[i].start];
    var n2 = nodes[edges[i].end];

    stroke(0);
    strokeWeight(3);
    if (
      algo == "Running" &&
      ((n1.name == currentNode && n2.name == neighbourNode) ||
        (n1.name == neighbourNode && n2.name == currentNode))
    ) {
      stroke(231, 76, 60);
      edges[i].visited = true;
    } else if (edges[i].visited == true) {
      stroke(231, 76, 60);
    } else {
      stroke(0);
    }

    line(n1.x, n1.y, n2.x, n2.y);

    noStroke();
    fill(0);

    text(edges[i].weight, (n1.x + n2.x) / 2, (n1.y + n2.y) / 2);
  }

  // iteratively draw nodes
  for (let i = 0; i < nodes.length; i++) {
    stroke(0);
    strokeWeight(2);

    /**
     * If node is dragged use green-like color
     * else, use default node color
     */
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < 20 && mouseIsPressed) {
      fill(159, 226, 191); // green-like color
      ellipse(nodes[i].x, nodes[i].y, 40, 40);
    } else {
      if (algo == "Running" && nodes[i].name == currentNode) {
        fill(231, 76, 60);
        nodes[i].visited = true;
      } else if (algo == "Running" && nodes[i].name == neighbourNode) {
        fill(241, 196, 15);
      } else if (nodes[i].visited == true) {
        fill(231, 76, 60);
      } else {
        fill(255);
      }
    }
    ellipse(nodes[i].x, nodes[i].y, 40, 40);
    fill(0);
    textSize(18);
    strokeWeight(0);

    if (i < 10) {
      text(i, nodes[i].x - 5, nodes[i].y + 5);
    } else if (i >= 10) {
      text(i, nodes[i].x - 10, nodes[i].y + 5);
    }
  }
}

function addNode() {
  // push item into array: nodes

  var x = random(50, width - 50);
  var y = random(50, height - 50);

  // need to be optimized
  for (var i = 0; i < nodes.length; i++) {
    let d = dist(x, y, nodes[i].x, nodes[i].y);
    if (d < 40) {
      var x = random(50, width - 50);
      var y = random(50, height - 50);
      i = 0;
    }
  }

  var valueOfNode = nodes.length;
  nodes.push({ x: x, y: y, name: valueOfNode, visited: false });
}

/**
 * This function loads the form for edge submission
 * and sets paramters for max values that can be taken as inputs
 * also reset preloaded values to " "
 */
function addEdgeViewer() {
  if (nodes.length < 2) {
    alert("Only one node. Cannot add edge!!");
  } else {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("err").value = "";

    document.getElementById("startNode").setAttribute("max", nodes.length - 1);
    document.getElementById("endNode").setAttribute("max", nodes.length - 1);

    document.getElementById("startNode").value = "";
    document.getElementById("endNode").value = "";
    document.getElementById("weight").value = "";
  }
}

// validates whether start is equall to end or not
// if validates passes to addEdge()
function validateForm() {
  let start = parseInt(document.getElementById("startNode").value);
  let end = parseInt(document.getElementById("endNode").value);
  let weight = parseInt(document.getElementById("weight").value);

  if (start == end) {
    document.getElementById("err").innerHTML =
      "Start node should not be equal to the end node.";
    return false;
  }
  addEdge(start, end, weight);
}

/**
 * Adds new egde between nodes
 * or updates the edge's weight between the nodes if already present
 */
function addEdge(start, end, weight) {
  let flag = 0;
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].start == start && edges[i].end == end) {
      edges[i].weight = weight;
      flag = 1;
    } else if (edges[i].start == end && edges[i].end == start) {
      edges[i].weight = weight;
      flag = 1;
    }
  }
  if (flag == 0) {
    edges.push({
      start: parseInt(start),
      end: parseInt(end),
      weight: parseInt(weight),
      visited: false,
    });
  }
  document.getElementById("myForm").style.display = "none";
}

/**
 * Removes items from nodes and edges, also clears canvas
 */
function clearCanvas() {
  nodes = [];
  edges = [];
  clear();
  background(230); // additional clear

  if (socket) {
    socket.emit("clearValues");
    socket.close();
  }
}

function generateTable(source) {
  console.log(source);
  table = "<tr><th>Vertex</th><th>Distance</th><th>Predecessor</th></tr>";
  nodes.forEach((node) => {
    if (node.name == source) {
      table += `<tr><td>${node.name}</td><td>0</td><td>nil</td></tr>`;
    } else {
      table += `<tr><td>${node.name}</td><td>inf</td><td>nil</td></tr>`;
    }
  });
  document.getElementById("algorithmTable").innerHTML = table;
}

function runDijkstra() {
  document.getElementById("stepAlgorithm").style.display = "block";
  let source = parseInt(prompt("Enter source node"));
  let destination = parseInt(prompt("Enter destination node"));
  generateTable(source);

  // algo variable initilized as connection is properly validated
  algo = "Running";

  socket = io();
  socket.on("connect", function () {
    console.log("Connected to server");
  });
  socket.emit("process_dijkstra", {
    edges: edges,
    source: source,
    destination: destination,
  });

  // event sent by server
  socket.on("server", function (msg) {
    console.log(msg);
    currentNode = msg.current_node;
    neighbourNode = msg.neighbor;

    table = "<tr><th>Vertex</th><th>Distance</th><th>Predecessor</th></tr>";
    for (let i = 0; i < nodes.length; i++) {
      table += `<tr><td>${i}</td><td>${msg.dist[i]}</td><td>${msg.pre[i]}</td></tr>`;
    }
    document.getElementById("algorithmTable").innerHTML = table;
  });

  socket.on("disconnect", function () {
    console.log("Disconnected from server");
  });
}

function stepUpdater() {
  console.log("step called");
  socket.emit("step");
}

function exitSimulation() {
  document.getElementById("algorithmTable").innerHTML = "";
  document.getElementById("stepAlgorithm").removeAttribute("disabled");
  document
    .getElementById("upperButtons")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document.getElementById("stepAlgorithm").style.display = "none";
  document.getElementById("exitAlgorithm").style.display = "none";

  // reset values of variables
  algo = "Not Running";
  currentNode = null;
  neighbourNode = null;

  nodes.forEach((node) => (node.visited = false));
  edges.forEach((edge) => (edge.visited = false));
}
