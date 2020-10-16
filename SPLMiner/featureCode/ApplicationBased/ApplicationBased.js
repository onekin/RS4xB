// PVSCL:IFCOND(ApplicationBased,LINE)
            sheetName = Config.groupName
            // PVSCL:ENDCOND// PVSCL:IFCOND(ApplicationBased, LINE)
import Config from '../../../../Config'
// PVSCL:ENDCOND// PVSCL:IFCOND(ApplicationBased, LINE)
          isGroupNameEqual = group.name === Config.groupName
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
              // PVSCL:ENDCOND// PVSCL:IFCOND(ApplicationBased, LINE)
    // Defines the current group of the highlighter with an Application based group
    if (window.abwa.annotationBasedInitializer.initAnnotation) {
      this.defineGroupBasedOnInitAnnotation(callback)
    } else {
      this.retrieveUserProfile(() => {
        // Load all the groups belonged to current user
        this.retrieveGroups((err, groups) => {
          if (err) {
            callback(err)
          } else {
            const currentGroup = _.find(groups, (group) => { return group.name === GroupName })
            if (_.isObject(currentGroup)) {
              // Current group will be that group
              this.currentGroup = currentGroup
              if (_.isFunction(callback)) {
                callback(null)
              }
            } else {
              // PVSCL:IFCOND(BuiltIn, LINE)
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
              // PVSCL:ENDCOND            }
          }
        })
      })
    }
    // PVSCL:ELSEIFCOND(Manual OR NOT(Codebook))
    // TODO Re-describe: Defines one of the possibles groups as the current group of the highlighter
    if (window.abwa.annotationBasedInitializer.initAnnotation) {
      this.defineGroupBasedOnInitAnnotation(callback)
    } else {
      this.retrieveUserProfile(() => {
        // Load all the groups belonged to current user
        this.retrieveGroups((err, groups) => {
          if (err) {
            callback(err)
          } else {
            ChromeStorage.getData(this.selectedGroupNamespace, ChromeStorage.local, (err, savedCurrentGroup) => {
              if (!err && !_.isEmpty(savedCurrentGroup) && _.has(savedCurrentGroup, 'data')) {
                // Parse saved current group
                try {
                  const savedCurrentGroupData = JSON.parse(savedCurrentGroup.data)
                  const currentGroup = _.find(this.groups, (group) => {
                    return group.id === savedCurrentGroupData.id
                  })
                  // Check if group exists in current user
                  if (_.isObject(currentGroup)) {
                    this.currentGroup = currentGroup
                  }
                } catch (e) {
                  // Nothing to do
                }
              }
              // If group cannot be retrieved from saved in extension annotationServer
              // PVSCL:IFCOND(BuiltIn or NOT(Codebook), LINE)
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
              // PVSCL:ENDCOND            })
          }
        })
      })
    }
    // PVSCL:ELSEIFCOND(MoodleResource)
    // Defines the current group of the highlighter with an a Moodle based group
    const fileMetadata = window.abwa.targetManager.fileMetadata
    // Get group name from file metadata
    const hashedGroupName = MoodleUtils.getHashedGroup({ studentId: fileMetadata.studentId, courseId: fileMetadata.courseId, moodleEndpoint: fileMetadata.url.split('pluginfile.php')[0] })
    // Load all the groups belonged to current user
    this.retrieveGroups((err, groups) => {
      if (err) {
        callback(err)
      } else {
        const group = _.find(groups, (group) => { return group.name === hashedGroupName })
        if (_.isObject(group)) {
          // Current group will be that group
          this.currentGroup = group
          ChromeStorage.setData(this.selectedGroupNamespace, { data: JSON.stringify(this.currentGroup) }, ChromeStorage.local)
          if (_.isFunction(callback)) {
            callback(null)
          }
        } else {
          // Warn user not group is defined, configure tool first
          Alerts.errorAlert({ text: 'If you are a teacher you need to configure Mark&Go first.<br/>If you are a student, you need to join feedback group first.', title: 'Unable to start Mark&Go' }) // TODO i18n
        }
      }
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ApplicationBased OR NOT(Codebook), LINE)
  groupName: 'DefaultReviewModel',
  // PVSCL:ENDCOND