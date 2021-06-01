import math
import csv
import matplotlib.pyplot as plt
import re
import pandas as pd
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
precisionsAtK=[2,3,4,5,6,7,8,9,10,11]
precisionsAtKValues=[]
for i in range(0,len(row0)):
        feature_names.append(row0[i])
        ground_truth[row0[i]]={}
for row in c3:
    for i in range(1,len(row)):
            ground_truth[feature_names[i]][row[0]]=row[i]
ground_truth.pop("",None)
i=1
feature_recall={}

croscuttingMatrix = pd.read_csv('SPLMinercrosscuttingSimilarity.csv', header=0, index_col=0)
tanglingMatrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)
final_similarity = {feature: [] for feature in ground_truth.keys()}

f1 = open('../48percent_showcase_noStem2_50_0.9_0.05.csv','r')
c1 = csv.reader(f1, delimiter=',')

next(c1,None)
for row in c1:
    #print(row)
    if (row[0] in ground_truth.keys()):
        while (i < len(row)):
            feature_name = re.search(pattern, row[i]).group(1).replace("\'", "")
            similarity_value = re.search(pattern2, row[i]).group(1).replace("\'", "")
            final_value = 0.5*(1-float(similarity_value)) + 0.1*(croscuttingMatrix[row[0]][feature_name]) + 0.4*(tanglingMatrix[row[0]][feature_name])
            #final_value = (float(similarity_value))*(1-croscuttingMatrix[row[0]][feature_name])*(1-tanglingMatrix[row[0]][feature_name])
            #final_value = float(similarity_value)
            final_similarity[row[0]].append((feature_name, final_value))
            i = i + 1
    i = 1

for key in final_similarity.keys():
    final_similarity[key] = sorted(final_similarity[key], key=lambda x: x[1], reverse=True)

i=0
for precisionThreshold in precisionsAtK:

    total=0
    precision=0

    for key in final_similarity.keys():
        feature_name= final_similarity[key][i][0]
        similarity_value = final_similarity[key][i][1]
        while i<precisionThreshold-1:
            if ground_truth[key][feature_name]== '1':
                true_positives=true_positives+1
            i=i+1
            feature_name= final_similarity[key][i][0]
            similarity_value = final_similarity[key][i][1]
            all_positives=all_positives+1
        i=0
        if all_positives!=0:
            precision = precision+ true_positives/all_positives
            total=total+1
        #print(key +":"+ str(true_positives))
        true_positives=0
        all_positives=0
    total_precision = precision/total
    precisionsAtKValues.append(total_precision)
    print("The obtained precision @"+ str(precisionThreshold-1) +" is: "+ str(round(total_precision,2)))


#(total)

plt.bar([pre-1 for pre in precisionsAtK], precisionsAtKValues)
plt.xlabel('Values for K')
plt.ylabel('Precision')
plt.savefig("precisionAtK.png")
plt.show()

