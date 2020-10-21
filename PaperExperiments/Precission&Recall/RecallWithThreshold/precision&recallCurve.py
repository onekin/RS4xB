# precision-recall curve and f1
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve
from sklearn.metrics import f1_score
from sklearn.metrics import auc
from matplotlib import pyplot

# plot the precision-recall curves
#lr_recall=[0,0.16,0.17,0.28,0.33,0.35,0.4,0.42,0.46,0.5,0.55,0.58,0.66,1,1,1,1,1,1,1]
lr_recall=[0.09,0.15,0.16,0.25,0.29,0.31,0.36,0.38,0.43,0.48,0.53,0.56,0.64,1,1,1,1,1,1,1]
#lr_precision =[0.94,0.88,0.83,0.85,0.84,0.81,0.74,0.71,0.68,0.63,0.56,0.48,0.4,0.16,0.16,0.16,0.16,0.16,0.16,0.16]
#lr_precision =[0,0.59,0.61,0.77,0.76,0.73,0.69,0.66,0.65,0.62,0.55,0.47,0.4,0.16,0.16,0.16,0.16,0.16,0.16,0.16]
lr_precision= [0.91,0.83,0.77,0.81,0.79,0.74,0.68,0.64,0.61,0.57,0.49,0.41,0.36,0.16,0.16,0.16,0.16,0.16,0.16,0.16]
no_skill = 0.164689266
pyplot.plot([0, 1], [no_skill, no_skill], linestyle='--', label='No Skill')
pyplot.plot(lr_recall, lr_precision, marker='.', label='Logistic')
# axis labels
pyplot.xlabel('Recall')
pyplot.ylabel('Precision')
# show the legend
pyplot.legend()
# show the plot
pyplot.show()