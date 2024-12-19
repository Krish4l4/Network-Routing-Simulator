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
  document.getElementById("err").innerHTML = "";
}
