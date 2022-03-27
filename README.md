# Recommentor
Recommentor is a recommender system that helps mentors during the onboarding in SPLs. It is based on LASCAD and uses topic modeling to recommend similar features based on a background profile e.

In order to run Recommentor you need to perform the following steps:

1. Download your SPL project and set up its path int FeatureMiner.java class in SPLMiner module.
2. Run FeatureMiner and move the feature codebase directories (available at [SPLMiner/feaurecode/](SPLMiner/feaurecode/) path) to [LASCAD/LASCAD/showcases_data](LASCAD/LASCAD/showcases_data)
3. Execute code processing functionality by running [processProjects.py ](LASCAD/LASCAD/LDA/processProjects.py)
4. Execute LDA by running [runLDA.py](LASCAD/LASCAD/LDA/runLDA.py)
5. Finally in order to get the similarity matrix execute [expr2_similarProjects.py](LASCAD/LASCAD/experiments/expr2_similarProjects)

Evaluation scripts used during RS4xB evaluation are available in [PaperExperiments](PaperExperiments) folder.

For further information contact raul.medeiros[at]ehu.eus
