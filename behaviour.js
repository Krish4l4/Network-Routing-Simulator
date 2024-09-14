let nodes = [];
let edges = [];

function setup() {
  createCanvas(720, 480);

  // Add Event listener to attach event handler to specified element
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
  document.getElementById("addEdgeBtn").addEventListener("click", addEdge);
}

function draw() {
  background(230);

  //iterativley draw edges
  for (let i = 0; i < edges.length; i++) {
    let n1 = nodes[edges[i].start];
    let n2 = nodes[edges[i].end];

    stroke(0);
    strokeWeight(3);
    fill(0);
    line(n1.x, n1.y, n2.x, n2.y);

    noStroke();
    fill(0);

    text(edges[i].weight, (n1.x + n2.x) / 2, (n1.y + n2.y) / 2);
  }

  // iteratively draw nodes
  for (let i = 0; i < nodes.length; i++) {
    stroke(0);
    strokeWeight(2);
    fill(255);
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

  nodes.push({ x: x, y: y });

  //nodes.push({x:random(50, width - 50), y:random(50, height - 50)});
}

function addEdge() {
  let start = prompt("Enter start node..");
  let end = prompt("Enter end node..");
  let weight = prompt("Enter weight..");

  edges.push({ start: start, end: end, weight: weight });
  console.log(edges);
}

// bool condition for algo running or not , to stop user from adding nodes during execution
//
