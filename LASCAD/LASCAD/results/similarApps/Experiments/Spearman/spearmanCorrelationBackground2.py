from scipy import stats
import numpy as np
import matplotlib.pyplot as plt
list1=["AnnotatedPDF-1","Remote-1","AnnotationList-1","Canvas-1","LastAnnotation-1","TextSummary-1","Hypothesis-1","AnnotationServer-1","WebAnnotationClient-1","ScienceDirect-1","Hosting-1","Springer-1","ACM-1","DOI-1","Dropbox-1","URL-1","URN-1","TXT-1","PDF-1","HTML-1","CodebookTypology-1","Manual-1","RenameCodebook-1","CodebookDelete-1","ExportCodebook-1","ImportCodebook-1","Codebook-1","TopicBased-1","BuiltIn-1","SentimentAnalysis-1",
       "Update-2","UserFilter-2","Delete-2","Create-2","DeleteAll-2","AnnotationList-2","Canvas-2","LastAnnotation-2","TextSummary-2","ACM-2","Springer-2","Hosting-2","URN-2","TXT-2","AnnotatedPDF-2","PDF-2","HTML-2","Replying-2","Selector-2","Classifying-2","SidebarNavigation-2","Multivalued-2","Hierarchy-2","Autocomplete-2","CodebookUpdate-2","Codebook-2","BuiltIn-2","ApplicationBased-2","ExportCodebook-2","ImportCodebook-2",
       "ImportAnnotations-3","JSON-3","Export-3","ImportCodebook-3","ExportCodebook-3","BuiltIn-3","Manual-3","RenameCodebook-3","CodebookDelete-3","ApplicationBased-3","Codebook-3","CodebookUpdate-3","Hierarchy-3","Multivalued-3","SidebarNavigation-3","Classifying-3","Autocomplete-3","MoodleReport-3","Selector-3","Replying-3","Dropbox-3","MoodleConsumer-3","MoodleResource-3","MoodleComment-3","URL-3","TXT-3","Categorize-3","Assessing-3","Commenting-3","SuggestedLiterature-3"]
list2=["AnnotatedPDF-1","AnnotationList-1","Canvas-1","LastAnnotation-1","TextSummary-1","SentimentAnalysis-1","Remote-1","Hypothesis-1","AnnotationServer-1","CodebookTypology-1","WebAnnotationClient-1","ScienceDirect-1","Hosting-1","Springer-1","ACM-1","DOI-1","Dropbox-1","URN-1","URL-1","TXT-1","PDF-1","HTML-1","Manual-1","RenameCodebook-1","CodebookDelete-1","ExportCodebook-1","ImportCodebook-1","Codebook-1","TopicBased-1","BuiltIn-1",
       "Update-2","UserFilter-2","Delete-2","Create-2","DeleteAll-2","AnnotationList-2","Canvas-2","LastAnnotation-2","TextSummary-2","ACM-2","Springer-2","Hosting-2","URN-2","TXT-2","AnnotatedPDF-2","PDF-2","HTML-2","Replying-2","Selector-2","Classifying-2","SidebarNavigation-2","Multivalued-2","Hierarchy-2","CodebookUpdate-2","Autocomplete-2","Codebook-2","BuiltIn-2","ExportCodebook-2","ImportCodebook-2","ApplicationBased-2",
       "ImportAnnotations-3","JSON-3","Export-3","ImportCodebook-3","ExportCodebook-3","BuiltIn-3","Manual-3","RenameCodebook-3","CodebookDelete-3","ApplicationBased-3","Codebook-3","CodebookUpdate-3","Hierarchy-3","Multivalued-3","SidebarNavigation-3","Classifying-3","Autocomplete-3","Selector-3","Replying-3","Categorize-3","Assessing-3","Commenting-3","SuggestedLiterature-3","MoodleReport-3","Dropbox-3","MoodleConsumer-3","MoodleResource-3","URL-3","MoodleComment-3","TXT-3"]
data1=[list1.index(feature) for feature in list1]
data2=[list1.index(feature) for feature in list2]
distance=[(data1[i]-data2[i])**2 for i in range(0,len(data1))]
sum_di=sum(([(data1[i]-data2[i])**2 for i in range(0,len(data1))]))
sum=0
for element in distance:
    sum=sum+element

print(data1)
print(data2)
plt.scatter(data1,data2)
spearman_value=1-(6*sum_di/(len(data1)*(len(data1)**2-1)))
plt.ylabel("Mentor Order", fontsize=14)
plt.xlabel("Spanning Tree Order", fontsize=14)
plt.title("Spearman correlation=0.99\nPearson correlation=0.99", fontsize=14)
plt.show()
print(spearman_value)
print(stats.spearmanr(list1,list2))
print("pearson"+str(stats.pearsonr(data1,data2)))



