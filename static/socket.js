function runningAlgorithm(whichalgo) {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("err").innerHTML = "";

  document.getElementById("stepAlgorithm").style.display = "inline";
  document.getElementById("exitAlgorithm").style.display = "inline";
  disableChild = document
    .getElementById("upperButtons")
    .children.forEach((child) => {
      child.setAttribute("disabled", "");
    });

  document.getElementById("stateDenoterButton").children.forEach((child) => {
    child.setAttribute("disabled", "");
  });

  // algo variable initilized as connection is properly validated
  algo = "Running";

  socket = io();
  socket.on("connect", function () {
    console.log("Connected to server");
  });

  if (whichalgo == "Dijkstra") {
    runDijkstra();
  } else if (whichalgo == "Bellman_Ford") {
    runBellmanFord();
  }
  socket.on("server", function (msg) {
    console.log(msg);

    currentNode = msg.current_node;
    neighbourNode = msg.neighbor;

    if (msg.data == "Stop") {
      console.log("Closed Connection");
      document.getElementById("stepAlgorithm").setAttribute("disabled", "");

      if (whichalgo == "Dijkstra") {
        shortestPath = msg.path;
        if (shortestPath.length == 0) {
          document.getElementById("messages").innerHTML =
            "No link to destination";
        }
        console.log(shortestPath);
      }

      if (whichalgo == "Bellman_Ford") {
        flag = 0;
        for (let i = 0; i < edges.length; i++) {
          if (sourceOfBelmanFord == edges[i].start) {
            flag = 1;
            break;
          }
          if (sourceOfBelmanFord == edges[i].end) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          document.getElementById("messages").innerHTML = "No link from source";
        }
      }
      algo = "Final";
      socket.close();

      dateFinal = new Date();
      console.log(
        "Simulation execution time: " + (dateFinal - dateInital) / 1000 + " sec"
      );
    } else {
      trackBellmanFordCosts = msg.dist; // used when the final step is returned: tracks the cost
      var previousTable = document.getElementById("algorithmTable");
      previousTable
        .querySelector("tbody")
        .children.forEach((child) => child.classList.remove("table-active"));

      for (let i = 0; i < nodes.length; i++) {
        if (msg.pre[i] == null) {
          msg.pre[i] = "nil";
        }
        currentRow = previousTable.rows[i + 1];

        cellDistance = previousTable.rows[i + 1].cells[1];
        cellPredecessor = previousTable.rows[i + 1].cells[2];

        previousData = cellDistance.lastChild.textContent;
        if (previousData != msg.dist[i]) {
          // For unconncted node
          if (msg.dist[i] == null) {
            continue;
          }

          previousBlock = document.createElement("span");
          previousBlock.classList.add("text-decoration-line-through");
          previousBlock.textContent = "  " + cellDistance.textContent;

          previousPre = document.createElement("span");
          previousPre.classList.add("text-decoration-line-through");
          previousPre.textContent = "  " + cellPredecessor.textContent;

          cellDistance.textContent = "";
          cellPredecessor.textContent = "";

          cellDistance.appendChild(previousBlock);
          cellPredecessor.appendChild(previousPre);

          var newBlock = document.createElement("span");
          newBlock.textContent = `  ${msg.dist[i]}`;
          cellDistance.appendChild(newBlock);

          var newPre = document.createElement("span");
          newPre.textContent = `  ${msg.pre[i]}`;
          cellPredecessor.appendChild(newPre);

          // highlight row
          currentRow.classList.add("table-active");
        }
      }
    }
  });

  socket.on("disconnect", function (reason, details) {
    console.log("Disconnected from server");
    console.log(reason);
  });
}
