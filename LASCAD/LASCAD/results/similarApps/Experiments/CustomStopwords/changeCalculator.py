import csv
import pprint
import re
import csv
import sys
import os

f1 = open('withoutStpWrd.csv', 'r')
f2 = open('withStpWrd.csv', 'r')

c1 = csv.reader(f1, delimiter=',')
c2 = csv.reader(f2, delimiter=',')
master_list = list(c2)
next(c1, None)
row_num=1
changes=0
pattern = r'\'(.*?)\''
changes_list={}
for row in c1:
    row_changes=0
    #Calculates the changes for the Top 5 siblings in the matrix
    for i in range(1, 6):
        #Clean the data and get only the feature name from the cell
        row_col= re.search(pattern,row[i]).group(1)
        master_col= re.search(pattern,master_list[row_num][i]).group(1)
        if(master_col!=row_col):
            changes=changes+1
            row_changes=row_changes+1
    row_num = row_num+1
    changes_list[row[0]]= row_changes
features_changes = 0
for x in changes_list.values():
    if(x!=0):
        features_changes=features_changes+1
changes_porcentage= features_changes*100/len(changes_list)
changes_list['Total']=changes
print('A ' +str(changes_porcentage) + '% of the features suffered some changes\n' )
pp=pprint.PrettyPrinter(indent=4)
pp.pprint(changes_list)
