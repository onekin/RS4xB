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



def ccc(x,y):
    ''' Concordance Correlation Coefficient'''
    sxy = np.sum((x - x.mean())*(y - y.mean()))/x.shape[0]
    rhoc = 2*sxy / (np.var(x) + np.var(y) + (x.mean() - y.mean())**2)
    return rhoc


tangling_matrix = pd.read_csv('SPLMinertanglingSimilarity.csv', header=0, index_col=0)
croscutting_matrix = pd.read_csv('SPLMinercrosscuttingSimilarity.csv', header=0, index_col=0)

tau_values = []
ccc_values = []

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
    while (i <6):
        feature_name = ranked_tangling[i][0]
        index = list(tangling_matrix.keys()).index(feature_name)
        the_tuple = [a_tuple for (index, a_tuple) in enumerate(ranked_croscutting) if a_tuple[0]==feature_name]
        croscutting_order.append(index+1)
        feature_name = ranked_croscutting[i][0]
        index = list(tangling_matrix.keys()).index(feature_name)
        tangling_order.append(index+1)
        the_tuple = [a_tuple for (index, a_tuple) in enumerate(ranked_croscutting) if a_tuple[0]==feature_name]
        i = i + 1
        if len(tangling_order)==6 and len(croscutting_order)==6 :
            tau, pvalue = stats.kendalltau(tangling_order,croscutting_order)
            ccc_value = ccc(np.array(tangling_order),np.array(croscutting_order))
            print("FEATURE :" +feature_name +" TAU: "+str(tau) +" Pvalue: "+ str(pvalue) + " CCC: "+str(ccc_value) )
            tau_values.append(tau)
            ccc_values.append(ccc_value)

print("Average ccc: +-" + str(np.average(tau_values)) )

