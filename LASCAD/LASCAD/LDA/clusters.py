import csv
import os
import pprint
from pathlib import Path
import re
import matplotlib.pyplot as plt
import numpy as np
import networkx as nx
import operator
from LASCAD.LDA.processProjects import run_preprocessing_categories
from LASCAD.LDA.runLDA import run_LDA_showcases
from LASCAD.experiments.expr2_similarProjects import print_accuracy
import math
clusters_count = 7
clusters_names = ["Cluster" + str(i) for i in range(1, clusters_count + 1)]
clusters = {
    'browsers': ["Cluster" + str(i) for i in range(1, clusters_count + 1)],
    'clusters_vol': [0 for i in range(1, clusters_count + 1)],
    'color': ['#5A69AF', '#579E65', '#F9C784', '#FC944A', '#F24C00', '#00B825', '#ffff00']
    # ,'#ffa200','#ff00ed','#8b4615']
}
clusters_features = {}
for name in clusters_names:
    clusters_features[name] = ""


class BubbleChart:
    def __init__(self, area, bubble_spacing=0):
        """
        Setup for bubble collapse.

        Parameters
        ----------
        area : array-like
            Area of the bubbles.
        bubble_spacing : float, default: 0
            Minimal spacing between bubbles after collapsing.

        Notes
        -----
        If "area" is sorted, the results might look weird.
        """
        area = np.asarray(area)
        r = np.sqrt(area / np.pi)

        self.bubble_spacing = bubble_spacing
        self.bubbles = np.ones((len(area), 4))
        self.bubbles[:, 2] = r
        self.bubbles[:, 3] = area
        self.maxstep = 2 * self.bubbles[:, 2].max() + self.bubble_spacing
        self.step_dist = self.maxstep / 2

        # calculate initial grid layout for bubbles
        length = np.ceil(np.sqrt(len(self.bubbles)))
        grid = np.arange(length) * self.maxstep
        gx, gy = np.meshgrid(grid, grid)
        self.bubbles[:, 0] = gx.flatten()[:len(self.bubbles)]
        self.bubbles[:, 1] = gy.flatten()[:len(self.bubbles)]

        self.com = self.center_of_mass()

    def center_of_mass(self):
        return np.average(
            self.bubbles[:, :2], axis=0, weights=self.bubbles[:, 3]
        )

    def center_distance(self, bubble, bubbles):
        return np.hypot(bubble[0] - bubbles[:, 0],
                        bubble[1] - bubbles[:, 1])

    def outline_distance(self, bubble, bubbles):
        center_distance = self.center_distance(bubble, bubbles)
        return center_distance - bubble[2] - \
               bubbles[:, 2] - self.bubble_spacing

    def check_collisions(self, bubble, bubbles):
        distance = self.outline_distance(bubble, bubbles)
        return len(distance[distance < 0])

    def collides_with(self, bubble, bubbles):
        distance = self.outline_distance(bubble, bubbles)
        idx_min = np.argmin(distance)
        return idx_min if type(idx_min) == np.ndarray else [idx_min]

    def collapse(self, n_iterations=50):
        """
        Move bubbles to the center of mass.

        Parameters
        ----------
        n_iterations : int, default: 50
            Number of moves to perform.
        """
        for _i in range(n_iterations):
            moves = 0
            for i in range(len(self.bubbles)):
                rest_bub = np.delete(self.bubbles, i, 0)
                # try to move directly towards the center of mass
                # direction vector from bubble to the center of mass
                dir_vec = self.com - self.bubbles[i, :2]

                # shorten direction vector to have length of 1
                dir_vec = dir_vec / np.sqrt(dir_vec.dot(dir_vec))

                # calculate new bubble position
                new_point = self.bubbles[i, :2] + dir_vec * self.step_dist
                new_bubble = np.append(new_point, self.bubbles[i, 2:4])

                # check whether new bubble collides with other bubbles
                if not self.check_collisions(new_bubble, rest_bub):
                    self.bubbles[i, :] = new_bubble
                    self.com = self.center_of_mass()
                    moves += 1
                else:
                    # try to move around a bubble that you collide with
                    # find colliding bubble
                    for colliding in self.collides_with(new_bubble, rest_bub):
                        # calculate direction vector
                        dir_vec = rest_bub[colliding, :2] - self.bubbles[i, :2]
                        dir_vec = dir_vec / np.sqrt(dir_vec.dot(dir_vec))
                        # calculate orthagonal vector
                        orth = np.array([dir_vec[1], -dir_vec[0]])
                        # test which direction to go
                        new_point1 = (self.bubbles[i, :2] + orth *
                                      self.step_dist)
                        new_point2 = (self.bubbles[i, :2] - orth *
                                      self.step_dist)
                        dist1 = self.center_distance(
                            self.com, np.array([new_point1]))
                        dist2 = self.center_distance(
                            self.com, np.array([new_point2]))
                        new_point = new_point1 if dist1 < dist2 else new_point2
                        new_bubble = np.append(new_point, self.bubbles[i, 2:4])
                        if not self.check_collisions(new_bubble, rest_bub):
                            self.bubbles[i, :] = new_bubble
                            self.com = self.center_of_mass()

            if moves / len(self.bubbles) < 0.1:
                self.step_dist = self.step_dist / 2

    def plot(self, ax, labels, colors):
        """
        Draw the bubble plot.

        Parameters
        ----------
        ax : matplotlib.axes.Axes
        labels : list
            Labels of the bubbles.
        colors : list
            Colors of the bubbles.
        """
        for i in range(len(self.bubbles)):
            circ = plt.Circle(
                self.bubbles[i, :2], self.bubbles[i, 2], color=colors[i])
            ax.add_patch(circ)
            ax.text(*self.bubbles[i, :2], labels[i],
                    horizontalalignment='center', verticalalignment='center')

    def clearProcessedOutput():
        for elem in Path('../../../../showcases_out/').rglob('*.*'):
            os.remove(elem)

    def getClusteGraphDiameter(filename):
        f1 = open(filename,'r')

        c1 = csv.reader(f1, delimiter=',')
        pattern_feature = r'\'(.*?)\''
        pattern_value = r'\((.*?)\,'
        edges = []
        nodes = set()
        G = nx.Graph()
        next(c1,None)
        for row in c1:
            nodes.add(row[0])
            for i in range(1,len(row)-1):
                col_value = float(re.search(pattern_value,row[i]).group(1))
                feature = re.search(pattern_feature,row[i]).group(1)
                if col_value<0.82:
                    edges.append((row[0],feature,{'weight': 1-col_value}))
        G.add_nodes_from(nodes)
        G.add_edges_from(edges)
        length = dict(nx.all_pairs_dijkstra_path_length(G))
        list_max = [max(item.items(), key=operator.itemgetter(1))[1] for item in length.values()]
        diameter = round(max(list_max),3)
        #return '#585858ff'
        factor = 5 * round(((diameter*100/3)/5))
        if (factor*255.0/100.)%1.0<.5:
            percent_hex = math.floor(factor*255.0/100.0)
        else:
            percent_hex = math.ceil(factor*255.0/100.0)
        if percent_hex ==0:
           return '#5858580d'
        return '#585858'+hex(percent_hex).split('x')[-1]



