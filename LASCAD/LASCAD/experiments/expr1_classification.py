import pandas as pd
import numpy as np
import traceback
from LASCAD.LDA.Clustering import testClustering
import os


results = pd.DataFrame(columns=['Dataset', 'n_clusters', 'NUM_TOPICS', 'max_df', 'min_df',
                                'precision', 'recall', 'f-score'])
i = 0
dataset = 'showcase_noStem2'

method = 'LASCAD'
# method = 'LACT'

n_clusters=7
print('n_clusters', n_clusters)
max_df=0.9
min_df=.05
print('{}- Running: NUM_TOPICS={}, max_df={}, min_df={}, test={}'
      .format(i, 50, .9, .05, dataset))
try:
    n_clusters_ = n_clusters
    score, n_clusters_ = testClustering(NUM_TOPICS=50, max_df=max_df,
                           min_df=min_df, dataset=dataset,
                           verbose=False,
                           plot_heatmap=False,
                           categ_method=method,
                           n_clusters=n_clusters
                           )
    score = np.round(np.array(score)*100., 2)
    results.loc[i] = [dataset, n_clusters_, 50, max_df, min_df,
                      score[0], score[1], score[2]]
    results.to_csv(os.path.join('..', 'results', 'categorization_accuracy',
                                 method + '_accuracy_scores_' + dataset + '.csv'))
    i += 1
except:
    print('n_clusters={}, NUM_TOPICS={}, max_df={}, min_df={}, test={} ..... failed'
                        .format(n_clusters_, 50, max_df, min_df, dataset))
    traceback.print_exc()

print('Done......')

print(results)
