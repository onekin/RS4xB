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

def ccc(x,y):
    ''' Concordance Correlation Coefficient'''
    sxy = np.sum((x - x.mean())*(y - y.mean()))/x.shape[0]
    rhoc = 2*sxy / (np.var(x) + np.var(y) + (x.mean() - y.mean())**2)
    return rhoc


tangling_matrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)
croscutting_matrix = pd.read_csv('SPLMinercrosscuttingSimilarity.csv', header=0, index_col=0)

rbo_values= []

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
    rbo_similarity = rbo.RankingSimilarity(tangling_order,croscutting_order)
    print("RBO for feature "+ feature + "= " +str(rbo_similarity.rbo()))
    rbo_values.append(rbo_similarity.rbo())

print("Average ccc: " + str(np.average(rbo_values)) )

