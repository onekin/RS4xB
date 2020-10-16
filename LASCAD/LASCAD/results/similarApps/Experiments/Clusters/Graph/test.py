from pyvis.network import Network
import csv
import re
import random

f1 = open('minimumSpanningTree.txt','r')

c1 = csv.reader(f1, delimiter=' ')
edges = []
nodes = set()
haritz_list= ["Background3", "Update", "UserFilter", "Delete", "Create", "DeleteAll", "AnnotationList", "Canvas", "LastAnnotation", "TextSummary", "ACM", "Springer", "Hosting", "URN", "TXT", "AnnotatedPDF", "PDF", "HTML", "Replying", "Selector", "Classifying", "SidebarNavigation", "Multivalued", "Hierarchy", "Autocomplete", "CodebookUpdate", "Codebook", "BuiltIn", "ApplicationBased", "ExportCodebook", "ImportCodebook"]

for row in c1:
    for i in range(1,len(row)):
        from_edge=row[0].split('-')[0]+'('+str(row[0].split('-')[1])+','+str(haritz_list.index(row[0].split('-')[0])+1)+')'
        to_edge=row[1].split('-')[0]+'('+row[1].split('-')[1]+','+str(haritz_list.index(row[1].split('-')[0])+1)+')'
        nodes.add(from_edge)
        nodes.add(to_edge)
        edges.append( {"from":from_edge, "to":to_edge, "weight": row[2] , "label":str(round(1-float(row[2]),2))})



nt = Network("2000px", "2000px",directed=False)
colors= ["#0000FF" + hex(round((int(node.split('(')[-1].split(',')[0])+1)*3.1*255/100)).split('x')[-1] for node in nodes]
#colors= ["#"+ "%06x" % random.randint(0, 0xFFFFFF) for i in range(0,59)]

nt.add_nodes(nodes=list(nodes), color=colors)
for edge in edges:
    nt.add_edge(edge['from'], edge['to'], width=float(edge['weight'])*5, label=edge['label'])
# populates the nodes and edges data structures
#nt.from_nx(nx_graph)
options = '''var options = {
  "edges": {
    "color": {
      "color": "rgba(132,132,132,0.34)",
      "highlight": "rgba(0,23,38,1)",
      "inherit": false
    },
    "smooth": false
  },
  "interaction": {
    "hoverConnectedEdges": false
  },
  "physics": {
    "barnesHut": {
      "avoidOverlap": 0.72
    },.split("-")[0]
    "minVelocity": 0.75
  }
}'''
#nt.set_options(options)
nt.show_buttons()
nt.show("linkingnx.html")
