function runBellmanFord() {
  let source;
  do {
    source = parseInt(prompt(`Enter source node: 0-${nodes.length - 1}`));
  } while (isNaN(source));

  generateTable(source);
  sourceOfBelmanFord = source; // to highlight the souce node at end

  socket.emit("process_bellmanFord", {
    edges: edges,
    source: source,
    state: stateChoosen,
  });
  dateInital = new Date();
}
