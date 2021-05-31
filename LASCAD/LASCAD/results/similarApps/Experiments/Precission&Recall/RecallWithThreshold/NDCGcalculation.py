import math
import csv
import matplotlib.pyplot as plt
import re
import math
#f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('../48percent_showcase_noStem2_50_0.9_0.05.csv','r')
f3 = open('GroundTruthClasificated.csv', 'r')
c1 = csv.reader(f1, delimiter=',')
c3 = csv.reader(f3, delimiter=',')

pattern = r'\'(.*?)\''
pattern2 = r'\((.*?)\,'
next(c1,None)
feature_names=[]
row0=next(c3)
IDCG=0
DCG=0
current_idcg_list=[]
agregated_ndcg=0
ground_truth={}
feature_ndcg={}
for i in range(0,len(row0)):
    feature_names.append(row0[i])
for row in c3:
    ground_truth[row[0]]={}
    for i in range(1,len(row)):
        ground_truth[row[0]][feature_names[i]]=row[i]
i=1
total=0
for row in c1:
    if(row[0] in ground_truth.keys()):
        row_col= re.search(pattern,row[i]).group(1).replace("\'","")
        row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
        while float(row_value)<0.5:
            DCG=DCG+(float(ground_truth[row[0]][row_col])/math.log2(i+1))
            current_idcg_list.append(float(ground_truth[row[0]][row_col]))
            row_col= re.search(pattern,row[i]).group(1).replace("\'","")
            row_value = re.search(pattern2,row[i]).group(1).replace("\'","")
            i=i+1
        current_idcg_list.sort(reverse=True)
        for j in range(0,len(current_idcg_list)):
            IDCG=IDCG+ (current_idcg_list[j]/math.log2(j+2))
        agregated_ndcg=agregated_ndcg+ DCG/IDCG
        print(row[0]+" :" +str(DCG/IDCG))
        feature_ndcg[row[0]]=DCG/IDCG
        #print("l1: "+str(test_count)+" l2: " +str(len(current_idcg_list)))
        total=total+1
        current_idcg_list=[]
        i=1
    DCG=0
    IDCG=0

NDCG = agregated_ndcg/total
print("NDCG with threshold 0.5= "+str(NDCG))

x = feature_ndcg.keys()
y = feature_ndcg.values()
plt.bar(x, y)
fig = plt.figure(figsize=(35, 10))
ax = fig.add_subplot()
ax.bar(x, y,width=0.5)
for label in (ax.get_xticklabels() + ax.get_yticklabels()):
    label.set_fontname('Arial')
    label.set_fontsize(25)
plt.xlabel('Features', fontsize=20)
plt.ylabel('NDCG', fontsize=20)
plt.xticks(rotation=40)
plt.show()

plt.draw()
fig.savefig("ndcg-perFeature.png")

