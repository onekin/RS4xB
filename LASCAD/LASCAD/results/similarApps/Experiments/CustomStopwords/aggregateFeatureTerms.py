

from pathlib import Path
f = open("aggregatedTerms.txt", "w")
for elem in Path('../../../../showcases_out/').rglob('*.*'):
    f2 = open(elem,"r")
    data=data=f2.read()
    da
    data=data.replace('b\'','')
    data=data.replace('\'','')
    if(data!='\n'):
        f.write(data)
    f2.close()
f.close()    