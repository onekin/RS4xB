import csv

import matplotlib.pyplot as plt

f1 = open('cosine_showcase_noStem2_50_0.9_0.05.csv', 'r')

c1 = csv.reader(f1, delimiter=',')
pattern = r'\'(.*?)\''
complexity_window = {}
pattern = r'\((.*?)\,'
next(c1,None)
import re
x = ['0-0.1','0.1-0.2','0.3-0.4','0.4-0.5','0.5-0.6','0.6-0.7', '0.7-0.8', '0.8-1']
for row in c1:
    for column in range(1,len(row)):
        complexity = round(float(re.search(pattern,row[column]).group(1)),2)
        if complexity in complexity_window.keys():
            complexity_window[complexity] = complexity_window[complexity]+1
        else:
            complexity_window[complexity]=1
    x = complexity_window.keys()
    y = complexity_window.values()
    #lists = sorted(zip(*[top1, features]),reverse=True)
    #y, x = list(zip(*lists))

    fig = plt.figure(figsize=(20, 10))
    ax = fig.add_subplot(111)
    ax.plot(x, y, 'bo-', linewidth=2, markersize=6)
    fig.savefig("cosine/"+row[0])
    plt.close(fig)
    complexity_window={}
