// PVSCL:IFCOND(CXLExport, LINE)
import Linking from '../purposes/linking/Linking'
import Classifying from '../../annotationManagement/purposes/Classifying'
// PVSCL:ENDCOND// PVSCL:IFCOND(Remote, LINE)
import HypothesisClientManager from '../../annotationServer/hypothesis/HypothesisClientManager'
import Neo4JClientManager from '../../annotationServer/neo4j/Neo4JClientManager'
// PVSCL:IFCOND(CXLExport, LINE)
import Linking from '../purposes/linking/Linking'
import Classifying from '../../annotationManagement/purposes/Classifying'
// PVSCL:ENDCONDconst ANNOTATIONS_UPDATE_INTERVAL_IN_SECONDS = 5
// PVSCL:ENDCOND// PVSCL:IFCOND(Remote, LINE)
    // TODO Check if client manager is remote
    if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager) || LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, Neo4JClientManager)) {
      this.initReloadAnnotationsEvent()
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Remote, LINE)
    // Destroy annotations reload interval
    if (this.reloadInterval) {
      clearInterval(this.reloadInterval)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Remote, LINE)

  initReloadAnnotationsEvent (callback) {
    this.reloadInterval = setInterval(() => {
      this.updateAllAnnotations(() => {
        console.debug('annotations updated')
      })
    }, ANNOTATIONS_UPDATE_INTERVAL_IN_SECONDS * 1000)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  // PVSCL:ENDCOND