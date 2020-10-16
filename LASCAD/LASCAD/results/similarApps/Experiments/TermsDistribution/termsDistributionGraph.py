import pprint
import re
from pathlib import Path
import matplotlib.pyplot as plt

pattern = r'\'(.*?)\''
terms_dict = {}
feature_terms = []
total_features = 0
for elem in Path('../../../../showcases_out/').rglob('*.*'):
    f2 = open(elem, "r")
    for line in f2:
        data = re.search(pattern, line).group(1)
        for word in data.split():
            if word not in feature_terms:
                if word in terms_dict.keys():
                    terms_dict[word] = terms_dict[word] + 1
                    feature_terms.append(word)
                else:
                    terms_dict[word] = 1
                    feature_terms.append(word)
    f2.close()
    feature_terms = []
    total_features = total_features+1
pp = pprint.PrettyPrinter(indent=4)
final_dict = {}
for key, value in terms_dict.items():
    if(terms_dict[key]>total_features*0.3):
        final_dict[key]=value
x = [x for x in final_dict.keys()]
y = [num/total_features*100 for num in final_dict.values()]
pp = pprint.PrettyPrinter(indent=4)
pp.pprint(final_dict.values())
print("total : "+str(total_features))
lists = sorted(zip(*[y, x]),reverse=True)
y, x = list(zip(*lists))

plt.plot(x, y)
fig = plt.figure(figsize=(20, 10))
ax = fig.add_subplot(111)
ax.plot(x, y, 'bo-', linewidth=2, markersize=6)
ax.hlines(y=40, xmin=0, xmax=len(x), ls='--')
plt.xticks(x, rotation='vertical')
plt.show()
fig.savefig("Terms_distribution")