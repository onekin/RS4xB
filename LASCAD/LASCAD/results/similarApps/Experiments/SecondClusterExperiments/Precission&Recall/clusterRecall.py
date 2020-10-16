import math
import csv
import matplotlib.pyplot as plt
#f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('../similarApps_showcase_noStem2_50_0.9_0.05.csv','r')
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
similar_features=0
feature_recall={}
for row in c1:
    for feature in master_list:
        if feature[0]==row[0]:
            for j in range(1,6):
                if feature[j]!='-':
                    similar_features=similar_features +1
            for i in range(1,similar_features +1):
                row_col= re.search(pattern,row[i]).group(1).replace("\'","")
                if row_col in [feature[i] for i in range(1,similar_features +1)]:
                    positives=positives+1
            recall = recall + (positives/similar_features)
            print(feature[0] +":"+ str(positives))
            feature_recall[feature[0]]= int(positives/similar_features*100)
            similar_features=0
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
x= list(x).append('TOTAL')
y = list(y).append(float(total_recall)*100)
plt.plot(x, y)
fig = plt.figure(figsize=(20, 12))
ax = fig.add_subplot()
ax.plot(x, y, 'bo-', linewidth=2, markersize=6)
plt.xticks(x, rotation='vertical')
plt.show()
fig.savefig("feature_positives_cluster")

