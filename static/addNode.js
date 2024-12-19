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

  var valueOfNode = nodes.length;
  nodes.push({
    x: x,
    y: y,
    name: valueOfNode,
    visited: false,
    finalpath: false,
  });
}
