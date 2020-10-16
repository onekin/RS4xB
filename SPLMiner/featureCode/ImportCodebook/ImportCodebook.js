// PVSCL:IFCOND(Hierarchy,LINE)
      theme.codes = []
      if (_.isArray(themeDefinition.codes)) {
        for (let j = 0; j < themeDefinition.codes.length; j++) {
          const codeDefinition = themeDefinition.codes[j]
          const code = new Code({ name: codeDefinition.name, description: codeDefinition.description, theme: theme })
          theme.codes.push(code)
        }
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ImportCodebook or NOT(Codebook) or ImportAnnotations, LINE)

  static fromObjects (userDefinedHighlighterDefinition) {
    const annotationGuide = new Codebook({ name: userDefinedHighlighterDefinition.name })
    for (let i = 0; i < userDefinedHighlighterDefinition.definition.length; i++) {
      const themeDefinition = userDefinedHighlighterDefinition.definition[i]
      const theme = new Theme({ name: themeDefinition.name, description: themeDefinition.description, annotationGuide })
      // PVSCL:IFCOND(Hierarchy,LINE)
      theme.codes = []
      if (_.isArray(themeDefinition.codes)) {
        for (let j = 0; j < themeDefinition.codes.length; j++) {
          const codeDefinition = themeDefinition.codes[j]
          const code = new Code({ name: codeDefinition.name, description: codeDefinition.description, theme: theme })
          theme.codes.push(code)
        }
      }
      // PVSCL:ENDCOND      annotationGuide.themes.push(theme)
    }
    return annotationGuide
  }
  // PVSCL:ENDCONDimport Events from '../../../Events'
import ImportCodebookJSON from './ImportCodebookJSON'
import _ from 'lodash'

class ImportCodebook {
  constructor () {
    this.events = {}
  }

  init () {
    // Add event listener for export codebook event
    this.initImportCodebookEventHandler()
  }

  destroy () {
    // Remove event listeners
    const events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  // EVENTS
  initImportCodebookEventHandler () {
    this.events.importCodebookEvent = { element: document, event: Events.importCodebook, handler: this.importCodebookEventHandler() }
    this.events.importCodebookEvent.element.addEventListener(this.events.importCodebookEvent.event, this.events.importCodebookEvent.handler, false)
  }

  importCodebookEventHandler () {
    return (event) => {
      switch (event.detail.importTo) {
        case 'JSON':
          ImportCodebookJSON.import()
          break
        default :
          ImportCodebookJSON.import()
      }
    }
  }
}

export default ImportCodebook
ImportCodebook.jsimport _ from 'lodash'
import Alerts from '../../../utils/Alerts'
import FileUtils from '../../../utils/FileUtils'
import Events from '../../../Events'
import Codebook from '../../model/Codebook'
import LanguageUtils from '../../../utils/LanguageUtils'

class ImportCodebookJSON {
  static import () {
    ImportCodebookJSON.askUserForConfigurationSchema((err, jsonObject) => {
      if (err) {
        Alerts.errorAlert({ text: 'Unable to parse json file. Error:<br/>' + err.message })
      } else {
        Alerts.inputTextAlert({
          alertType: Alerts.alertType.warning,
          title: 'Give a name to your imported review model',
          text: 'When the configuration is imported a new highlighter is created. You can return to your other review models using the sidebar.',
          inputPlaceholder: 'Type here the name of your review model...',
          preConfirm: (groupName) => {
            if (_.isString(groupName)) {
              if (groupName.length <= 0) {
                const swal = require('sweetalert2')
                swal.showValidationMessage('Name cannot be empty.')
              } else if (groupName.length > 25) {
                const swal = require('sweetalert2')
                swal.showValidationMessage('The review model name cannot be higher than 25 characters.')
              } else {
                return groupName
              }
            }
          },
          callback: (err, reviewName) => {
            if (err) {
              window.alert('Unable to load alert. Unexpected error, please contact developer.')
            } else {
              window.abwa.annotationServerManager.client.createNewGroup({ name: reviewName }, (err, newGroup) => {
                if (err) {
                  Alerts.errorAlert({ text: 'Unable to create a new annotation group. Error: ' + err.message })
                } else {
                  const guide = Codebook.fromObjects(jsonObject)
                  Codebook.setAnnotationServer(newGroup, (annotationServer) => {
                    guide.annotationServer = annotationServer
                    Alerts.loadingAlert({
                      title: 'Configuration in progress',
                      text: 'We are configuring everything to start reviewing.',
                      position: Alerts.position.center
                    })
                    ImportCodebookJSON.createConfigurationAnnotationsFromReview({
                      guide,
                      callback: (err) => {
                        if (err) {
                          Alerts.errorAlert({ text: 'There was an error when configuring Review&Go highlighter' })
                        } else {
                          Alerts.closeAlert()
                          LanguageUtils.dispatchCustomEvent(Events.codebookImported, { groupId: guide.annotationServer.getGroupId() })
                        }
                      }
                    })
                  })
                }
              })
            }
          }
        })
      }
    })
  }

