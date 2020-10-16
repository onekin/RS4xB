import math
import csv
import matplotlib.pyplot as plt
import re
#f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('../48percent_showcase_noStem2_50_0.9_0.05.csv','r')
f2 = open('GroundTruth.csv', 'r')
f3 = open('GroundTruth.csv', 'r')
c1 = csv.reader(f1, delimiter=',')
c2 = csv.reader(f2, delimiter=',')
c3 = csv.reader(f3, delimiter=',')

master_list = list(c2)
pattern = r'\'(.*?)\''
aggregated_recall=0
true_positives=0
total=0
total_for_precision=0
recall=0.0
precision=0.0
all_positives=0
pattern2 = r'\((.*?)\,'
next(c1,None)
feature_names=[]
row0=next(c3)
ground_truth={}
for i in range(0,len(row0)):
    feature_names.append(row0[i])
    ground_truth[row0[i]]={}
for row in c3:
    for i in range(1,len(row)):
        ground_truth[feature_names[i]][row[0]]=row[i]
i=1
feature_recall={}
for row in c1:
    row_col= re.search(pattern,row[i]).group(1).replace("\'","")
    row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
    while float(row_value)<0.65:
        if ground_truth[row[0]][row_col]=='1':
            true_positives=true_positives+1
        i=i+1
        row_col= re.search(pattern,row[i]).group(1).replace("\'","")
        row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
        all_positives=all_positives+1
    print("Feature "+row[0]+" positives:"+ str(all_positives))
    recall = recall + (true_positives/sum(value == '1' for value in ground_truth[row[0]].values()))
    i=1
    if all_positives!=0:
        precision = precision+ true_positives/all_positives
        total_for_precision=total_for_precision+1
    #print(row[0] +":"+ str(true_positives))
    feature_recall[row[0]]= int(true_positives)
    true_positives=0
    all_positives=0
    total=total+1

total_recall = recall/total
total_precision = precision/total_for_precision
print(total)
print("The obtained recall is: "+ str(round(total_recall,2)))
print("The obtained precision is: "+ str(round(total_precision,2)))


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

