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
  // PVSCL:ENDCOND// PVSCL:IFCOND(Codebook, LINE)
    // Set colors for each element
    this.applyColorsToThemes()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ApplicationBased or NOT(Codebook), LINE)
import Config from '../Config'
import swal from 'sweetalert2'
const GroupName = Config.groupName
// PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                  title = 'What is the topic or the focus question of the concept map?'
                  // PVSCL:ELSECOND
                  title = 'You do not have a group to start annotating, please provide a group name to get started.'
                  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                  inputPlaceholder = 'Type here the topic of the map...'
                  // PVSCL:ELSECOND
                  inputPlaceholder = 'Type here the name of the group...'
                  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                          this.groupFullName = groupName
                          console.log(groupName)
                          groupName = groupName.substring(0, 24)
                          console.log(groupName)
                          return groupName
                          // PVSCL:ELSECOND
                          const swal = require('sweetalert2')
                          swal.showValidationMessage('The name cannot be higher than 25 characters.')
                          // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                          this.groupFullName = groupName
                          // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
                            // Modify group URL in hypothesis
                            if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                              if (_.has(group, 'links.html')) {
                                group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                              }
                            }
                            // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
              const BrowserStorageManager = require('../annotationServer/browserStorage/BrowserStorageManager').default
              if (_.isEmpty(this.currentGroup) && !_.isEmpty(window.abwa.groupSelector.groups) && LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, BrowserStorageManager)) {
                this.currentGroup = _.first(window.abwa.groupSelector.groups)
              }
              // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or NOT(Codebook), LINE)
              // Try to load a group with defaultName
              if (_.isEmpty(this.currentGroup)) {
                if (!_.isEmpty(window.abwa.groupSelector.groups)) {
                  this.currentGroup = _.first(window.abwa.groupSelector.groups)
                  callback(null)
                } else {
                  // TODO i18n
                  let title
                  // PVSCL:IFCOND(TopicBased, LINE)
                          this.groupFullName = groupName
                          // PVSCL:ENDCOND                          return groupName
                        }
                      }
                    },
                    callback: (err, groupName) => {
                      if (err) {
                        window.alert('Unable to load swal. Please contact developer.')
                      } else {
                        groupName = LanguageUtils.normalizeString(groupName)
                        window.abwa.annotationServerManager.client.createNewGroup({
                          name: groupName,
                          description: 'A group created using annotation tool ' + chrome.runtime.getManifest().name
                        }, (err, group) => {
                          if (err) {
                            Alerts.errorAlert({ text: 'We are unable to create the group. Please check if you are logged in the annotation server.' })
                          } else {
                            // PVSCL:IFCOND(Hypothesis, LINE)
                            // Modify group URL in hypothesis
                            if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                              if (_.has(group, 'links.html')) {
                                group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                              }
                            }
                            // PVSCL:ENDCOND                            this.currentGroup = group
                            callback(null)
                          }
                        })
                      }
                    }
                  })
                }
              } else { // If group was found in extension annotation server
                if (_.isFunction(callback)) {
                  callback()
                }
              }
              // PVSCL:ELSECOND
              // PVSCL:IFCOND(BrowserStorage, LINE)
              const BrowserStorageManager = require('../annotationServer/browserStorage/BrowserStorageManager').default
              if (_.isEmpty(this.currentGroup) && !_.isEmpty(window.abwa.groupSelector.groups) && LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, BrowserStorageManager)) {
                this.currentGroup = _.first(window.abwa.groupSelector.groups)
              }
              // PVSCL:ENDCOND              // TODO Add an option to get the current group by the extension identification, only retrieves groups created by the product
              if (_.isEmpty(this.currentGroup) && !_.isEmpty(window.abwa.groupSelector.groups)) {
                this.currentGroup = _.first(window.abwa.groupSelector.groups)
              }
              if (_.isEmpty(window.abwa.groupSelector.groups)) {
                Alerts.errorAlert({ text: 'No groups found. Please configure the tool in the third-party provider.' })
              }
              if (_.isFunction(callback)) {
                callback()
              }
              // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn OR NOT(Codebook),LINE)

  createApplicationBasedGroupForUser (callback) {
    window.abwa.annotationServerManager.client.createNewGroup({ name: Config.groupName }, callback)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ApplicationBased OR NOT(Codebook), LINE)
  groupName: 'DefaultReviewModel',
  // PVSCL:ENDCOND// PVSCL:IFCOND(Codebook, LINE)
  codebook: 'PVSCL:EVAL(Codebook->pv:Attribute('name')->pv:ToLowerCase())',
  // PVSCL:ENDCOND// PVSCL:IFCOND(Codebook, LINE)
  cmapCloudConfiguration: {
    user: 'highlight01x@gmail.com',
    password: 'producto1',
    uid: '1cf684dc-1764-4e5b-8122-7235ca19c37a'
  },
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
  codebookUpdated: 'codebookUpdated',
  createTheme: 'createTheme',
  themeCreated: 'themeCreated',
  removeTheme: 'removeTheme',
  themeRemoved: 'themeRemoved',
  updateTheme: 'updateTheme',
  themeUpdated: 'themeUpdated',
  // PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
  renameCodebook: 'renameCodebook',
  codebookRenamed: 'codebookRenamed',
  // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
  exportCodebook: 'exportCodebook',
  codebookExported: 'codebookExported',
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook, LINE)
  importCodebook: 'importCodebook',
  codebookImported: 'codebookImported',
  // PVSCL:ENDCOND// PVSCL:IFCOND(Codebook, LINE)
  // Annotation codebook management events
  createCodebook: 'createCodebook',
  codebookCreated: 'codebookCreated',
  // PVSCL:IFCOND(CodebookUpdate, LINE)
  codebookUpdated: 'codebookUpdated',
  createTheme: 'createTheme',
  themeCreated: 'themeCreated',
  removeTheme: 'removeTheme',
  themeRemoved: 'themeRemoved',
  updateTheme: 'updateTheme',
  themeUpdated: 'themeUpdated',
  // PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND  // PVSCL:ENDCOND  // PVSCL:IFCOND(RenameCodebook, LINE)
  renameCodebook: 'renameCodebook',
  codebookRenamed: 'codebookRenamed',
  // PVSCL:ENDCOND  // PVSCL:IFCOND(ExportCodebook, LINE)
  exportCodebook: 'exportCodebook',
  codebookExported: 'codebookExported',
  // PVSCL:ENDCOND  // PVSCL:IFCOND(ImportCodebook, LINE)
  importCodebook: 'importCodebook',
  codebookImported: 'codebookImported',
  // PVSCL:ENDCOND  // PVSCL:ENDCOND