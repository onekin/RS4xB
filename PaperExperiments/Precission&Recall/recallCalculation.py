import math
import csv
import matplotlib.pyplot as plt
#f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('48percent_showcase_noStem2_50_0.9_0.05.csv','r')
f2 = open('groundTruth.csv', 'r')

c1 = csv.reader(f1, delimiter=',')
c2 = csv.reader(f2, delimiter=',')
master_list = list(c2)
pattern = r'\'(.*?)\''
aggregated_recall=0
positives=0
total=0
recall=0.0
pattern = r'\'(.*?)\''
next(c1,None)
import re
feature_recall={}
for row in c1:
    for feature in master_list:
        if feature[0]==row[0]:
            for i in range(1,6):
                row_col= re.search(pattern,row[i]).group(1).replace("\'","")
                if row_col in [feature[i] for i in range(1,6)]:
                    positives=positives+1
            recall = recall + (positives/5)
            print(feature[0] +":"+ str(positives))
            feature_recall[feature[0]]= int(positives)
            positives=0
            total=total+1
            break
total_recall = recall/total
print(total)
print("The obtained recall is: "+ str(round(total_recall,2)))


x = feature_recall.keys()
y = feature_recall.values()
lists = sorted(zip(*[y, x]))
y, x = list(zip(*lists))
plt.plot(x, y)
fig = plt.figure(figsize=(20, 10))
ax = fig.add_subplot()
ax.plot(x, y, 'bo-', linewidth=2, markersize=6)
plt.xticks(x, rotation='vertical')
plt.yticks(range(min(y), math.ceil(max(y))+1))
plt.show()
fig.savefig("feature_positives_0_9-48")

