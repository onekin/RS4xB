import math
import csv
import matplotlib.pyplot as plt
import re
#f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f2 = open('GroundTruth.csv', 'r')
f3 = open('GroundTruth.csv', 'r')
c2 = csv.reader(f2, delimiter=',')
c3 = csv.reader(f3, delimiter=',')

master_list = list(c2)
pattern = r'\'(.*?)\''
true_positives=0
total=0
precision=0.0
all_positives=0
pattern2 = r'\((.*?)\,'
feature_names=[]
row0=next(c3)
ground_truth={}
precisionsAtK=[2,3,4,5,6]
precisionsAtKValues=[]
for i in range(0,len(row0)):
    feature_names.append(row0[i])
    ground_truth[row0[i]]={}
for row in c3:
    for i in range(1,len(row)):
        ground_truth[feature_names[i]][row[0]]=row[i]
i=1
feature_recall={}

for precisionThreshold in precisionsAtK:
    f1 = open('../48percent_showcase_noStem2_50_0.9_0.05.csv','r')
    c1 = csv.reader(f1, delimiter=',')
    next(c1,None)
    total=0
    precision=0

    for row in c1:
        row_col= re.search(pattern,row[i]).group(1).replace("\'","")
        row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
        while i<precisionThreshold:
            if ground_truth[row[0]][row_col]=='1':
                true_positives=true_positives+1
            i=i+1
            row_col= re.search(pattern,row[i]).group(1).replace("\'","")
            row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
            all_positives=all_positives+1
        i=1
        if all_positives!=0:
            precision = precision+ true_positives/all_positives
            total=total+1
        print(row[0] +":"+ str(true_positives))
        true_positives=0
        all_positives=0
    total_precision = precision/total
    precisionsAtKValues.append(total_precision)

print(total)
print("The obtained precision is: "+ str(round(total_precision,2)))

plt.bar([pre-1 for pre in precisionsAtK], precisionsAtKValues)
plt.xlabel('Values for K')
plt.ylabel('Precision')
plt.savefig("precisionAtK.png")
plt.show()

