from Bio.PDB import PDBParser
import numpy as np
from APSO import APSO
import heapq

# Define Atom class
class Atom:
    def __init__(self, atom_number, atom_name, residue_name, chain_id, residue_number,
                 x, y, z, occupancy, b_factor):
        self.atom_number = atom_number
        self.atom_name = atom_name
        self.residue_name = residue_name
        self.chain_id = chain_id
        self.residue_number = residue_number
        self.x = x
        self.y = y
        self.z = z
        self.occupancy = occupancy
        self.b_factor = b_factor
        
class Residue:
    def __init__(self,res_id,atom_list):
        self.res_id = res_id
        self.atom_list = atom_list
        self.c_list = []
        coord_x = []
        coord_y = []
        coord_z = []
        for atom in self.atom_list:
            if atom.atom_name[0] == 'C':# Atom_name begins with 'C' is considered as carbon atom
                coord_x.append(atom.x) 
                coord_y.append(atom.y)
                coord_z.append(atom.z)
                self.c_list.append(atom.atom_name)
        self.x = np.mean(coord_x)
        self.y = np.mean(coord_y)
        self.z = np.mean(coord_z)
        if np.isnan(self.x):
            (self.atom_list[0].residue_number,self.atom_list[0].chain_id)
    
    
    def equal(self, residue1):
        return self.res_id == residue1.res_id
            
# Define function for calculating distance between residues
def dist_of_res(residue1, residue2):
    x1, y1, z1 = residue1.x, residue1.y, residue1.z
    x2, y2, z2 = residue2.x, residue2.y, residue2.z
    distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
    return distance


def prim(adj_matrix):
    num_nodes = len(adj_matrix)
    # Initialize visited, distance, and parent matrix
    visited = [False] * num_nodes
    distance = [float('inf')] * num_nodes
    parent = [-1] * num_nodes

    # Start with node 0 as the initial node
    distance[0] = 0
    min_heap = [(0, 0)]  # (distance, node)

    while min_heap:
        _, min_node = heapq.heappop(min_heap)

        if visited[min_node]:
            continue

        visited[min_node] = True

        for i in range(num_nodes):
            if not visited[i] and adj_matrix[min_node][i] < distance[i]:
                distance[i] = adj_matrix[min_node][i]
                parent[i] = min_node
                heapq.heappush(min_heap, (distance[i], i))

    # Calculate the sum of edge lengths
    sum_of_edge_lengths = 0
    for i in range(1, num_nodes):
        sum_of_edge_lengths += adj_matrix[i][parent[i]]

    return (1.0*sum_of_edge_lengths)/(1.0*(num_nodes-1))

def dijkstra(adj_matrix, dist_matrix, source, target):
    # Get number of nodes in graph
    num_nodes = len(adj_matrix)
    # Initialize visited, distance, and parents matrix
    visited = [False] * num_nodes
    distance = [float('inf')] * num_nodes
    parent = [-1] * num_nodes
    distance[source] = 0
    for _ in range(num_nodes):
        min_distance = float('inf')
        min_node = -1

        for i in range(num_nodes):
            if not visited[i] and distance[i] < min_distance:
                min_distance = distance[i]
                min_node = i
        # Check if all nodes are visited
        if min_node == -1:
            break
        # Mark visited nodes
        visited[min_node] = True

        for i in range(num_nodes):
            if not visited[i] and adj_matrix[min_node][i] == 1:
                new_distance = distance[min_node] + dist_matrix[min_node][i]
                if new_distance < distance[i]:
                    distance[i] = new_distance
                    parent[i] = min_node
                    
    shortest_path = []
    current_node = target
    while current_node != -1:
        shortest_path.append(current_node)
        current_node = parent[current_node]

    shortest_path.reverse()
    return (1.0 * distance[target])/(1.0 * len(shortest_path))

#     return shortest_path, distance[target], distance


def get_residue_sturctures(file_path):
    atoms = []
    pdb_file_path = file_path

    # Create a PDBParser object
    with open(pdb_file_path, 'r') as f:
        # Iterate over the lines in the file
        for line in f:
            # Check if the line starts with 'ATOM'
            if line.startswith('ATOM'):
                # Extract relevant information from fixed positions in the line
                atom_number = int(line[6:11].strip())
                atom_name = line[12:16].strip()
                residue_name = line[17:20].strip()
                chain_id = line[21].strip()
                residue_number = int(line[22:26].strip())
                x = float(line[30:38].strip())
                y = float(line[38:46].strip())
                z = float(line[46:54].strip())
                occupancy = float(line[54:60].strip())
                b_factor = float(line[60:66].strip())
                
                # Create an Atom object and add it to the 'atoms' list
                atom = Atom(atom_number, atom_name, residue_name, chain_id, residue_number,
                            x, y, z, occupancy, b_factor)
                atoms.append(atom)
            
    atoms_by_residue = {}
    for atom in atoms:
        #Loop distinction
        residue_id = atom.chain_id + str(atom.residue_number)
        # Check if it's the same residue_id
        if residue_id in atoms_by_residue:
            atoms_by_residue[residue_id].append(atom)
        else:
            atoms_by_residue[residue_id] = [atom]   
    residues = []
    index = 0
    for ids in atoms_by_residue.keys():
        index += 1
        residues.append(Residue(index,atoms_by_residue[ids]))
    return residues

