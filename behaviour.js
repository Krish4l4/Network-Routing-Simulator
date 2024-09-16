/*
 nodes[] : nodes[{x,y}] represents x-postion and y-postion in canvas
 edges[] : edges[{start, end, weight}] represents start node,end node and weight of edge
 draggindNode: to track if a node in dragged
*/
let nodes = [];
let edges = [];
let draggingNode = null;

function setup() {
  let canvas = createCanvas(720, 480); // global variable initiated: width = 720; height = 480;
  canvas.parent("canvasContainer");

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
}

function draw() {
  background(230);

  // iteratively draw edges
  for (let i = 0; i < edges.length; i++) {
    let n1 = nodes[edges[i].start];
    let n2 = nodes[edges[i].end];

    stroke(0);
    strokeWeight(3);
    fill(0);
    line(n1.x, n1.y, n2.x, n2.y);

    noStroke();
    fill(0);

    // display text in the midpoint of two nodes

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
      fill(255);
      ellipse(nodes[i].x, nodes[i].y, 40, 40);
    }

    fill(0);
    textSize(18);
    strokeWeight(0);
    /**
     * Align the name of nodes based on their values(single & double digit numbers)
     */
    if (i < 10) {
      text(i, nodes[i].x - 5, nodes[i].y + 5);
    } else if (i >= 10) {
      text(i, nodes[i].x - 10, nodes[i].y + 5);
    }
  }

  /**
   * Update the (x,y) postion of nodes if dragged away from orginal position
   * Also limit the dragged postion to near the boundary of canvas
   * And , also limit the distance between the nodes so that they dont overlapped when dragged by incompetant user
   */
  if (draggingNode != null) {
    var tracker = draggingNode;
    var flag = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (i == draggingNode) {
        continue;
      }

      if (dist(nodes[i].x, nodes[i].y, mouseX, mouseY) < 40) {
        draggingNode = null;
        flag = 1;
      }
    }
    if (flag == 0) {
      if (mouseX > width - 50 || mouseX < 50) {
        tracker = draggingNode;
        draggingNode = null;
      } else {
        nodes[draggingNode].x = mouseX;
      }
      draggingNode = tracker;

      if (mouseY > height - 50 || mouseY < 50) {
        draggingNode = null;
      } else {
        nodes[draggingNode].y = mouseY;
      }
    }
  }
}

// For draggable if present within node boundary
function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < 20) {
      draggingNode = i;
    }
  }
}

function mouseReleased() {
  draggingNode = null;
}

function addNode() {
  document.getElementById("myForm").style.display = "none"; // hide addEdgeViewer Form

  var x = random(50, width - 50);
  var y = random(50, height - 50);

  /**
   * Loop to check and stop overlapping between the nodes
   * 40 is the least distance to be considered between two nodes
   */
  for (var i = 0; i < nodes.length; i++) {
    let d = dist(x, y, nodes[i].x, nodes[i].y);
    if (d < 40) {
      var x = random(50, width - 50);
      var y = random(50, height - 50);
      i = 0;
    }
  }

  nodes.push({ x: x, y: y });
}

function addEdgeViewer() {
  if (nodes.length < 2) {
    alert("Only one node. Cannot add edge!!");
  } else {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("startNode").setAttribute("max", nodes.length - 1);
    document.getElementById("endNode").setAttribute("max", nodes.length - 1);

    document.getElementById("startNode").value = "";
    document.getElementById("endNode").value = "";
    document.getElementById("weight").value = "";
  }
}

function validateForm() {
  let start = document.getElementById("startNode").value;
  let end = document.getElementById("endNode").value;
  let weight = document.getElementById("weight").value;

  if (start == end) {
    document.getElementById("err").innerHTML =
      "Start node should not be equal to the end node.";
    return false;
  }
  addEdge(start, end, weight);
}

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
    edges.push({ start: start, end: end, weight: weight });
  }

  document.getElementById("myForm").style.display = "none";
}

// bool condition for algo running or not , to stop user from adding nodes during execution
