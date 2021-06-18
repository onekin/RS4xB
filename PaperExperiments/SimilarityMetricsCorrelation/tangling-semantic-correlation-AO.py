import math
import csv
import numpy as np
import re
from scipy import stats
import pandas as pd

def average_overlap(x,y):
    average_overlap=0
    if len(x)==len(y):
        for i in range(0,len(x)):
            agreement_size = len(set(x[:i+1]) & set(y[:i+1]))
            average_overlap=average_overlap+agreement_size/(i+1)
        return average_overlap/len(x)


# f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('48percent_showcase_noStem2_50_0.9_0.05.csv', 'r')
c1 = csv.reader(f1, delimiter=',')


pattern = r'\'(.*?)\''
pattern2 = r'\((.*?)\,'
next(c1, None)



total = 0

tanglingMatrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)

ao_values = []
for row in c1:
    tangling_recommendation = tanglingMatrix[row[0]]
    tangling_recommendation=tangling_recommendation.drop(labels=[row[0]])
    ranked_tangling=[]
    for item in tangling_recommendation.items():
        ranked_tangling.append(item)
    ranked_tangling= sorted(ranked_tangling, key=lambda x: x[1])
    i=1
    semantic_order=[]
    tangling_order = []
    while (i <7):
            feature_name = re.search(pattern, row[i]).group(1).replace("\'", "")
            semantic_tuple = [a_tuple for (index, a_tuple) in enumerate(ranked_tangling) if a_tuple[0]==feature_name]
            semantic_order.append(semantic_tuple[0][0])
            feature_name = ranked_tangling[i][0]
            tangling_order.append(feature_name)
            i = i + 1
    i=1
    ao_similarity = average_overlap(tangling_order,semantic_order)
    print( row[0] + "\t" +str(average_overlap(tangling_order,semantic_order)))
    ao_values.append(ao_similarity)

print("Average AO: " + str(np.average(ao_values)) )
print("STDEV AO: " + str(np.std(ao_values)) )