  static createConfigurationAnnotationsFromReview ({ guide, callback }) {
    // Create highlighter annotations
    const annotations = guide.toAnnotations()
    // Send create highlighter
    window.abwa.annotationServerManager.client.createNewAnnotations(annotations, (err, annotations) => {
      callback(err, annotations)
    })
  }

  static backupReviewGroup (callback) {
    // Get current group id
    const currentGroupId = window.abwa.groupSelector.currentGroup.id
    // Rename current group
    const date = new Date()
    const currentGroupNewName = 'ReviewAndGo-' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + '-' + date.getHours()
    window.abwa.annotationServerManager.client.updateGroup(currentGroupId, { name: currentGroupNewName }, (err, result) => {
      if (err) {
        callback(new Error('Unable to backup current annotation group.'))
      } else {
        callback(null, result)
      }
    })
  }

  /**
   * Ask user for a configuration file in JSON and it returns a javascript object with the configuration
   * @param callback
   */
  static askUserForConfigurationSchema (callback) {
    // Ask user to upload the file
    Alerts.inputTextAlert({
      title: 'Upload your configuration file',
      html: 'Here you can upload your json file with the configuration for the Review&Go highlighter.',
      input: 'file',
      callback: (err, file) => {
        if (err) {
          window.alert('An unexpected error happened when trying to load the alert.')
        } else {
          // Read json file
          FileUtils.readJSONFile(file, (err, jsonObject) => {
            if (err) {
              callback(new Error('Unable to read json file: ' + err.message))
            } else {
              callback(null, jsonObject)
            }
          })
        }
      }
    })
  }
}

export default ImportCodebookJSON
ImportCodebookJSON.js// PVSCL:IFCOND(ImportCodebook, LINE)
import ImportCodebook from './operations/import/ImportCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
    this.codebookImporter = new ImportCodebook()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
    this.codebookImporter.init()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
    this.codebookImporter.destroy()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
    this.initCodebookImportedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)

  initCodebookImportedEvent () {
    this.events.codebookImportedEvent = { element: document, event: Events.codebookImported, handler: this.codebookImportedEventHandler() }
    this.events.codebookImportedEvent.element.addEventListener(this.events.codebookImportedEvent.event, this.events.codebookImportedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook,LINE)
    // Import button
    const importGroupButton = document.createElement('div')
    importGroupButton.className = 'groupSelectorButton'
    importGroupButton.innerText = 'Import codebook'
    importGroupButton.id = 'importReviewModelButton'
    importGroupButton.addEventListener('click', this.createImportGroupButtonEventHandler())
    groupsContainer.appendChild(importGroupButton)
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook,LINE)

  createImportGroupButtonEventHandler () {
    return () => {
      LanguageUtils.dispatchCustomEvent(Events.importCodebook, { importTo: 'JSON' })
    }
  }

  codebookImportedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when deleting the group: ' + event.detail.err.message })
      } else {
        // Update groups from annotation server
        this.retrieveGroups(() => {
          this.setCurrentGroup(event.detail.groupId)
        })
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
  importCodebook: 'importCodebook',
  codebookImported: 'codebookImported',
  // PVSCL:ENDCOND