f1 = open(str(clusters_count) + 'cluster_project_cat_showcase_noStem2_50_0.9_0.05_LASCAD.csv', 'r')

c1 = csv.reader(f1, delimiter=',')
pattern = r'\'(.*?)\''

cluster_features = {}
for i in range(1, clusters_count + 1):
    cluster_features['Cluster' + str(i)] = []
next(c1, None)
for row in c1:
    for i in range(1, len(row)):
        if float(row[i]) != 0.0:
            clusters['clusters_vol'][i - 1] = clusters['clusters_vol'][i - 1] + 1
            clusters_features['Cluster' + str(i)] = clusters_features['Cluster' + str(i)] + ", " + row[0]
            cluster_features['Cluster' + str(i)].append(row[0])
            if len(clusters_features['Cluster' + str(i)]) > 250:
                clusters_features['Cluster' + str(i)] = clusters_features['Cluster' + str(i)] + "\n"
for j in range(1, len(cluster_features) + 1):
    f1 = open("../config/Cluster" + str(j) + ".json", "w")
    f1.write("{")
    for element in cluster_features['Cluster' + str(j)]:
        f1.write('"' + element + '":{"language": "JavaScript","group": "Test" }')
        if cluster_features['Cluster' + str(j)].index(element) != len(cluster_features['Cluster' + str(j)]) - 1:
            f1.write(",")
    f1.write("}")
    f1.close()
    run_preprocessing_categories("cluster" + str(j))
    run_LDA_showcases(dataset="cluster" + str(j))
    print_accuracy(NUM_TOPICS=50, max_df=0.9, min_df=.05, n_clusters=20, dataset='showcase_noStem2', loadSaved=False,
                   top_max=len(cluster_features['Cluster' + str(j)]), file_prefix='Cluster' + str(j))
    clusters['color'][j-1] = BubbleChart.getClusteGraphDiameter('../results/similarApps/Cluster' + str(j)+'showcase_noStem2_50_0.9_0.05.csv')
    clusters['browsers'][j-1] =clusters['browsers'][j-1] + '- Length:'+ str(clusters['clusters_vol'][j-1])
    BubbleChart.clearProcessedOutput()

bubble_chart = BubbleChart(area=clusters['clusters_vol'],
                           bubble_spacing=0.1)

bubble_chart.collapse()

fig, ax = plt.subplots(subplot_kw=dict(aspect="equal"), figsize=(25, 13))
bubble_chart.plot(
    ax, clusters['browsers'], clusters['color'])
ax.axis("off")
ax.relim()
ax.autoscale_view()
pp = pprint.PrettyPrinter(indent=2)
title = ""
for key, value in clusters_features.items():
    print(value)
    title = title + key + ":" + value + "\n\n"
ax.set_title(title)
plt.show()
fig.savefig(str(clusters_count) + "clusters")
