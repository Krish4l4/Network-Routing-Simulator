from flask_socketio import emit, socketio

global steps
steps = []


class Graph:
    def __init__(self, graph: dict ={}):
        self.graph = graph # A dictionary for the adjaceny list
    
    def add_edge(self, node1, node2, weight):
        if node1 not in self.graph: #Check if the node is already added
            self.graph[node1] ={} # If not, create the node
        self.graph[node1][node2] = weight #Else, add a connection to its neighbour

        if node2 not in self.graph:
            self.graph[node2]={}
        self.graph[node2][node1] = weight

    def shortest_path(self, source:str, target:str):
        _, predecessors = Dijkstra(self.graph, source)

        path = []
        current_node = target

        while current_node:
            path.append(current_node)
            current_node = predecessors[current_node]
        path.reverse()
        return path


class MinPriorityQueue:
    def __init__(self):
        self.queue = []
    
    def insert(self, node, priority):
        self.queue.append((node, priority))
        self.bubble_up(len(self.queue)-1)

    def extract_min(self):
        if len(self.queue) == 0:
            return None
        min_val = self.queue[0]
        self.queue[0] = self.queue[-1]
        self.queue.pop()
        self.bubble_down(0)
        return min_val

    """
    Bubble Up: Compares the new element with its parent. If the new element is smaller, 
    it swaps them and continues this process until the heap property is restored or the element reaches the root.
    """

    def bubble_up(self, index):
        parent = (index-1) // 2
        if index > 0 and self.queue[index][1] < self.queue[parent][1]:
            self.queue[index] , self.queue[parent] = self.queue[parent] , self.queue[index]
            self.bubble_up(parent)

    """
    Bubble Down: Starts from the root and moves the new root down to restore the heap property. 
    It finds the smallest of the root’s children and swaps if needed, continuing this process until the heap property is restored or the node is a leaf.
    """ 
    def bubble_down(self, index):
        left_child = 2* index+1
        right_child = 2 * index +2
        smallest = index

        if left_child < len(self.queue) and self.queue[left_child][1] < self.queue[smallest][1]:
            smallest = left_child

        if right_child < len(self.queue) and self.queue[right_child][1] < self.queue[smallest][1]:
            smallest = right_child

        if smallest != index:
            self.queue[smallest], self.queue[index] = self.queue[index], self.queue[smallest]
            self.bubble_down(smallest)

def Dijkstra(graph, source):
    # Initialize the values of all nodes with infinity
    distances = {node: float('inf') for node in graph}
    predecessors = {node: None for node in graph}

    distances[source] = 0

    pq = MinPriorityQueue()
    pq.insert(source, 0)

    # Create a set to hold visited source
    visited = set()

    while pq.queue:
        current_node, current_distance = pq.extract_min()

        if current_node in visited:
            continue
        visited.add(current_node)

        for neighbor, weight in graph[current_node].items():
            print(type(neighbor))
            distance = current_distance + weight

            # Relaxation
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                pq.insert(neighbor, distance)
                predecessors[neighbor] = current_node
                print(distances, predecessors)
                steps.append({'currentNode': current_node,'neighbor': neighbor,'dist': distances, 'pre': predecessors})
 
    # emit('server',{'dist':distances, 'pre':predecessors})
    return distances, predecessors


g = Graph()
g.add_edge('0','1',12)
g.add_edge('0','2',3)
g.add_edge('1','2',3)

print(g.shortest_path('0','1'))
print(steps)
        