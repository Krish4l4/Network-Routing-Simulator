function runDijkstra() {
  let source;
  let destination;
  do {
    source = parseInt(prompt(`Enter source node: 0-${nodes.length - 1}`));
  } while (isNaN(source));

  do {
    destination = parseInt(
      prompt(`Enter destination node: 0-${nodes.length - 1}`)
    );
  } while (isNaN(destination));

  generateTable(source);

  socket.emit("process_dijkstra", {
    edges: edges,
    source: source,
    destination: destination,
  });
}
