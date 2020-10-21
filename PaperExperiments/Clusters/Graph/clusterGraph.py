import networkx as nx
import matplotlib.pyplot as plt
import csv
import re
import os
from spanningtree import prim_mst_edges as ts
f1 = open('similarAppsshowcase_noStem2_50_0.9_0.05.csv','r')

c1 = csv.reader(f1, delimiter=',')
pattern_feature = r'\'(.*?)\''
pattern_value = r'\((.*?)\,'
edges = ""
next(c1,None)
nodes = {}
for row in c1:
    for i in range(1,len(row)):
        col_value = float(re.search(pattern_value,row[i]).group(1))
        if(col_value<0.5):
            feature = re.search(pattern_feature,row[i]).group(1)
            edges = edges + row[0]+","+feature+","+ str(1-col_value)+"\n"

f1 = open('edge_list.csv','w')
f1.write(edges)
f1.close()
G = nx.read_weighted_edgelist('edge_list.csv', delimiter =",")
T=nx.minimum_spanning_tree(G)

nx.write_edgelist(T, "minimumSpanningTree.txt",  delimiter=' ',)