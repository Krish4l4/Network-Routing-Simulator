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
let shortestPath = [];
let whichalgo;
let sourceOfBelmanFord;
let trackBellmanFordCosts;

let stateChoosen = "Undirected";

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
  document.getElementById("dijkstra").addEventListener("click", function () {
    if (edges.length == 0) {
      alert("No Edges connected in graph");
    } else {
      whichalgo = "Dijkstra";
      runningAlgorithm(whichalgo);
    }
  });
  document
    .getElementById("bellman-ford")
    .addEventListener("click", function () {
      if (edges.length == 0) {
        alert("No Edges connected in graph");
      } else {
        whichalgo = "Bellman_Ford";
        runningAlgorithm(whichalgo);
      }
    });
  document
    .getElementById("stepAlgorithm")
    .addEventListener("click", stepUpdater);
  document
    .getElementById("exitAlgorithm")
    .addEventListener("click", exitSimulation);

  document
    .getElementById("undirectedButton")
    .addEventListener("click", function () {
      console.log("Undirected Graph");
      stateChoosen = "Undirected";
    });
  document
    .getElementById("directedButton")
    .addEventListener("click", function () {
      console.log("Directed Graph");
      stateChoosen = "Directed";
    });
}

function draw() {
  background(230);

  if (algo == "Running") {
    frameRate(24);
  } else {
    frameRate(60);
  }

  // iteratively draw edges
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
      // stroke(231, 76, 60);
      stroke(abs(231 * cos(frameCount * 0.1)), 76, 60);
      edges[i].visited = true;
    } else if (algo == "Final") {
      if (whichalgo == "Dijkstra") {
        for (let z = 0; z < shortestPath.length; z++) {
          if (
            (shortestPath[z] == n1.name && shortestPath[z + 1] == n2.name) ||
            (shortestPath[z] == n2.name && shortestPath[z + 1] == n1.name)
          ) {
            stroke(34, 153, 84);
          }
        }
      } else {
        stroke(231, 76, 60);
      }
    } else if (edges[i].visited == true) {
      stroke(231, 76, 60);
    } else {
      stroke(0);
    }

    line(n1.x, n1.y, n2.x, n2.y);

    if (stateChoosen == "Directed") {
      // arrow make
      push();
      var angleOfLine = atan2(n1.y - n2.y, n1.x - n2.x);
      translate(n2.x, n2.y); // translate to end node
      rotate(angleOfLine - HALF_PI); // rotates the arrow point
      /**
       * Upper Point towards the end node is (0,22)
       * and left right point are (-4,30) and (4,30)
       */
      triangle(-4, 30, 4, 30, 0, 22);

      pop();
    }

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
    } else {
      if (algo == "Running" && nodes[i].name == currentNode) {
        fill(231, 76, 60); //red like color
        nodes[i].visited = true;
      } else if (algo == "Running" && nodes[i].name == neighbourNode) {

        // fill(241, 196, 15); // yellow like color
        fill(255, 255, abs(230 * cos(frameCount * 0.1)));

       

      } else if (algo == "Final") {
        if (whichalgo == "Dijkstra") {
          for (let z = 0; z < shortestPath.length; z++) {
            if (nodes[i].name == shortestPath[z]) {
              fill(34, 153, 84);
              nodes[i].finalpath = true;
              break;
            }
          }
        } else {
          if (nodes[i].name == sourceOfBelmanFord) {
            fill(231, 76, 60); //red like color
            nodes[i].finalpath = true;
          }
          for (let key in trackBellmanFordCosts) {
            if (trackBellmanFordCosts.hasOwnProperty(key)) {
              if (nodes[i].name == key) {
                strokeWeight(1);
                text(
                  `Cost: ${trackBellmanFordCosts[key]}`,
                  nodes[i].x,
                  nodes[i].y + 40
                );
              }
            }
          }
        }
        if (nodes[i].finalpath == false) {
          fill(255);
        }
      } else if (nodes[i].visited == true) {

        fill(226, 102, 88); // red

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

function stepUpdater() {
  socket.emit("step");
}

function exitSimulation() {
  if (socket) {
    socket.emit("clearValues");
    socket.close();
  }

  document.getElementById("myForm").style.display = "none";
  document.getElementById("algorithmTable").innerHTML = "";
  document.getElementById("stepAlgorithm").removeAttribute("disabled");
  document
    .getElementById("upperButtons")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document
    .getElementById("stateDenoterButton")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document.getElementById("stepAlgorithm").style.display = "none";
  document.getElementById("exitAlgorithm").style.display = "none";

  // reset values of variables
  algo = "Not Running";
  currentNode = null;
  neighbourNode = null;
  shortestPath = [];

  nodes.forEach((node) => ((node.visited = false), (node.finalpath = false)));
  edges.forEach((edge) => (edge.visited = false));

  document.getElementById("messages").innerHTML = "";
}
