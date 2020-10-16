// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1,LINE)
       <div class="card">
        <div class="card-header bg-dark text-white">Annotation server</div>
        <div class="card-body">
          <div class="form-check">
            <label for="annotationServerDropdown">Select your annotations server</label>
            <select class="form-control" id="annotationServerDropdown">
              PVSCL:EVAL(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Iterate(as;r=''|r+printOptionRow(as) + '\n'))
            </select>
          </div>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1,LINE)
import ChromeStorage from '../../utils/ChromeStorage'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)
    ChromeStorage.getData('annotationServer.selected', ChromeStorage.sync, (err, annotationServer) => {
      if (err) {
        console.error('ErrorSettingAnnotationServer')
      } else {
        let actualAnnotationServer
        if (annotationServer) {
          actualAnnotationServer = JSON.parse(annotationServer.data)
        } else {
          actualAnnotationServer = 'browserstorage'
        }
        if (actualAnnotationServer === 'hypothesis') {
          // Hypothesis
          annotationAnnotationServer = new Hypothesis({ group: group })
        } else {
          // Browser storage
          annotationAnnotationServer = new BrowserStorage({ group: group })
        }
        if (_.isFunction(callback)) {
          callback(annotationAnnotationServer)
        }
      }
    })
    // PVSCL:ELSECOND
    // PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND    if (_.isFunction(callback)) {
      callback(annotationAnnotationServer)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    this.annotationServerClientManager.init((err) => {
      if (_.isFunction(callback)) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      }
    })
    // PVSCL:ELSECOND
    const defaultAnnotationServer = Config.defaultAnnotationServer
    ChromeStorage.getData('annotationServer.selected', ChromeStorage.sync, (err, annotationServer) => {
      if (err) {
        callback(err)
      } else {
        let actualStore
        if (annotationServer) {
          actualStore = JSON.parse(annotationServer.data)
        } else {
          actualStore = defaultAnnotationServer
        }
        if (actualStore === 'hypothesis') {
          // Hypothesis
          this.annotationServerClientManager = new HypothesisClientManager()
        } else {
          // Browser storage
          this.annotationServerClientManager = new BrowserStorageManager()
        }
        this.annotationServerClientManager.init((err) => {
          if (_.isFunction(callback)) {
            if (err) {
              callback(err)
            } else {
              callback()
            }
          }
        })
      }
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1,LINE)
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        annotationAnnotationServer = new Hypothesis({ group: group })
      } else {
        // Browser storage
        annotationAnnotationServer = new BrowserStorage({ group: group })
      }
      if (_.isFunction(callback)) {
        callback(annotationAnnotationServer)
      }
    })
    // PVSCL:ELSECOND
    // PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND    if (_.isFunction(callback)) {
      callback(annotationAnnotationServer)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    window.googleSheetProvider.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.googleSheetProvider.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    window.googleSheetProvider.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    window.googleSheetProvider.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    window.googleSheetProvider.annotationServerManager.init((err) => {
      if (_.isFunction(callback)) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      }
    })
    // PVSCL:ELSECOND
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        window.googleSheetProvider.annotationServerManager = new HypothesisClientManager()
      } else {
        // Browser storage
        window.googleSheetProvider.annotationServerManager = new BrowserStorageManager()
      }
      window.googleSheetProvider.annotationServerManager.init((err) => {
        if (_.isFunction(callback)) {
          if (err) {
            callback(err)
          } else {
            callback()
          }
        }
      })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.AnnotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.AnnotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    this.AnnotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    this.AnnotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    this.AnnotationServerClientManager.init(() => {
      this.initLoginProcess((err) => {
        if (_.isFunction(callback)) {
          if (err) {
            callback(err)
          } else {
            callback()
          }
        }
      })
    })
    // PVSCL:ELSECOND
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        this.AnnotationServerClientManager = new HypothesisClientManager()
      } else {
        // Browser storage
        this.AnnotationServerClientManager = new BrowserStorageManager()
      }
      this.AnnotationServerClientManager.init(() => {
        this.initLoginProcess((err) => {
          if (_.isFunction(callback)) {
            if (err) {
              callback(err)
            } else {
              callback()
            }
          }
        })
      })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    const HypothesisClientManager = require('../annotationServer/hypothesis/HypothesisClientManager').default
    window.abwa.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.abwa.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        const HypothesisClientManager = require('../annotationServer/hypothesis/HypothesisClientManager').default
        window.abwa.annotationServerManager = new HypothesisClientManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
      if (annotationServer === 'browserstorage') {
        // Browser storage
        window.abwa.annotationServerManager = new BrowserStorageManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)
      if (annotationServer === 'neo4j') {
        // Browser storage
        const Neo4JClientManager = require('../annotationServer/neo4j/Neo4JClientManager').default
        window.abwa.annotationServerManager = new Neo4JClientManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        const HypothesisClientManager = require('../annotationServer/hypothesis/HypothesisClientManager').default
        window.abwa.annotationServerManager = new HypothesisClientManager()
      }
      // PVSCL:ENDCOND      // PVSCL:IFCOND(BrowserStorage, LINE)
      if (annotationServer === 'browserstorage') {
        // Browser storage
        window.abwa.annotationServerManager = new BrowserStorageManager()
      }
      // PVSCL:ENDCOND      // PVSCL:IFCOND(Neo4J, LINE)
      if (annotationServer === 'neo4j') {
        // Browser storage
        const Neo4JClientManager = require('../annotationServer/neo4j/Neo4JClientManager').default
        window.abwa.annotationServerManager = new Neo4JClientManager()
      }
      // PVSCL:ENDCOND      if (window.abwa.annotationServerManager) {
        window.abwa.annotationServerManager.init((err) => {
          if (_.isFunction(callback)) {
            if (err) {
              callback(err)
            } else {
              callback()
            }
          }
        })
      } else {
        const Alerts = require('../utils/Alerts').default
        Alerts.errorAlert({ text: 'Unable to load selected server. Please configure in options page.' })
      }
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)
    // annotationServer type
    document.querySelector('#annotationServerDropdown').addEventListener('change', (event) => {
      // Get value
      if (event.target.selectedOptions && event.target.selectedOptions[0] && event.target.selectedOptions[0].value) {
        this.setAnnotationServer(event.target.selectedOptions[0].value)
        // Show/hide configuration for selected annotationServer
        this.showSelectedAnnotationServerConfiguration(event.target.selectedOptions[0].value)
      }
    })
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      document.querySelector('#annotationServerDropdown').value = annotationServer
      this.showSelectedAnnotationServerConfiguration(annotationServer)
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)

  setAnnotationServer (annotationServer) {
    chrome.runtime.sendMessage({
      scope: 'annotationServer',
      cmd: 'setSelectedAnnotationServer',
      data: { annotationServer: annotationServer }
    }, ({ annotationServer }) => {
      console.debug('Annotation server selected ' + annotationServer)
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Collect(p | IF p->pv:Name() = AnnotationServer->pv:Attribute('defaultAnnotationServer') THEN 1 ELSE 0 ENDIF)->pv:Contains(1), LINE)
// eslint-disable-next-line quotes
defaultAnnotationServer = "PVSCL:EVAL(AnnotationServer->pv:Attribute('defaultAnnotationServer')->pv:ToLowerCase())"
// PVSCL:ELSECOND
defaultAnnotationServer = "PVSCL:EVAL(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Item(0)->pv:Name()->pv:ToLowerCase())"
// PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)
import AnnotationServerManager from './background/AnnotationServerManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)
    // Initialize annotation server manager
    this.annotationServerManager = new AnnotationServerManager()
    this.annotationServerManager.init()

    // PVSCL:ENDCONDimport ChromeStorage from './utils/ChromeStorage'
import HypothesisClientManager from './annotationServer/hypothesis/HypothesisClientManager'
import _ from 'lodash'
const selectedGroupNamespace = 'hypothesis.currentGroup'

console.log('Loaded hypothesis group content script')

window.addEventListener('load', () => {
  // Retrieve last saved group
  ChromeStorage.getData(selectedGroupNamespace, ChromeStorage.local, (err, savedCurrentGroup) => {
    if (err) {
      console.error('Error while retrieving default group')
    } else {
      // Parse chrome storage result
      if (!_.isEmpty(savedCurrentGroup) && savedCurrentGroup.data) {
        // Nothing to change
      } else {
        // Set hypothes.is web page group as current group
        window.abwa = {}
        window.abwa.annotationServerManager = new HypothesisClientManager()
        window.abwa.annotationServerManager.init(() => {
          window.abwa.annotationServerManager.client.getUserProfile((err, userProfile) => {
            if (err) {
              console.error('Error while retrieving user profile in hypothesis')
            } else {
              const urlSplit = window.location.href.split('/')
              const indexOfGroups = _.indexOf(urlSplit, 'groups')
              if (urlSplit[indexOfGroups + 1]) {
                const groupId = urlSplit[indexOfGroups + 1]
                // Set current group
                const group = _.find(userProfile.groups, (group) => { return group.id === groupId })
                if (group) {
                  // Save to chrome storage current group
                  ChromeStorage.setData(selectedGroupNamespace, { data: JSON.stringify(group) }, ChromeStorage.local, () => {
                    console.log('Set as group: ' + group.name)
                  })
                }
              }
            }
          })
        })
      }
    }
  })
})
hypothesisGroupContentScript.js// PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    this.annotationServerManager.init((err) => {
      if (_.isFunction(callback)) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      }
    })
    // PVSCL:ELSECOND
    chrome.runtime.sendMessage({
      scope: 'annotationServer',
      cmd: 'getSelectedAnnotationServer'
    }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        this.annotationServerManager = new HypothesisClientManager()
      } else {
        // Browser storage
        this.annotationServerManager = new BrowserStorageManager()
      }
      this.annotationServerManager.init((err) => {
        if (_.isFunction(callback)) {
          if (err) {
            callback(err)
          } else {
            callback()
          }
        }
      })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    this.annotationServerManager.init((err) => {
      if (_.isFunction(callback)) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      }
    })
    // PVSCL:ELSECOND
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        this.annotationServerManager = new HypothesisClientManager()
      } else {
        // Browser storage
        this.annotationServerManager = new BrowserStorageManager()
      }
      this.annotationServerManager.init((err) => {
        if (_.isFunction(callback)) {
          if (err) {
            callback(err)
          } else {
            callback()
          }
        }
      })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    window.scienceDirect.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.scienceDirect.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
        // Browser storage
        window.scienceDirect.annotationServerManager = new BrowserStorageManager()
        // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)
    // PVSCL:IFCOND(Hypothesis, LINE)
    window.scienceDirect.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND    // PVSCL:IFCOND(BrowserStorage, LINE)
    window.scienceDirect.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND    window.scienceDirect.annotationServerManager.init((err) => {
      if (_.isFunction(callback)) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      }
    })
    // PVSCL:ELSECOND
    chrome.runtime.sendMessage({ scope: 'annotationServer', cmd: 'getSelectedAnnotationServer' }, ({ annotationServer }) => {
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        window.scienceDirect.annotationServerManager = new HypothesisClientManager()
      } else {
        // PVSCL:IFCOND(BrowserStorage,LINE)
        // Browser storage
        window.scienceDirect.annotationServerManager = new BrowserStorageManager()
        // PVSCL:ENDCOND      }
      window.scienceDirect.annotationServerManager.init((err) => {
        if (_.isFunction(callback)) {
          if (err) {
            callback(err)
          } else {
            callback()
          }
        }
      })
    })
    // PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis and AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1),
    {
      "matches": [
        "https://hypothes.is/groups/*/*"
      ],
      "js": [
        "scripts/hypothesisGroupContentScript.js"
      ],
      "run_at": "document_end"
    }PVSCL:ENDCOND