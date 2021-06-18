import math
import csv
import numpy as np
import re
from scipy import stats
import pandas as pd
import kendall_w as kw
from sklearn.metrics import cohen_kappa_score
from numpy.random import default_rng
import matplotlib.pyplot as plt

import rbo

def average_overlap(x,y):
    average_overlap=0
    if len(x)==len(y):
        for i in range(0,len(x)):
            agreement_size = len(set(x[:i+1]) & set(y[:i+1]))
            average_overlap=average_overlap+agreement_size/(i+1)
        return average_overlap/len(x)


tangling_matrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)
croscutting_matrix = pd.read_csv('SPLMinercrosscuttingSimilarity.csv', header=0, index_col=0)

ao_values= []

isNan=False
for feature in tangling_matrix.keys():

    croscutting_recommendation = croscutting_matrix[feature]
    croscutting_recommendation=croscutting_recommendation.drop(labels=[feature])
    ranked_croscutting=[]
    for croscutting_item in croscutting_recommendation.items():
        ranked_croscutting.append(croscutting_item)
    ranked_croscutting= sorted(ranked_croscutting, key=lambda x: x[1])

    tangling_recommendation = tangling_matrix[feature]
    tangling_recommendation=tangling_recommendation.drop(labels=[feature])
    ranked_tangling=[]
    for tangling_item in tangling_recommendation.items():
        ranked_tangling.append(tangling_item)
    ranked_tangling= sorted(ranked_tangling, key=lambda x: x[1])
    i=0
    croscutting_order=[]
    tangling_order=[]
    while (i <7):
        feature_name = ranked_tangling[i][0]
        croscutting_order.append(feature_name)
        feature_name = ranked_croscutting[i][0]
        tangling_order.append(feature_name)
        i = i + 1
    ao_similarity = average_overlap(tangling_order,croscutting_order)
    print( feature + "\t" +str(average_overlap(tangling_order,croscutting_order)))
    ao_values.append(ao_similarity)

print("Average AO \t" + str(np.average(ao_values)) )
print("STDEV AO  \t " + str(np.std(ao_values)) )

