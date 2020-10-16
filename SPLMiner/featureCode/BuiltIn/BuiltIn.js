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
  // PVSCL:ENDCOND/* PVSCL:IFCOND(BuiltIn) */,
        description: this.description/* PVSCL:ENDCOND */import UserDefinedHighlighterDefinition from './BuiltInCodebookScheme'
import Codebook from '../../../model/Codebook'
import Alerts from '../../../../utils/Alerts'
import _ from 'lodash'

class BuiltIn {
  static createDefaultAnnotations (callback) {
    Codebook.setAnnotationServer(null, (annotationServer) => {
      // Create annotation guide from user defined highlighter definition
      const annotationGuide = Codebook.fromObjects(UserDefinedHighlighterDefinition)
      // Create review schema from default criterias
      annotationGuide.annotationServer = annotationServer
      // Create highlighter annotations
      const annotations = annotationGuide.toAnnotations()
      // TODO Codes annotations should be related to its corresponding theme: it requires to update Code annotations to relate them by ID instead of by tag
      // Send create highlighter
      window.abwa.annotationServerManager.client.createNewAnnotations(annotations, (err, annotations) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create new group.' })
        } else {
          window.abwa.sidebar.openSidebar()
          Alerts.closeAlert()
          if (_.isFunction(callback)) {
            callback(null, annotations)
          }
        }
      })
    })
  }
}

export default BuiltIn
BuiltIn.jsimport Codebook from '../../../model/Codebook'
import Alerts from '../../../../utils/Alerts'
import _ from 'lodash'

class EmptyCodebook {
  static createDefaultAnnotations (callback) {
    Codebook.setAnnotationServer(null, (annotationServer) => {
      const emptyCodebook = new Codebook({ annotationServer: annotationServer })
      const emptyCodebookAnnotation = emptyCodebook.toAnnotation()
      window.abwa.annotationServerManager.client.createNewAnnotation(emptyCodebookAnnotation, (err, annotation) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create required configuration for Dynamic highlighter. Please, try it again.' }) // TODO i18n
        } else {
          // Open the sidebar, to notify user that the annotator is correctly created
          window.abwa.sidebar.openSidebar()
          if (_.isFunction(callback)) {
            callback(null, [annotation])
          }
        }
      })
    })
  }
}

