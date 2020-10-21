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
recall=0.0
precision=0.0
all_positives=0
pattern2 = r'\((.*?)\,'
next(c1,None)
feature_names=[]
row0=next(c3)
ground_truth={}
all_true_positives = 0
for i in range(0,len(row0)):
    feature_names.append(row0[i])
    ground_truth[row0[i]]={}
for row in c3:
    for i in range(1,len(row)):
        ground_truth[feature_names[i]][row[0]]=row[i]
        if row[i]=='1':
            all_true_positives=all_true_positives+1
i=1
feature_recall={}
for row in c1:
    row_col= re.search(pattern,row[i]).group(1).replace("\'","")
    row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
    while float(row_value)<0.5:
        if ground_truth[row[0]][row_col]=='1':
            true_positives=true_positives+1
        i=i+1
        row_col= re.search(pattern,row[i]).group(1).replace("\'","")
        row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
        all_positives=all_positives+1
    i=1
    #print(row[0] +":"+ str(true_positives))
    feature_recall[row[0]]= int(true_positives)

total_recall = true_positives/all_true_positives
total_precision = true_positives/all_positives
print("The obtained recall is: "+ str(round(total_recall,2)))
print("The obtained precision is: "+ str(round(total_precision,2)))


