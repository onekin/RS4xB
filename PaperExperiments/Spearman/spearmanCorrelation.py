from scipy import stats
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


list1=["AnnotatedPDF", "Remote", "AnnotationList", "Canvas", "LastAnnotation", "TextSummary", "Hypothesis", "AnnotationServer", "WebAnnotationClient", "ScienceDirect", "Hosting", "Springer", "ACM", "DOI", "Dropbox", "URL", "URN", "TXT", "PDF", "HTML", "CodebookTypology", "Manual", "RenameCodebook", "CodebookDelete", "ExportCodebook", "ImportCodebook", "Codebook", "TopicBased", "BuiltIn", "SentimentAnalysis"]
list2=["AnnotatedPDF", "AnnotationList", "Canvas", "LastAnnotation", "TextSummary", "SentimentAnalysis", "Remote", "Hypothesis", "AnnotationServer", "CodebookTypology", "WebAnnotationClient", "ScienceDirect", "Hosting", "Springer", "ACM", "DOI", "Dropbox", "URN", "URL", "TXT", "PDF", "HTML", "Manual", "RenameCodebook", "CodebookDelete", "ExportCodebook", "ImportCodebook", "Codebook", "TopicBased", "BuiltIn"]
data1=[list1.index(feature) for feature in list1]
data2=[list1.index(feature) for feature in list2]
sum_di=sum(([(data1[i]-data2[i])^2 for i in range(0,len(data1))]))
plt.scatter(data1, data2)
spearman_value=1-(5*sum_di/(len(data1)*(len(data1)^2-1)))
plt.ylabel("Mentor Order", fontsize=14)
plt.xlabel("Spanning Tree Order", fontsize=14)
plt.title("Spearman correlation=0.58\nPearson correlation=0.58 ", fontsize=14)
plt.show()
print(spearman_value)