export default EmptyCodebook
EmptyCodebook.js// PVSCL:IFCOND(TopicBased, LINE)
import TopicBased from './topicBased/TopicBased'
// PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn, LINE)
import BuiltIn from './builtIn/BuiltIn'
import EmptyCodebook from './emptyCodebook/EmptyCodebook'
// PVSCL:IFCOND(TopicBased, LINE)
import TopicBased from './topicBased/TopicBased'
// PVSCL:ENDCOND// PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
        let topic = event.detail.topic
        if (howCreate === 'topicBased') {
          TopicBased.createDefaultAnnotations(topic, (err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn, LINE)
        if (howCreate === 'builtIn') {
          BuiltIn.createDefaultAnnotations((err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        if (howCreate === 'emptyCodebook') {
          EmptyCodebook.createDefaultAnnotations((err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        // PVSCL:IFCOND(TopicBased, LINE)
        let topic = event.detail.topic
        if (howCreate === 'topicBased') {
          TopicBased.createDefaultAnnotations(topic, (err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        // PVSCL:ENDCOND        // PVSCL:ELSEIFCOND(NOT(Codebook), LINE)
        if (howCreate === 'noCodebook') {
          NoCodebook.createDefaultAnnotations((err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            const currentGroupFullName = window.abwa.groupSelector.groupFullName || ''
            // PVSCL:ELSECOND
            const currentGroupName = window.abwa.groupSelector.currentGroup.name || ''
            // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
            // As codebook can be updated, the user can create an empty one and update it later
            Alerts.confirmAlert({
              title: 'Do you want to create a default annotation codebook?',
              text: currentGroupName + ' group has not codes to start annotating. Would you like to configure the highlighter?',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              alertType: Alerts.alertType.question,
              callback: () => {
                Alerts.loadingAlert({
                  title: 'Configuration in progress',
                  text: 'We are configuring everything to start reviewing.',
                  position: Alerts.position.center
                })
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
                resolve()
              },
              cancelCallback: () => {
                // PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND                resolve()
              }
            })
            // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'topicBased', topic: currentGroupFullName })
            resolve()
            // PVSCL:ELSECOND
            // PVSCL:IFCOND(CodebookUpdate, LINE)
            // As codebook can be updated, the user can create an empty one and update it later
            Alerts.confirmAlert({
              title: 'Do you want to create a default annotation codebook?',
              text: currentGroupName + ' group has not codes to start annotating. Would you like to configure the highlighter?',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              alertType: Alerts.alertType.question,
              callback: () => {
                Alerts.loadingAlert({
                  title: 'Configuration in progress',
                  text: 'We are configuring everything to start reviewing.',
                  position: Alerts.position.center
                })
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
                resolve()
              },
              cancelCallback: () => {
                // PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND                resolve()
              }
            })
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            // If codebook is not updateable, it is necessary to create the default one, as otherwise the user can select empty codebook and get an unusable configuration
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
            resolve()
            // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn AND NOT(ApplicationBased), LINE)
            // PVSCL:IFCOND(TopicBased, LINE)
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'topicBased', topic: currentGroupFullName })
            resolve()
            // PVSCL:ELSECOND
            // PVSCL:IFCOND(CodebookUpdate, LINE)
            // As codebook can be updated, the user can create an empty one and update it later
            Alerts.confirmAlert({
              title: 'Do you want to create a default annotation codebook?',
              text: currentGroupName + ' group has not codes to start annotating. Would you like to configure the highlighter?',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              alertType: Alerts.alertType.question,
              callback: () => {
                Alerts.loadingAlert({
                  title: 'Configuration in progress',
                  text: 'We are configuring everything to start reviewing.',
                  position: Alerts.position.center
                })
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
                resolve()
              },
              cancelCallback: () => {
                // PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND                resolve()
              }
            })
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            // If codebook is not updateable, it is necessary to create the default one, as otherwise the user can select empty codebook and get an unusable configuration
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
            resolve()
            // PVSCL:ENDCOND            // PVSCL:ELSEIFCOND(ApplicationBased, LINE)
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
            resolve()
            // PVSCL:ELSEIFCOND(NOT(Codebook))
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'noCodebook' }) // The parameter howCreate is not really necessary in current implementation
            resolve()
            // PVSCL:ELSECOND
            // Show alert no group is defined
            Alerts.errorAlert({ text: 'No group is defined' })
            // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ApplicationBased or NOT(Codebook), LINE)
import Config from '../Config'
import swal from 'sweetalert2'
const GroupName = Config.groupName
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
                  // Modify group URL in Hypothes.is as it adds the name at the end of the URL
                  if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                    group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn, LINE)
              // TODO i18n
              Alerts.loadingAlert({ title: 'First time annotating?', text: 'It seems that it is your first time using the extension. We are configuring everything to start your annotation activity.', position: Alerts.position.center })
              // TODO Create default group
              this.createApplicationBasedGroupForUser((err, group) => {
                if (err) {
                  Alerts.errorAlert({ text: 'We are unable to create annotation group. Please check if you are logged in your annotation server.' })
                } else {
                  // PVSCL:IFCOND(Hypothesis,LINE)
                  // Modify group URL in Hypothes.is as it adds the name at the end of the URL
                  if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                    group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                  }
                  // PVSCL:ENDCOND                  this.currentGroup = group
                  callback(null)
                }
              })
              // PVSCL:ELSECOND
              Alerts.errorAlert({ text: 'The group ' + GroupName + ' does not exist. Please configure the tool in the third-party provider.' })
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn,LINE)
    // New group button
    const newGroupButton = document.createElement('div')
    newGroupButton.innerText = 'Create ' + Config.codebook
    newGroupButton.id = 'createNewModelButton'
    newGroupButton.className = 'groupSelectorButton'
    newGroupButton.title = 'Create a new codebook'
    newGroupButton.addEventListener('click', this.createNewReviewModelEventHandler())
    groupsContainer.appendChild(newGroupButton)
    // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
    title = 'What is the topic or the focus question?'
    inputPlaceholder = 'Type here the topic ...'
    // PVSCL:ELSECOND
    title = 'Create a new codebook'
    inputPlaceholder = 'Type here the new codebook name...'
    // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            console.log(groupName)
            this.groupFullName = groupName
            groupName = groupName.substring(0, 24)
            console.log(groupName)
            return groupName
            // PVSCL:ELSECOND
            // const swal = require('sweetalert2').default
            swal.showValidationMessage('The codebook name cannot be higher than 25 characters.')
            // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            this.groupFullName = groupName
            // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn,LINE)

  createNewReviewModelEventHandler () {
    return () => {
      this.createNewGroup((err, result) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create a new group. Please try again or contact developers if the error continues happening.' })
        } else {
          // Update list of groups from annotation Server
          this.retrieveGroups(() => {
            // Move group to new created one
            this.setCurrentGroup(result.id, () => {
              // Expand groups container
              this.container.setAttribute('aria-expanded', 'false')
              // Reopen sidebar if closed
              window.abwa.sidebar.openSidebar()
            })
          })
        }
      })
    }
  }

  createNewGroup (callback) {
    let title
    let inputPlaceholder
    // PVSCL:IFCOND(TopicBased, LINE)
            this.groupFullName = groupName
            // PVSCL:ENDCOND            return groupName
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
          }, callback)
        }
      }
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ApplicationBased OR NOT(Codebook), LINE)
  groupName: 'DefaultReviewModel',
  // PVSCL:ENDCOND