pi_residues =  get_residue_sturctures(file_path="/global/homes/d/dwlyu/earthquake/results/igem/pi_yh.pdb")
all_residues = get_residue_sturctures(file_path="/global/homes/d/dwlyu/earthquake/results/igem/paper.pdb")
all_residues = np.array(all_residues)
mask = np.ones(len(all_residues),dtype=bool)

for item in pi_residues:
    item_index = (ord(item.atom_list[0].chain_id)%ord('A')) * 59 + (int)(item.atom_list[0].residue_number)
    mask[item_index - 1] = False
all_residues = all_residues[mask]

def custom_ordering(Residue):
    ori_dist = np.abs(Residue.x)+np.abs(Residue.y)+np.abs(Residue.z)
    return ori_dist
ordered_values = np.array([custom_ordering(elem) for elem in all_residues[:51]])
order_indices = np.argsort(ordered_values)
all_residues[:51] = all_residues[:51][order_indices]

def fitness_origin(X,pi_res_1=pi_residues, all_res=all_residues,ordered_indice=order_indices):
    # Mapping X to integer
    pi_res = []
    pi_res = pi_res_1.copy()
    index = (51 * np.array(X))
    index = (index).astype(int)
    X = np.unique(X, return_index=False, return_inverse=False, return_counts=False)
    for j in range(0,21):
        for i in range(len(X)):
            pi_res.append(all_res[X[i] + 51 * j])
    for i in range(len(index)):
        if index[i] == 51:
            index[i] -= 1
        for j in range(0,21):
            pi_res.append(all_res[ordered_indice[index[i]] + 51 * j])
      
    res_len = len(pi_res)
    # Initialize distance matrix and adjacent matrix
    Adj_mat = np.zeros((res_len,res_len))
    Dist_mat = np.zeros((res_len,res_len))
    all_dist = []
    for i in range(res_len):
        for j in range(i+1):
            dist = dist_of_res(pi_res[i],pi_res[j])
            Dist_mat[i][j] = dist
            Dist_mat[j][i] = dist
            if dist != 0:
                all_dist.append(dist)
    # print(np.min(all_dist))
    for i in range(res_len):
        for j in range(i+1):
            if Dist_mat[i][j] <= 10: # TODO: Standard remains to be changed
                Adj_mat[i][j] = 1
                Adj_mat[j][i] = 1
            else:
                Dist_mat[i][j] = np.inf
                Dist_mat[j][i] = np.inf
    results = dijkstra(Adj_mat, Dist_mat,source=0,target=8)
    # results = prim(Dist_mat)
    return results# TODO: Starter and Target remain to be changed

def fitness(X,pi_res=pi_residues, all_res=all_residues):
    if np.array(X).ndim == 1:
        X=X[np.newaxis,:]
    P,D = X.shape
    F = np.zeros(P)
    for i in range(P):
        F[i] = fitness_origin(X[i],pi_res_1=pi_res, all_res=all_res)
    
    return F
print(fitness_origin([],pi_res_1=pi_residues, all_res=all_residues))
# curve = np.zeros(51)
# ticks = np.zeros(51)
# for i in range(51):
#     fitness = fitness_origin([i],pi_res_1=pi_residues, all_res=all_residues)
#     curve[i]=fitness
#     ticks[i]=all_residues[i].atom_list[0].residue_number
# np.save('/global/homes/d/dwlyu/earthquake/results/igem/res_add{:.0f}'.format(1), curve)
# np.save('/global/homes/d/dwlyu/earthquake/results/igem/ticks'.format(1), ticks)
num_add = 5
optimizer = APSO(fitness=fitness,D=num_add, P=50, G=200, ub=1, lb=0,
                 w_max=0.9, w_min=0.4, c1=2.0, c2=2.0, k=5e-2)
optimizer.opt()
resid=[]
index = (51 * np.array(optimizer.gbest_X))
index = (index).astype(int)
index = np.unique(index, return_index=False, return_inverse=False, return_counts=False)
for i in range(num_add):
    
    if index[i]==51:
        index -= 1
        
    resid.append(all_residues[index[i]].atom_list[0].residue_number)
np.save('/global/homes/d/dwlyu/earthquake/results/igem/res_add{:.0f}'.format(num_add), resid)
np.save('/global/homes/d/dwlyu/earthquake/results/igem/best_add{:.0f}'.format(num_add),optimizer.loss_curve)