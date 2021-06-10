import math
import csv
import numpy as np
import re
from scipy import stats
import pandas as pd

# f1 = open('../../similarApps_showcase_noStem2_50_0.9_0.05.csv', 'r')
f1 = open('48percent_showcase_noStem2_50_0.9_0.05.csv', 'r')
c1 = csv.reader(f1, delimiter=',')


pattern = r'\'(.*?)\''
pattern2 = r'\((.*?)\,'
next(c1, None)



total = 0

tanglingMatrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)

tangling_order=[1,2,3,4,5,6]
spearman_correlation = []
spearman_pvalues = []
for row in c1:
    tangling_recommendation = tanglingMatrix[row[0]]
    tangling_recommendation=tangling_recommendation.drop(labels=[row[0]])
    ranked_tangling=[]
    for item in tangling_recommendation.items():
        ranked_tangling.append(item)
    ranked_tangling= sorted(ranked_tangling, key=lambda x: x[1])
    i=1
    semantic_order=[]
    while (i <7):
            feature_name = re.search(pattern, row[i]).group(1).replace("\'", "")
            search_list = [index for (index, a_tuple) in enumerate(ranked_tangling) if a_tuple[0]==feature_name]
            if len(search_list)==1:
                semantic_order.append(search_list[0])
            else:
                break
            i = i + 1
    i=1
    spearman = stats.weightedtau(tangling_order,semantic_order)
    print(spearman[0])
    spearman_correlation.append(spearman[0])
    #print(spearman[0])
    spearman_pvalues.append(spearman[1])

print("Average of the correlation " + str(np.average(spearman_correlation)))
print("Standard deviation of the correlation " + str(np.std(spearman_correlation)))

print("Average of the pvalue " + str(np.average(spearman_pvalues)))
print("Standard deviation of the pvalue " + str(np.std(spearman_pvalues)))

