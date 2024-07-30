let nodes = [];
let edges = [];

function setup() {
  createCanvas(720, 480);

  // Add Event listener to attach event handler to specified element
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
}

function draw() {
  background(230);

  // iteratively draw nodes
  for (let i = 0; i < nodes.length; i++) {
    stroke(0);
    strokeWeight(2);
    fill(0);
    ellipse(nodes[i][0], nodes[i][1], 50, 50);
    fill(255);
    text(i, nodes[i][0], nodes[i][1]);
  }
}

function addNode() {
  // push item into array: nodes
  nodes.push([50, 50]);
  console.log(nodes);
}
