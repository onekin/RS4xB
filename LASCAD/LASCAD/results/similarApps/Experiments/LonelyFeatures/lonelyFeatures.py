import csv

import matplotlib.pyplot as plt

f1 = open('../Precission&Recall/48percent_showcase_noStem2_50_0.9_0.05.csv', 'r')

c1 = csv.reader(f1, delimiter=',')
pattern = r'\'(.*?)\''
positives=0
features = []
top1 = []
top2 = []
top3 = []
pattern = r'\((.*?)\,'
next(c1,None)
import re
for row in c1:
    features.append(row[0])
    top1.append(float(re.search(pattern,row[1]).group(1)))
    top2.append(float(re.search(pattern,row[2]).group(1)))
    top3.append(float(re.search(pattern,row[3]).group(1)))


lists = sorted(zip(*[top1, features]),reverse=True)
lists2 = sorted(zip(*[top1, top2]),reverse=True)
lists3 = sorted(zip(*[top1, top3]),reverse=True)
y, x = list(zip(*lists))
y, y2 = list(zip(*lists2))
y, y3 = list(zip(*lists3))

plt.plot(x, y)
fig = plt.figure(figsize=(20, 10))
ax = fig.add_subplot(111)
ax.plot(x, y, 'bo-', linewidth=2, markersize=6)
ax.plot(x, y2, 'go-', linewidth=2, markersize=6)
ax.plot(x, y3, 'ro-', linewidth=2, markersize=6)
ax.hlines(y=0.5, xmin=0, xmax=len(x), ls='--')
plt.xticks(x, rotation='vertical')
plt.show()
fig.savefig("Lonely_features")