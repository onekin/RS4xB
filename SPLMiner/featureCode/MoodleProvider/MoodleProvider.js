// PVSCL:IFCOND(MoodleProvider,LINE)
      <div class="card" aria-hidden="true">
        <div class="card-header bg-dark text-white">Feedback</div>
        <div class="card-body">
          <div class="form-check">
            <input disabled="disabled" type="checkbox" class="form-check-input" id="feedbackURLAndContext" checked="checked">
            <label for="feedbackURLAndContext" class="form-check-label">Send feedback with url and context</label> <img src="./../images/warning.png" width="32" title="This option is not working yet">
          </div>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider,LINE)
      <div class="card">
        <div class="card-header bg-dark text-white">Moodle</div>
        <div class="card-body">
          <div class="form-group" aria-hidden="true">
            <label for="moodleEndpoint">Moodle custom API endpoint</label><img src="./../images/warning.png" width="32" title="This option is not working yet">
            <input disabled="disabled" type="url" class="form-control" id="moodleEndpoint" placeholder="Enter custom moodle API endpoint">
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="apiSimulationCheckbox">
            <label for="apiSimulationCheckbox" class="form-check-label">Use scraping instead of moodle API</label>
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="autoOpenCheckbox">
            <label for="autoOpenCheckbox" class="form-check-label">Automatically open downloaded files from students assignments in the LMS</label>
          </div>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider OR Autocomplete, LINE)
import LanguageUtils from '../../utils/LanguageUtils'
import Theme from '../../codebook/model/Theme'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider,LINE)
    if (themeOrCode && LanguageUtils.isInstanceOf(themeOrCode, Theme)) {
      title = themeOrCode.name
    } else {
      title = themeOrCode.theme.name + ': ' + themeOrCode.name + ' - ' + themeOrCode.description
    }
    // PVSCL:ELSECOND
    if (themeOrCode) {
      title = themeOrCode.name
    }
    // PVSCL:ENDCONDimport Task from './Task'
import _ from 'lodash'
import MoodleUtils from '../../moodle/MoodleUtils'
import AnnotationUtils from '../../utils/AnnotationUtils'
import Codebook from '../../codebook/model/Codebook'
import Config from '../../Config'
// PVSCL:IFCOND(Hypothesis, LINE)

// PVSCL:IFCOND(BrowserStorage, LINE)

// PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1,LINE)


class CreateHighlighterTask extends Task {
  constructor (config) {
    super()
    this.config = config
    this.currentPromisesList = []
  }

  init (callback) {
    const promisesData = []
    for (let i = 0; i < this.config.activities.length; i++) {
      const rubric = this.config.activities[i].data.rubric
      const student = this.config.activities[i].data.student
      const courseId = this.config.activities[i].data.courseId
      const hashedGroupName = MoodleUtils.getHashedGroup({ studentId: student.id, courseId, moodleEndpoint: rubric.moodleEndpoint })
      console.debug('Creating hashed group: ' + hashedGroupName)
      promisesData.push({ rubric, groupName: hashedGroupName, id: i })
    }

    this.currentPromisesStatus = []

    const runPromiseToGenerateGroup = (d) => {
      return new Promise((resolve, reject) => {
        this.generateGroup({
          rubric: d.rubric,
          groupName: d.groupName,
          id: d.id,
          callback: (err, result) => {
            if (err) {
              reject(err)
            } else {
              this.currentPromisesStatus[d.id] = true
              if (result && result.nothingDone) {
                resolve()
              } else {
                setTimeout(resolve, 5000)
              }
            }
          }
        })
      })
    }

    const promiseChain = promisesData.reduce(
      (chain, d) =>
        chain.then(() => {
          return runPromiseToGenerateGroup(d)
        }), Promise.resolve()
    )

    promiseChain.then(() => {
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }

  generateGroup ({ rubric, groupName, id, callback }) {
    this.currentPromisesStatus[id] = 'Checking if the group already exists'
    if (_.isFunction(callback)) {
      this.loadAnnotationServer(() => {
        this.initLoginProcess(() => {
          // Create group
          this.annotationServerClientManager.client.getUserProfile((err, userProfile) => {
            if (_.isFunction(callback)) {
              if (err) {
                console.error(err)
                this.currentPromisesStatus[id] = 'An unexpected error occurred when retrieving your user profile. Please check connection with the annotation server'
                callback(err)
              } else {
                this.currentPromisesStatus[id] = 'Checking if the annotation server is up to date'
                this.annotationServerClientManager.client.getListOfGroups({}, (err, groups) => {
                  if (err) {
                    if (_.isFunction(callback)) {
                      callback(err)
                    }
                  } else {
                    this.groups = groups
                    const group = _.find(groups, (group) => {
                      return group.name === groupName
                    })
                    if (_.isEmpty(group)) {
                      this.currentPromisesStatus[id] = 'Creating new group to store annotations'
                      this.createGroup({ name: groupName }, (err, group) => {
                        this.setAnnotationServer(group, (annotationServer) => {
                          if (err) {
                            console.error('ErrorConfiguringHighlighter')
                            this.currentPromisesStatus[id] = chrome.i18n.getMessage('ErrorConfiguringHighlighter') + chrome.i18n.getMessage('ErrorContactDeveloper', [err.message, err.stack])
                            callback(new Error(chrome.i18n.getMessage('ErrorConfiguringHighlighter') + chrome.i18n.getMessage('ErrorContactDeveloper', [err.message, err.stack])))
                          } else {
                            this.currentPromisesStatus[id] = 'Creating rubric highlighter in the annotation server'
                            this.createHighlighterAnnotations({
                              rubric, annotationServer, userProfile
                            }, () => {
                              callback(null)
                            })
                          }
                        })
                      })
                    } else {
                      this.setAnnotationServer(group, (annotationServer) => {
                        // Check if highlighter for assignment is already created
                        this.annotationServerClientManager.client.searchAnnotations({
                          group: annotationServer.getGroupId(),
                          any: '"cmid:' + rubric.cmid + '"',
                          wildcard_uri: 'https://hypothes.is/groups/*'
                        }, (err, annotations) => {
                          if (err) {
                            callback(err)
                            this.currentPromisesStatus[id] = chrome.i18n.getMessage('ErrorConfiguringHighlighter') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])
                          } else {
                            this.currentPromisesStatus[id] = 'Updating rubric highlighter in the annotation server'
                            this.updateHighlighterAnnotations({
                              rubric, annotations, annotationServer, userProfile
                            }, () => {
                              callback(null)
                            })
                          }
                        })
                      })
                    }
                  }
                })
              }
            }
          })
        })
      })
    }
  }

  setAnnotationServer (newGroup, callback) {
    let annotationAnnotationServer
    let group
    if (newGroup === null) {
      group = window.abwa.groupSelector.currentGroup
    } else {
      group = newGroup
    }
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()>1, LINE)

  }

  updateHighlighterAnnotations ({ rubric, annotations, annotationServer, userProfile }, callback) {
    // PVSCL:IFCOND(Hypothesis,LINE)

    // Create teacher annotation if not exists
    this.createTeacherAnnotation({ producerId: userProfile.userid, annotationServer: annotationServer }, (err) => {
      if (err) {
        callback(new Error(chrome.i18n.getMessage('ErrorRelatingMoodleAndTool') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])))
      } else {
        // Restore object
        rubric.annotationServer = annotationServer
        rubric = Codebook.createCodebookFromObject(rubric)
        // Check annotations pending
        const annotationsPending = _.differenceWith(rubric.toAnnotations(), annotations, AnnotationUtils.areEqual)
        // Check annotations to remove
        const annotationsToRemove = _.differenceWith(annotations, rubric.toAnnotations(), AnnotationUtils.areEqual)
        if (annotationsPending.length === 0 && annotationsToRemove.length === 0) {
          console.debug('Highlighter is already updated, skipping to the next group')
          callback(null, { nothingDone: true })
        } else {
          this.annotationServerClientManager.client.deleteAnnotations(annotationsToRemove, (err) => {
            if (err) {
              callback(new Error(chrome.i18n.getMessage('ErrorConfiguringHighlighter') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])))
            } else {
              this.annotationServerClientManager.client.createNewAnnotations(annotationsPending, (err, createdAnnotations) => {
                if (err) {
                  callback(new Error(chrome.i18n.getMessage('ErrorConfiguringHighlighter') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])))
                } else {
                  console.debug('Highlighter for group updated')
                  callback(null)
                }
              })
            }
          })
        }
      }
    })
  }

  createHighlighterAnnotations ({ rubric, annotationServer, userProfile }, callback) {
    // Generate group annotations
    rubric.annotationServer = annotationServer
    // PVSCL:IFCOND(Hypothesis,LINE)

    rubric = Codebook.createCodebookFromObject(rubric) // convert to rubric to be able to run toAnnotations() function
    const annotations = rubric.toAnnotations()
    this.createTeacherAnnotation({ producerId: userProfile.userid, annotationServer: annotationServer }, (err) => {
      if (err) {
        callback(new Error(chrome.i18n.getMessage('ErrorRelatingMoodleAndTool') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])))
      } else {
        // Create annotations in hypothesis
        this.annotationServerClientManager.client.createNewAnnotations(annotations, (err, createdAnnotations) => {
          if (err) {
            callback(new Error(chrome.i18n.getMessage('ErrorConfiguringHighlighter') + '<br/>' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])))
          } else {
            console.debug('Group created')
            callback(null)
          }
        })
      }
    })
  }

  createGroup ({ name, assignmentName = '', student = '' }, callback) {
    this.annotationServerClientManager.client.createNewGroup({ name: name, description: 'An resource based generated group to mark the assignment in moodle called ' + assignmentName }, (err, group) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        if (_.isFunction(callback)) {
          callback(null, group)
        }
      }
    })
  }

  createTeacherAnnotation ({ producerId, annotationServer }, callback) {
    const teacherAnnotation = this.generateTeacherAnnotation(producerId, annotationServer)
    // Check if annotation already exists
    this.annotationServerClientManager.client.searchAnnotations({ group: annotationServer.getGroupId(), tags: Config.namespace + ':' + Config.tags.producer }, (err, annotations) => {
      if (err) {

      } else {
        // If annotation exist and teacher is the same, nothing to do
        if (annotations.length > 0 && annotations[0].text === teacherAnnotation.text) {
          if (_.isFunction(callback)) {
            callback()
          }
        } else { // Otherwise, create the annotation
          this.annotationServerClientManager.client.createNewAnnotation(teacherAnnotation, (err, annotation) => {
            if (err) {
              if (_.isFunction(callback)) {
                callback(err)
              }
            } else {
              console.debug('Created teacher annotation')
              if (_.isFunction(callback)) {
                callback()
              }
            }
          })
        }
      }
    })
  }

  generateTeacherAnnotation (producerId, annotationServer) {
    return {
      group: annotationServer.getGroupId(),
      permissions: {
        read: ['group:' + annotationServer.getGroupId()]
      },
      references: [],
      tags: [Config.namespace + ':' + Config.tags.producer],
      target: [],
      text: 'producerId: ' + producerId,
      uri: annotationServer.group.links.html // Compatibility with both group representations getGroups and userProfile
    }
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }

  initLoginProcess (callback) {
    this.annotationServerClientManager.logIn((err) => {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    })
  }

  getStatus () {
    const numberTotal = this.config.activities.length
    const finished = _.countBy(this.currentPromisesStatus, (promiseList) => {
      return promiseList === true
    }).true || '0'
    if (finished < numberTotal) {
      const currentTaskName = _.last(this.currentPromisesStatus)
      if (currentTaskName !== true) {
        return currentTaskName + ' (' + finished + '/' + numberTotal + ')'
      } else {
        return 'Creating group (' + finished + '/' + numberTotal + ')'
      }
    } else {
      return 'Creating group (' + finished + '/' + numberTotal + ')'
    }
  }
}

export default CreateHighlighterTask
CreateHighlighterTask.jsclass Task {
  getStatus () {
    return 'Current status unavailable'
  }
}

export default Task
Task.jsimport axios from 'axios'
import _ from 'lodash'
import ChromeStorage from '../utils/ChromeStorage'
import MoodleClient from '../moodle/MoodleClient'
import MoodleFunctions from '../moodle/MoodleFunctions'

class MoodleBackgroundManager {
  init () {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'moodle') {
        if (request.cmd === 'getTokenForEndpoint') {
          if (_.isString(request.data.endpoint)) {
            const endpoint = request.data.endpoint
            this.getTokens(endpoint, (err, tokens) => {
              if (err) {
                sendResponse({ err: err })
              } else {
                this.testTokens({ endpoint, tokens }, (err, tokens) => {
                  if (err) {
                    sendResponse({ err: err })
                  } else {
                    // Return token in response
                    sendResponse({ tokens: tokens })
                  }
                })
              }
            })
          }
        } else if (request.cmd === 'setMoodleCustomEndpoint') {
          const endpoint = request.data.endpoint
          ChromeStorage.setData('moodleCustomEndpoint', { data: JSON.stringify(endpoint) }, ChromeStorage.sync, (err, data) => {
            if (err) {
              sendResponse({ err: err })
            } else {
              sendResponse({ endpoint: endpoint })
            }
          })
        } else if (request.cmd === 'getMoodleCustomEndpoint') {
          ChromeStorage.getData('moodleCustomEndpoint', ChromeStorage.sync, (err, endpoint) => {
            if (err) {
              sendResponse({ err: err })
            } else {
              if (endpoint) {
                const parsedEndpoint = JSON.parse(endpoint.data)
                sendResponse({ endpoint: parsedEndpoint || '' })
              } else {
                sendResponse({ endpoint: '' })
              }
            }
          })
        } else if (request.cmd === 'saveGrantedPermissionMoodle') {
          ChromeStorage.setData('moodlePermission', { saved: true }, ChromeStorage.sync, (err) => {
            if (err) {
              sendResponse({ err: err })
            } else {
              sendResponse({ saved: true })
            }
          })
        } else if (request.cmd === 'hasGrantedPermissionMoodle') {
          ChromeStorage.getData('moodlePermission', ChromeStorage.sync, (err, consent) => {
            if (err) {
              sendResponse({ err: err })
            } else {
              sendResponse({ consent: consent })
            }
          })
        } else if (request.cmd === 'isApiSimulationActivated') {
          ChromeStorage.getData('moodleApiSimulation', ChromeStorage.sync, (err, isActivated) => {
            if (err) {
              sendResponse({ activated: true })
            } else {
              sendResponse(isActivated || { activated: true })
            }
          })
        } else if (request.cmd === 'setApiSimulationActivation') {
          ChromeStorage.setData('moodleApiSimulation', { activated: request.data.isActivated }, ChromeStorage.sync, (err, response) => {
            if (err) {
              sendResponse({ err: err, saved: false })
            } else {
              sendResponse({ saved: true })
            }
          })
        } else if (request.cmd === 'isAutoOpenFilesActivated') {
          ChromeStorage.getData('autoOpenFiles', ChromeStorage.sync, (err, isActivated) => {
            if (err) {
              sendResponse({ activated: false })
            } else {
              sendResponse(isActivated || { activated: false })
            }
          })
        } else if (request.cmd === 'setAutoOpenFiles') {
          ChromeStorage.setData('autoOpenFiles', { activated: request.data.isActivated }, ChromeStorage.sync, (err, response) => {
            if (err) {
              sendResponse({ err: err, saved: false })
            } else {
              sendResponse({ saved: true })
            }
          })
        }
      }
    })
  }

  getTokens (endpoint, callback) {
    // Open preferences page
    axios.get(endpoint + 'user/preferences.php')
      .then((response) => {
        const parser = new window.DOMParser()
        const docPreferences = parser.parseFromString(response.data, 'text/html')
        const tokenLinkElement = docPreferences.querySelector('a[href*="managetoken.php"]')
        if (_.isElement(tokenLinkElement)) {
          const manageToken = tokenLinkElement.href
          // Open managetokens page
          axios.get(manageToken)
            .then((response) => {
              // Retrieve all tokens
              const docManageToken = parser.parseFromString(response.data, 'text/html')
              const tokenElements = docManageToken.querySelectorAll('.c0:not([scope="col"])')
              if (!_.isEmpty(tokenElements)) {
                const tokens = _.map(tokenElements, (tokenElement) => {
                  console.log(tokenElement.innerText)
                  return tokenElement.innerText
                })
                callback(null, tokens)
              } else {
                callback(new Error('Unable to retrieve tokens from DOM'))
              }
            })
        } else {
          callback(new Error('Unable to open managetoken.php. Are you subscribed to any service?'))
        }
      })
  }

  testTokens ({ endpoint, tokens }, callback) {
    if (_.isFunction(callback)) {
      // Test all tokens
      if (_.isString(endpoint) && !_.isEmpty(tokens)) {
        const promises = []
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i]
          // Test each service
          const moodleClient = new MoodleClient(endpoint, token)
          const functionsToTest = _.values(MoodleFunctions)
          for (let i = 0; i < functionsToTest.length; i++) {
            const bindFunction = functionsToTest[i].clientFunc.bind(moodleClient)
            promises.push(new Promise((resolve) => {
              bindFunction(functionsToTest[i].testParams, (err, result) => {
                resolve({
                  token: token,
                  service: functionsToTest[i].wsFunc,
                  enabled: !(err || result.exception === 'webservice_access_exception')
                })
              })
            }))
          }
        }
        Promise.all(promises).then((resolves) => {
          let tests = _.map(_.groupBy(resolves, 'token'), (elem, key) => {
            return { token: key, tests: elem }
          })
          // Remove tokens with not any of the functions enabled
          tests = _.filter(tests, (test) => { return _.find(test.tests, 'enabled') })
          if (_.isObject(resolves)) {
            callback(null, tests)
          }
        })
      }
    } else {
      console.error('No callback defined')
    }
  }
}

export default MoodleBackgroundManager
MoodleBackgroundManager.jsimport _ from 'lodash'
import URLUtils from '../utils/URLUtils'
import ChromeStorage from '../utils/ChromeStorage'

class MoodleDownloadManager {
  constructor () {
    this.files = {}
  }

  init () {
    chrome.downloads.onCreated.addListener((downloadItem) => {
      // Get required data to mark on moodle
      const hashParams = URLUtils.extractHashParamsFromUrl(downloadItem.url, ':')
      const studentId = hashParams.studentId
      const courseId = hashParams.courseId
      const cmid = hashParams.cmid
      if (_.isString(studentId)) { // File is downloaded from moodle
        // Save file metadata and data to mark on moodle
        this.files[downloadItem.id] = {
          url: URLUtils.retrieveMainUrl(downloadItem.url),
          studentId: studentId,
          courseId: courseId,
          cmid: cmid,
          mag: hashParams.mag || null
        }
      }
    })

    chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
      if (this.files[downloadItem.id]) { // Only for files downloaded from moodle
        ChromeStorage.getData('fileFormats', ChromeStorage.sync, (err, fileExtensions) => {
          if (err) {
            suggest() // Suggest default
          } else {
            let fileExtensionArray = []
            if (fileExtensions) {
              fileExtensionArray = (JSON.parse(fileExtensions.data) + defaultFileExtensionsAsPlainText).split(',')
            } else {
              fileExtensionArray = defaultFileExtensionsAsPlainText.split(',')
            }
            const originalFilenameExtension = _.last(downloadItem.filename.split('.'))
            const matchExtension = _.find(fileExtensionArray, (ext) => { return ext === originalFilenameExtension })
            if (_.isString(matchExtension)) {
              suggest({ filename: downloadItem.filename + '.txt' })
            } else {
              suggest()
            }
          }
        })
        // Async suggestion
        return true
      } else {
        return false
      }
    })

    chrome.downloads.onChanged.addListener((downloadItem) => {
      // Download is pending
      if (this.files[downloadItem.id] && downloadItem.filename && downloadItem.filename.current) {
        // Save download file path
        const files = _.values(_.forIn(window.background.moodleDownloadManager.files, (file, key) => { file.key = key }))
        if (downloadItem.filename.current.startsWith('/')) { // Unix-based filesystem
          const repeatedLocalFiles = _.filter(files, (file) => { return file.localPath === encodeURI('file://' + downloadItem.filename.current) })
          _.forEach(repeatedLocalFiles, (repeatedLocalFiles) => {
            delete window.background.moodleDownloadManager.files[repeatedLocalFiles.key]
          })
          this.files[downloadItem.id].localPath = encodeURI('file://' + downloadItem.filename.current)
        } else { // Windows-based filesystem
          const repeatedLocalFiles = _.filter(files, (file) => { return file.localPath === encodeURI('file:///' + _.replace(downloadItem.filename.current, /\\/g, '/')) })
          _.forEach(repeatedLocalFiles, (repeatedLocalFiles) => {
            delete window.background.moodleDownloadManager.files[repeatedLocalFiles.key]
          })
          this.files[downloadItem.id].localPath = encodeURI('file:///' + _.replace(downloadItem.filename.current, /\\/g, '/'))
        }
      } else if (_.isObject(downloadItem.state) && downloadItem.state.current === 'complete') { // When the download is finished
        // If mag is set in the URL, open a new tab with the document
        if (this.files[downloadItem.id].mag && this.files[downloadItem.id].studentId) {
          const localUrl = this.files[downloadItem.id].localPath + '#mag:' + this.files[downloadItem.id].mag + '&studentId:' + this.files[downloadItem.id].studentId
          chrome.extension.isAllowedFileSchemeAccess((isAllowedAccess) => {
            if (isAllowedAccess === false) {
              chrome.tabs.create({ url: chrome.runtime.getURL('pages/filePermission.html') })
            } else {
              // Open the file automatically
              chrome.tabs.create({ url: localUrl }, () => {
                this.files[downloadItem.id].mag = null
              })
            }
          })
        } else {
          // Check if auto-open option is activated
          ChromeStorage.getData('autoOpenFiles', ChromeStorage.sync, (err, result) => {
            if (err) {
              // Nothing to do
            } else {
              const autoOpen = result.activated // TODO Change
              if (autoOpen) {
                const localUrl = this.files[downloadItem.id].localPath + '#autoOpen:true'
                // Check if permission to access files is enabled, otherwise open a new tab with the message.
                chrome.extension.isAllowedFileSchemeAccess((isAllowedAccess) => {
                  if (isAllowedAccess === false) {
                    chrome.tabs.create({ url: chrome.runtime.getURL('pages/filePermission.html') })
                  } else {
                    // Open the file automatically
                    chrome.tabs.create({ url: localUrl })
                  }
                })
              }
            }
          })
        }
      }
    })

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'annotationFile') {
        if (request.cmd === 'fileMetadata') {
          if (request.data.filepath) {
            const file = _.find(this.files, (file) => {
              if (file.localPath === request.data.filepath) {
                return file
              }
            })
            sendResponse({ file: file })
          }
        } else if (request.cmd === 'setPlainTextFileExtension') {
          // Save file formats
          ChromeStorage.setData('fileFormats', { data: JSON.stringify(request.data.fileExtensions) }, ChromeStorage.sync, () => {
            sendResponse({ err: null })
          })
        } else if (request.cmd === 'getPlainTextFileExtension') {
          // Retrieve from chrome storage file formats and return to user
          ChromeStorage.getData('fileFormats', ChromeStorage.sync, (err, fileExtensions) => {
            if (err) {
              sendResponse({ err: err })
            } else {
              if (fileExtensions) {
                const parsedFileExtensions = JSON.parse(fileExtensions.data)
                sendResponse({ fileExtensions: parsedFileExtensions || '' })
              } else {
                sendResponse({ fileExtensions: '' })
              }
            }
          })
        }
      }
    })
  }
}

const defaultFileExtensionsAsPlainText = 'xml,xsl,xslt,xquery,xsql,'

export default MoodleDownloadManager
MoodleDownloadManager.jsimport CircularJSON from 'circular-json-es6'
import ChromeStorage from '../utils/ChromeStorage'
import CreateHighlighterTask from './tasks/CreateHighlighterTask'
import _ from 'lodash'
import Config from '../Config'

class TaskManager {
  constructor () {
    this.currentTasks = []
    this.currentTask = {}
    this.currentTaskInstance = null
  }

  init () {
    // Init background listener for background tasks
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'task') {
        if (request.cmd === 'createHighlighters') {
          if (request.data) {
            const rubric = CircularJSON.parse(request.data.rubric)
            const students = request.data.students
            const courseId = request.data.courseId
            const task = this.prepareCreateHighlightersTask(rubric, students, courseId)
            const numberOfAnnotationsToCreate = task.activities.length * (_.reduce(_.map(rubric.themes, (theme) => { return theme.codes.length }), (sum, n) => { return sum + n }) + 2)
            const minutesPending = Math.round(numberOfAnnotationsToCreate / 60)
            this.addTasks(task)
            sendResponse({ minutes: minutesPending })
          }
        } else if (request.cmd === 'getCurrentTaskStatus') {
          if (_.isObject(this.currentTaskInstance)) {
            sendResponse({ status: 'CreateHighlighterTask pending', statusMessage: this.currentTaskInstance.getStatus() })
          } else {
            sendResponse({ status: 'Nothing pending' })
          }
        }
      }
    })
    // Restore previous activities
    this.restoreTasks(() => {
      console.log('Task manager initialized')
      // Start task management
      this.checkTask()
    })
  }

  addTasks (task) {
    console.debug('Added new task ' + task.task + ' with id: ' + task.id)
    // Add to current tasks
    this.currentTasks.push(task)
    // Save current tasks
    this.saveTasks()
  }

  saveTasks () {
    ChromeStorage.setData('tasks', this.currentTasks, ChromeStorage.local, () => {

    })
  }

  restoreTasks (callback) {
    // Restore pending tasks
    ChromeStorage.getData('tasks', ChromeStorage.local, (err, tasks) => {
      if (err) {
        this.currentTasks = []
      } else {
        this.currentTasks = []
      }
      this.currentTask = {}
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }

  removeFinishedTask () {
    _.remove(this.currentTasks, (task) => {
      return task.id === this.currentTask.id
    })
    this.currentTask = {}
    // Save current tasks
    this.saveTasks()
  }

  doTask (todoTask) {
    this.currentTask = todoTask
    if (this.currentTask.task === 'createHighlighters') {
      const currentTask = this.currentTask
      // Create notification handler for task
      const buttonClickListener = (notificationId, buttonIndex) => {
        // TODO If notification id is the current one for this task
        if (buttonIndex === 0) {
          if (_.isFunction(currentTask.notificationHandler)) {
            currentTask.notificationHandler()
          }
        }
        // Remove notification listener
        chrome.notifications.onButtonClicked.removeListener(buttonClickListener)
      }
      chrome.notifications.onButtonClicked.addListener(buttonClickListener)
      // Create task
      const task = new CreateHighlighterTask(this.currentTask)
      task.init(() => {
        // Task is finished
        this.notifyTask(this.currentTask.notification)
        this.removeFinishedTask()
        this.currentTaskInstance = null
      })
      this.currentTaskInstance = task
    }
  }

  checkTask () {
    this.taskTimeout = setTimeout(() => {
      if (this.currentTasks.length > 0) {
        if (_.isEmpty(this.currentTask)) {
          const todoTask = this.currentTasks[0]
          this.doTask(todoTask)
          this.checkTask()
        } else {
          this.checkTask()
        }
      } else {
        this.checkTask()
      }
    }, 1000)
  }

  notifyTask (notification) {
    // Notify task is finished
    chrome.notifications.create('task' + this.currentTask.id, {
      type: 'basic',
      title: 'Configuration done',
      message: notification,
      iconUrl: chrome.extension.getURL('images/' + Config.urlParamName + '/icon-512.png'),
      buttons: [
        { title: 'Yes' }]
    }, () => {
      console.debug('Notification send to user, task is finished')
    })
  }

  prepareCreateHighlightersTask (rubric, students, courseId) {
    const activities = []
    for (let i = 0; i < students.length; i++) {
      activities.push({
        type: 'createHighlighter',
        data: { student: students[i], rubric, courseId }
      })
    }
    return {
      id: Math.random(),
      task: 'createHighlighters',
      activities: activities,
      notification: 'The tool is prepared to mark ' + rubric.name + ' assignment. Would you like to mark them now?',
      notificationHandler: () => {
        chrome.tabs.create({ url: rubric.moodleEndpoint + 'mod/assign/view.php?id=' + rubric.cmid })
      }
    }
  }
}

TaskManager.tasks = {
  createHighlighters: (data, callback) => {

  }
}

export default TaskManager
TaskManager.js/* PVSCL:IFCOND(MoodleProvider) */,
    moodleLevelId/* PVSCL:ENDCOND */// PVSCL:IFCOND(MoodleProvider, LINE)
    this.moodleLevelId = moodleLevelId
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)
    const cmidTag = 'cmid:' + this.theme.annotationGuide.cmid
    tags.push(cmidTag)
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)
        const moodleLevelId = config.id
        codeToReturn = new Code({ id, name, description, theme, moodleLevelId, createdDate: annotation.updated })
        // PVSCL:ELSECOND
        codeToReturn = new Code({ id, name, description, theme, createdDate: annotation.updated })
        // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)

  static createCodeFromObject (code, theme) {
    // Instance level object
    const instancedCode = Object.assign(new Code({}), code)
    instancedCode.theme = theme
    return instancedCode
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource) */,
    moodleEndpoint = null,
    assignmentName = null,
    assignmentId = null,
    courseId = null,
    cmid = null/* PVSCL:ENDCOND */// PVSCL:IFCOND(MoodleProvider,LINE)
    this.moodleEndpoint = moodleEndpoint
    this.assignmentName = assignmentName
    this.assignmentId = assignmentId
    this.courseId = courseId
    this.cmid = cmid
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource,LINE)
    const cmidTag = 'cmid:' + this.cmid
    tags.push(cmidTag)
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource,LINE)
    textObject = {
      moodleEndpoint: this.moodleEndpoint,
      assignmentId: this.assignmentId,
      assignmentName: this.assignmentName,
      courseId: this.courseId,
      cmid: this.cmid
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider or MoodleProvider, LINE)
      // Configuration for gsheet provider or moodle provider is saved in text attribute
      // TODO Maybe this is not the best place to store this configuration, it wa done in this way to be visible in Hypothes.is client, but probably it should be defined in the body of the annotation
      const config = jsYaml.load(annotation.text)
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)
      annotationGuideOpts.moodleEndpoint = config.moodleEndpoint
      annotationGuideOpts.assignmentId = config.assignmentId
      annotationGuideOpts.assignmentName = config.assignmentName
      annotationGuideOpts.courseId = config.courseId
      const cmidTag = _.find(annotation.tags, (tag) => {
        return tag.includes('cmid:')
      })
      if (_.isString(cmidTag)) {
        annotationGuideOpts.cmid = cmidTag.replace('cmid:', '')
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)

  static createCodebookFromObject (rubric) {
    // Instance rubric object
    const instancedCodebook = Object.assign(new Codebook(rubric))
    // Instance themes and codes
    for (let i = 0; i < rubric.themes.length; i++) {
      instancedCodebook.themes[i] = Theme.createThemeFromObject(rubric.themes[i], instancedCodebook)
    }
    return instancedCodebook
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(MoodleProvider) */,
    moodleCriteriaId/* PVSCL:ENDCOND */// PVSCL:IFCOND(MoodleProvider, LINE)
    this.moodleCriteriaId = moodleCriteriaId
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider,LINE)
    const cmidTag = 'cmid:' + this.annotationGuide.cmid
    tags.push(cmidTag)
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    // Instance codes
    for (let i = 0; i < theme.codes.length; i++) {
      instancedTheme.codes[i] = Code.createCodeFromObject(theme.codes[i], instancedTheme)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or ExportCodebook, LINE)
  static createThemeFromObject (theme, rubric) {
    theme.annotationGuide = rubric
    // Instance theme object
    const instancedTheme = Object.assign(new Theme(theme))
    // PVSCL:IFCOND(Hierarchy, LINE)
    // Instance codes
    for (let i = 0; i < theme.codes.length; i++) {
      instancedTheme.codes[i] = Code.createCodeFromObject(theme.codes[i], instancedTheme)
    }
    // PVSCL:ENDCOND    return instancedTheme
  }
  // PVSCL:ENDCONDimport _ from 'lodash'
import MoodleGradingAugmentation from './MoodleGradingAugmentation'
import MoodleGraderAugmentation from './MoodleGraderAugmentation'
import MoodleViewPluginAssignSubmissionAugmentation from './MoodleViewPluginAssignSubmissionAugmentation'

class MoodleAugmentation {
  init () {
    // TODO Check moodle version
    // Get current website
    if ((new URL(window.location)).searchParams.get('action') === 'grader') {
      this.augmentator = new MoodleGraderAugmentation()
    } else if ((new URL(window.location)).searchParams.get('action') === 'grading') {
      this.augmentator = new MoodleGradingAugmentation()
    } else if ((new URL(window.location).searchParams.get('action') === 'viewpluginassignsubmission')) {
      this.augmentator = new MoodleViewPluginAssignSubmissionAugmentation()
    }
    if (_.isObject(this.augmentator)) {
      this.augmentator.init()
    }
  }
}

export default MoodleAugmentation
MoodleAugmentation.jsimport _ from 'lodash'
import MoodleScraping from '../MoodleScraping'

class MoodleGraderAugmentation {
  constructor () {
    this.studentChangeCheckerInterval = null
  }

  init () {
    // Handle change event (moodle grading page is dinamic, when changing from one student to the next one, it uses ajax to reload part of the site, but student id is different)
    this.initStudentChangeHandler({
      onChange: () => {
        this.augmentGraderPageFiles()
      }
    })
  }

  augmentGraderPageFiles () {
    // Get student ID
    this.getStudentId((err, studentId) => {
      if (err) {
        // TODO Alert user
        console.error('Unable to load student id')
      } else {
        this.modifySubmittedFilesUrl(studentId)
      }
    })
  }

  modifySubmittedFilesUrl (studentId) {
    // Get files elements
    this.waitUntilFilesAreLoaded((submissionFilesContainer) => {
      MoodleScraping.scrapAssignmentData((err, assignmentData) => {
        if (err) {

        } else {
          const submittedFilesElements = submissionFilesContainer.querySelectorAll('a')
          // Change URLs of files elements
          _.forEach(submittedFilesElements, (submittedFileElement) => {
            submittedFileElement.href = submittedFileElement.href + '#studentId:' +
              studentId + '&courseId:' + assignmentData.courseId + '&cmid:' + assignmentData.cmid
          })
          console.debug('Modified submission files for current student ' + studentId)
        }
      })
    })
  }

  waitUntilUserInfoIsLoaded (callback) {
    const interval = setInterval(() => {
      const currentUserInfoElement = document.querySelector('[data-region="user-info"]')
      if (_.isElement(currentUserInfoElement)) {
        clearInterval(interval)
        if (_.isFunction(callback)) {
          callback(currentUserInfoElement)
        }
      }
    }, 500)
  }

  waitUntilFilesAreLoaded (callback) {
    const interval = setInterval(() => {
      const submissionFilesContainer = document.querySelector('.assignsubmission_file')
      if (_.isElement(submissionFilesContainer)) {
        clearInterval(interval)
        if (_.isFunction(callback)) {
          callback(submissionFilesContainer)
        }
      }
    }, 500)
  }

  getStudentId (callback) {
    // Get student ID
    this.waitUntilUserInfoIsLoaded((currentUserInfoElement) => {
      const studentId = (new URL(currentUserInfoElement.querySelector('a').href)).searchParams.get('id')
      if (_.isFunction(callback)) {
        callback(null, studentId)
      }
    })
  }

  initStudentChangeHandler () {
    let savedStudentId = null
    this.studentChangeCheckerInterval = setInterval(() => {
      this.getStudentId((err, studentId) => {
        if (err) {

        } else {
          if (studentId !== savedStudentId) { // Student has changed
            savedStudentId = studentId // Save the new student id
            this.modifySubmittedFilesUrl(studentId)
          }
        }
      })
    }, 500)
  }

  destroy () {
    if (this.studentChangeCheckerInterval) {
      clearInterval(this.studentChangeCheckerInterval)
    }
  }
}

export default MoodleGraderAugmentation
MoodleGraderAugmentation.jsimport _ from 'lodash'
import MoodleScraping from '../MoodleScraping'

class MoodleGradingAugmentation {
  init () {
    // Get course id
    MoodleScraping.scrapAssignmentData((err, assignmentData) => {
      if (err) {

      } else {
        const gradingTable = document.querySelector('.gradingtable')
        const tableBody = gradingTable.querySelector('tbody')
        let rows = tableBody.querySelectorAll(':scope > tr')
        // In moodle 3.1 are added some empty rows which are hidden
        rows = _.filter(rows, (row) => {
          return !row.classList.contains('emptyrow')
        })
        _.forEach(rows, (row) => {
          // Get student id
          const studentId = (new URL(row.querySelector('a[href*="/user/view.php"').href)).searchParams.get('id')
          // Get student files
          const submittedFilesElements = row.querySelectorAll('a[href*="assignsubmission_file/submission_files"')
          // Change URLs of files elements
          _.forEach(submittedFilesElements, (submittedFileElement) => {
            submittedFileElement.href = submittedFileElement.href + '#studentId:' +
              studentId + '&courseId:' + assignmentData.courseId + '&cmid:' + assignmentData.cmid
          })
          // When sent files are more than 5, files are not directly shown, you need to click and another website is opened with submitted files. See https://github.com/haritzmedina/MarkAndGo/issues/13
          const assignmentSubmissionElement = row.querySelector('a[href*="action=viewpluginassignsubmission"')
          if (_.isElement(assignmentSubmissionElement)) {
            assignmentSubmissionElement.href = assignmentSubmissionElement.href + '&studentId=' + studentId
          }
        })
      }
    })
  }

  destroy () {

  }
}

export default MoodleGradingAugmentation
MoodleGradingAugmentation.jsimport _ from 'lodash'
import MoodleScraping from '../MoodleScraping'

class MoodleViewPluginAssignSubmissionAugmentation {
  init () {
    // Get course id
    MoodleScraping.scrapAssignmentData((err, assignmentData) => {
      if (err) {

      } else {
        console.log(assignmentData)
        // Get current student id
        const studentId = (new URL(window.location)).searchParams.get('studentId')
        const submittedFilesElements = document.querySelectorAll('a[href*="assignsubmission_file/submission_files"')
        // Change URLs of files elements
        _.forEach(submittedFilesElements, (submittedFileElement) => {
          submittedFileElement.href = submittedFileElement.href + '#studentId:' +
            studentId + '&courseId:' + assignmentData.courseId + '&cmid:' + assignmentData.cmid
        })
      }
    })
  }

  destroy () {

  }
}

export default MoodleViewPluginAssignSubmissionAugmentation
MoodleViewPluginAssignSubmissionAugmentation.jsimport MoodleClientManager from '../../../../moodle/MoodleClientManager'
import MoodleFunctions from '../../../../moodle/MoodleFunctions'
import _ from 'lodash'
// PVSCL:IFCOND(Hypothesis, LINE)

// PVSCL:IFCOND(BrowserStorage, LINE)

// PVSCL:IFCOND(Hierarchy, LINE)

import Alerts from '../../../../utils/Alerts'
import Codebook from '../../../model/Codebook'
import Theme from '../../../model/Theme'
import LanguageUtils from '../../../../utils/LanguageUtils'
import CircularJSON from 'circular-json-es6'
import MoodleScraping from './MoodleScraping'

class MoodleProvider {
  constructor () {
    this.rubric = null
    this.assignmentId = null
    this.moodleEndpoint = null
    this.assignmentName = null
    this.AnnotationServerClientManager = null
  }

  init (callback) {
    // Ask for configuration
    Alerts.confirmAlert({
      title: 'Mark&Go assignment configuration',
      text: 'Do you want to configure this assignment to mark using Mark&Go?',
      cancelCallback: () => {
        callback(null)
      },
      callback: () => {
        // Create hypothesis client
        this.loadAnnotationServer(() => {
          MoodleScraping.scrapAssignmentData((err, assignmentData) => {
            if (err) {

            } else {
              this.cmid = assignmentData.cmid
              this.moodleEndpoint = assignmentData.moodleEndpoint
              this.assignmentName = assignmentData.assignmentName
              // Create moodle client
              this.moodleClientManager = new MoodleClientManager(this.moodleEndpoint)
              this.moodleClientManager.init((err) => {
                if (err) {
                  // Unable to init moodle client manager
                  Alerts.errorAlert({ text: 'Unable to retrieve rubric from moodle, have you the required permissions to get the rubric via API?' })
                  callback(err)
                } else {
                  const promises = []
                  // Get rubric
                  promises.push(new Promise((resolve, reject) => {
                    this.getRubric(assignmentData.cmid, assignmentData.courseId, (err, rubric) => {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(rubric)
                      }
                    })
                  }))
                  // Get students
                  promises.push(new Promise((resolve, reject) => {
                    this.getStudents(assignmentData.courseId, (err, students) => {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(students)
                      }
                    })
                  }))
                  Promise.all(promises).catch((rejects) => {
                    const reject = _.isArray(rejects) ? rejects[0] : rejects
                    Alerts.errorAlert({
                      title: 'Something went wrong',
                      text: reject.message
                    })
                  }).then((resolves) => {
                    if (resolves && resolves.length > 1) {
                      let students = null
                      if (LanguageUtils.isInstanceOf(resolves[0], Codebook)) {
                        this.rubric = resolves[0]
                        students = resolves[1]
                      } else {
                        this.rubric = resolves[1]
                        students = resolves[0]
                      }
                      // Send task to background
                      chrome.runtime.sendMessage({ scope: 'task', cmd: 'createHighlighters', data: { rubric: CircularJSON.stringifyStrict(this.rubric), students: students, courseId: assignmentData.courseId } }, (result) => {
                        if (result.err) {
                          Alerts.errorAlert({
                            title: 'Something went wrong',
                            text: 'Error when sending createHighlighters to the background. Please try it again.'
                          })
                        } else {
                          const minutes = result.minutes
                          let notFirstTime = false
                          Alerts.updateableAlert({
                            title: 'Configuration started',
                            text: 'We are configuring the assignment to mark using Mark&Go.' +
                              `This can take around <b>${minutes} minute(s)</b>.` +
                              'You can close this window, we will notify you when it is finished.<br/>Current status: <span></span>',
                            timerIntervalHandler: (swal, timerInterval) => {
                              chrome.runtime.sendMessage({ scope: 'task', cmd: 'getCurrentTaskStatus' }, (result) => {
                                if (result.status && result.status === 'Nothing pending' && notFirstTime) {
                                  Alerts.closeAlert()
                                  clearInterval(timerInterval)
                                  Alerts.updateableAlert({ text: 'The assignment is correctly configured', title: 'Configuration finished' })
                                } else if (result.status && result.status === 'CreateHighlighterTask pending') {
                                  notFirstTime = true
                                  swal.getContent().querySelector('span').innerHTML = result.statusMessage
                                }
                              })
                            },
                            timerIntervalPeriodInSeconds: 2
                          })
                          // Show message
                          callback(null)
                        }
                      })
                    }
                  }).catch((rejects) => {
                    const reject = _.isArray(rejects) ? rejects[0] : rejects
                    Alerts.errorAlert({
                      title: 'Something went wrong',
                      text: reject.message + '.\n' + chrome.i18n.getMessage('ContactAdministrator', [err.message, err.stack])
                    })
                  })
                }
              })
            }
          })
        })
      }
    })
  }

  getRubric (cmid, courseId, callback) {
    if (_.isFunction(callback)) {
      this.moodleClientManager.getRubric(cmid, (err, rubrics) => {
        if (err) {
          callback(new Error('Unable to get rubric from moodle. Check if you have the permission: ' + MoodleFunctions.getRubric.wsFunc))
        } else {
          this.moodleClientManager.getCmidInfo(cmid, (err, cmidInfo) => {
            if (err) {
              callback(new Error('Unable to retrieve assignment id from Moodle. Check if you have the permission: ' + MoodleFunctions.getCourseModuleInfo.wsFunc))
            } else {
              const assignmentId = cmidInfo.cm.instance
              this.constructRubricsModel({
                moodleRubrics: rubrics,
                courseId: courseId,
                assignmentId: assignmentId,
                callback: callback
              })
            }
          })
        }
      })
    }
  }

  getStudents (courseId, callback) {
    this.moodleClientManager.getStudents(courseId, (err, students) => {
      if (err) {
        callback(new Error('Unable to get students from moodle. Check if you have the permission: ' + MoodleFunctions.getStudents.wsFunc))
      } else {
        callback(null, students)
      }
    })
  }

  showToolIsConfiguring () {
    Alerts.loadingAlert({
      title: 'Configuring the tool, please be patient', // TODO i18n
      text: 'If the tool takes too much time, please reload the page and try again.'
    })
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }

  initLoginProcess (callback) {
    this.AnnotationServerClientManager.logIn((err) => {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    })
  }

  constructRubricsModel ({ moodleRubrics, courseId, assignmentId, callback }) {
    this.rubric = new Codebook({
      name: _.get(moodleRubrics, 'areas[0].definitions[0].name'),
      moodleEndpoint: this.moodleEndpoint,
      assignmentName: this.assignmentName,
      courseId: courseId
    })
    // Ensure a rubric is retrieved
    if (moodleRubrics.areas[0].activemethod === 'rubric') {
      const rubricCriteria = _.get(moodleRubrics, 'areas[0].definitions[0].rubric.rubric_criteria')
      const rubricCmid = _.get(moodleRubrics, 'areas[0].cmid')
      if (!_.isUndefined(rubricCriteria) && !_.isUndefined(assignmentId) && !_.isUndefined(rubricCmid)) {
        // Set assignment id
        this.rubric.assignmentId = assignmentId
        this.rubric.cmid = moodleRubrics.areas[0].cmid
        // Generate rubric model
        for (let i = 0; i < rubricCriteria.length; i++) {
          const moodleCriteria = rubricCriteria[i]
          const criteria = new Theme({ name: LanguageUtils.normalizeString(moodleCriteria.description), id: moodleCriteria.id, description: LanguageUtils.normalizeString(moodleCriteria.description), annotationGuide: this.rubric })
          // PVSCL:IFCOND(Hierarchy, LINE)

          this.rubric.themes.push(criteria)
        }
        callback(null, this.rubric)
      } else {
        // Message user assignment has not a rubric associated
        Alerts.errorAlert({ text: 'This assignment has not a rubric.' }) // TODO i18n
        if (_.isFunction(callback)) {
          callback()
        }
      }
    } else {
      // Message user assignment has not a rubric associated
      Alerts.errorAlert({ text: 'This assignment has not a rubric.' }) // TODO i18n
      if (_.isFunction(callback)) {
        callback()
      }
    }
  }
}

export default MoodleProvider
MoodleProvider.jsimport _ from 'lodash'

class MoodleScraping {
  static scrapAssignmentData (callback) {
    // Get assignment id and moodle endpoint
    if (window.location.href.includes('grade/grading/')) {
      const assignmentElement = document.querySelector('a[href*="mod/assign"]')
      const assignmentURL = assignmentElement.href
      // Get assignment name
      this.assignmentName = assignmentElement.innerText
      // Get assignment id
      this.cmid = (new URL(assignmentURL)).searchParams.get('id')
      // Get moodle endpoint
      this.moodleEndpoint = _.split(window.location.href, 'grade/grading/')[0]
      // Get course id
      const courseElement = document.querySelector('a[href*="course/view"]')
      this.courseId = (new URL(courseElement.href)).searchParams.get('id')
    } else if (window.location.href.includes('mod/assign/view')) {
      // Get assignment id
      this.cmid = (new URL(window.location)).searchParams.get('id')
      // Get moodle endpoint
      this.moodleEndpoint = _.split(window.location.href, 'mod/assign/view')[0]
      let assignmentElement = null
      // Get assignment name
      // Try moodle 3.5 in assignment main page
      const assignmentElementContainer = document.querySelector('ol.breadcrumb')
      if (assignmentElementContainer) { // Is moodle 3.5
        // Get assignment name
        assignmentElement = assignmentElementContainer.querySelector('a[href*="mod/assign"]')
        this.assignmentName = assignmentElement.innerText
        // Get course id
        const courseElement = assignmentElementContainer.querySelector('a[href*="course/view"]')
        this.courseId = (new URL(courseElement.href)).searchParams.get('id')
      }
      if (!_.isElement(assignmentElement)) {
        // Try moodle 3.1 in assignment main page
        const assignmentElementContainer = document.querySelector('ul.breadcrumb')
        if (assignmentElementContainer) {
          // Get assignment name
          assignmentElement = assignmentElementContainer.querySelector('a[href*="mod/assign"]')
          this.assignmentName = assignmentElement.innerText
          // Get course id
          const courseElement = assignmentElementContainer.querySelector('a[href*="course/view"]')
          this.courseId = (new URL(courseElement.href)).searchParams.get('id')
        }
        if (!_.isElement(assignmentElement)) {
          // Try moodle 3.5 in student grader page (action=grader)
          const assignmentElementContainer = document.querySelector('[data-region="assignment-info"]')
          if (assignmentElementContainer) {
            // Get assignment name
            assignmentElement = assignmentElementContainer.querySelector('a[href*="mod/assign"]')
            this.assignmentName = assignmentElement.innerText.split(':')[1].substring(1)
            // Get course id
            const courseElement = assignmentElementContainer.querySelector('a[href*="course/view"]')
            this.courseId = (new URL(courseElement.href)).searchParams.get('id')
          }
        }
      }
    }
    if (this.assignmentName && this.courseId && this.moodleEndpoint && this.cmid) {
      callback(null, {
        assignmentName: this.assignmentName,
        cmid: this.cmid,
        courseId: this.courseId,
        moodleEndpoint: this.moodleEndpoint
      })
    } else {
      callback(new Error(chrome.i18n.getMessage('MoodleWrongAssignmentPage')))
    }
  }
}

export default MoodleScraping
MoodleScraping.jsimport _ from 'lodash'
import axios from 'axios'
import jsonFormData from 'json-form-data'

class MoodleClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
  }

  updateToken (token) {
    this.token = token
  }

  updateEndpoint (endpoint) {
    this.endpoint = endpoint
  }

  init () {

  }

  getRubric (cmids, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      params: {
        wstoken: this.token,
        wsfunction: 'core_grading_get_definitions',
        areaname: 'submissions',
        'cmids[0]': cmids,
        moodlewsrestformat: 'json',
        activeonly: 0
      },
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }

  getCmidInfo (cmid, callback) {
    const data = { cmid: cmid }
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + 'webservice/rest/server.php?',
      method: 'POST',
      params: {
        wstoken: this.token,
        wsfunction: 'core_course_get_course_module',
        moodlewsrestformat: 'json'
      },
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'multipart/form-data'
      },
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      data: data,
      transformRequest: [(data) => {
        return jsonFormData(data)
      }]
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }

  updateStudentGradeWithRubric (data, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'multipart/form-data'
      },
      params: {
        wstoken: this.token,
        wsfunction: 'mod_assign_save_grade',
        moodlewsrestformat: 'json'
      },
      data: data,
      transformRequest: [(data) => {
        return jsonFormData(data)
      }]
    }
    axios(settings).then((response) => {
      axios(settings).then((response) => {
        callback(null, response.data)
      })
    })
  }

  getStudents (courseId, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      params: {
        wstoken: this.token,
        wsfunction: 'core_enrol_get_enrolled_users',
        courseid: courseId,
        moodlewsrestformat: 'json'
      },
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }
}

export default MoodleClient
MoodleClient.jsimport MoodleClient from './MoodleClient'
import _ from 'lodash'
import MoodleFunctions from './MoodleFunctions'
import APISimulation from './APISimulation'
import Config from '../Config'
// const RolesManager = require('../contentScript/RolesManager')

class MoodleClientManager {
  constructor (moodleEndPoint) {
    if (_.isNull(moodleEndPoint)) {
      console.error('Moodle client manager requires a moodle endpoint')
    } else {
      this.moodleEndpoint = moodleEndPoint
    }
  }

  init (callback) {
    // Retrieve token from moodle
    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'getTokenForEndpoint', data: { endpoint: this.moodleEndpoint } }, (result) => {
      if (result.err) {
        callback(new Error('Unable to retrieve valid token'))
      } else {
        this.tokens = result.tokens
        this.moodleClient = new MoodleClient(this.moodleEndpoint)
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }

  getRubric (cmids, callback) {
    if (_.isFunction(callback)) {
      // Check if API simulation is enabled
      chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'isApiSimulationActivated' }, (isActivated) => {
        if (isActivated.activated) {
          APISimulation.getRubric(cmids, callback)
        } else {
          const token = this.getTokenFor(MoodleFunctions.getRubric.wsFunc)
          if (_.isString(token)) {
            this.moodleClient.updateToken(token)
            this.moodleClient.getRubric(cmids, callback)
          } else {
            callback(new Error('NoPermissions'))
          }
        }
      })
    }
  }

  getCmidInfo (cmid, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.getCourseModuleInfo.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.getCmidInfo(cmid, callback)
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  updateStudentGradeWithRubric (data, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.updateStudentsGradeWithRubric.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.updateStudentGradeWithRubric(data, (err, data) => {
          if (err) {
            callback(err)
          } else {
            if (data === null) {
              callback(null)
            } else if (data.exception === 'dml_missing_record_exception') {
              callback(new Error(chrome.i18n.getMessage('ErrorSavingMarksInMoodle')))
            }
          }
        })
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  getStudents (courseId, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.getStudents.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.getStudents(courseId, callback)
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  getTokenFor (wsFunction) {
    const tokenWrapper = _.find(this.tokens, (token) => {
      return _.find(token.tests, (test) => {
        return test.service === wsFunction && test.enabled
      })
    })
    if (tokenWrapper) {
      return tokenWrapper.token
    } else {
      return null
    }
  }

  addSubmissionComment ({ courseId, studentId, text, callback }) {
    APISimulation.addSubmissionComment(this.moodleEndpoint, {
      courseId,
      studentId,
      text,
      isTeacher: window.abwa.rolesManager.role === Config.tags.producer,
      callback,
      contextId: window.abwa.targetManager.fileMetadata.contextId,
      itemId: window.abwa.targetManager.fileMetadata.itemId
    }, callback)
  }

  removeSubmissionComment ({ commentId, annotationId, callback }) {
    if (commentId) {

    }
  }

  getSubmissionComments () {

  }

  getStudentPreviousSubmissions ({ studentId, course = null }) {

  }
}

export default MoodleClientManager
MoodleClientManager.jsimport MoodleClient from './MoodleClient'

const moodleClient = new MoodleClient('', '')

const MoodleFunctions = {
  updateStudentsGradeWithRubric: {
    wsFunc: 'mod_assign_save_grade',
    testParams: {},
    clientFunc: moodleClient.updateStudentGradeWithRubric
  },
  getRubric: {
    wsFunc: 'core_grading_get_definitions',
    testParams: '0',
    clientFunc: moodleClient.getRubric
  },
  getStudents: {
    wsFunc: 'core_enrol_get_enrolled_users',
    testParams: '0',
    clientFunc: moodleClient.getStudents
  },
  getCourseModuleInfo: {
    wsFunc: 'core_course_get_course_module',
    testParams: {},
    clientFunc: moodleClient.getCmidInfo
  }
}

export default MoodleFunctions
MoodleFunctions.jsimport axios from 'axios'
import _ from 'lodash'
import jsonFormData from 'json-form-data'

class APISimulation {
  static getRubric (cmids, callback) {
    // TODO Verify that cmids is not an array
    // TODO Go to task main page
    const taskMainPageUrl = window.mag.moodleContentScript.moodleEndpoint + 'mod/assign/view.php?id=' + cmids
    axios.get(taskMainPageUrl)
      .then((response) => {
        const parser = new window.DOMParser()
        const docPreferences = parser.parseFromString(response.data, 'text/html')
        const rubricURLElement = docPreferences.querySelector('a[href*="grade/grading/manage.php?"]')
        if (rubricURLElement) {
          // TODO Go to rubric page
          const rubricURL = rubricURLElement.href
          axios.get(rubricURL)
            .then((response) => {
              const parser = new window.DOMParser()
              const docPreferences = parser.parseFromString(response.data, 'text/html')
              const rubricTable = docPreferences.querySelector('#rubric-criteria')
              // TODO Get each criterion
              const rubricCriteria = APISimulation.getRubricCriteriaFromRubricTable(rubricTable)
              const assignmentId = APISimulation.getAssignmentId(docPreferences)
              const assignmentName = APISimulation.getAssignmentName(docPreferences)
              // For each criterion
              const formattedRubric = APISimulation.constructGetRubricResponse({ rubricCriteria, cmid: cmids, assignmentId, assignmentName })
              callback(null, formattedRubric)
            })
        } else {
          // TODO Unable to retrieve rubric url
        }
      })
    // TODO Get table of rubrics
  }

  static getAssignmentName () {
    // TODO Get assignment name
    return null
  }

  static getRubricCriteriaFromRubricTable (rubricTable) {
    const criterionElements = rubricTable.querySelectorAll('.criterion')
    const criterias = []
    for (let i = 0; i < criterionElements.length; i++) {
      const criterionElement = criterionElements[i]
      const criteria = {}
      // Get id
      criteria.id = parseInt(_.last(criterionElement.id.split('-')))
      criteria.sortorder = i + 1
      criteria.description = criterionElement.querySelector('.description').innerText
      criteria.descriptionformat = 1 // The one by default is 1
      const levelElements = criterionElement.querySelectorAll('.level')
      const levels = []
      for (let j = 0; j < levelElements.length; j++) {
        const levelElement = levelElements[j]
        const level = {}
        // Get level id
        level.id = parseInt(_.last(levelElement.id.split('-')))
        // Get score
        level.score = parseFloat(levelElement.querySelector('.scorevalue').innerText)
        // Get descriptor
        level.definition = levelElement.querySelector('.definition').innerText
        // Get defintion format
        level.definitionformat = 1 // Default format of level definition
        // Add to levels
        levels.push(level)
      }
      criteria.levels = levels
      criterias.push(criteria)
    }
    return criterias
  }

  static getAssignmentId (document) {
    const deleteformElement = document.querySelector('a[href*="deleteform"]')
    if (deleteformElement) {
      const url = new URL(deleteformElement.href)
      return url.searchParams.get('deleteform')
    } else {
      return null
    }
  }

  static addSubmissionComment (moodleEndpoint, data, callback) {
    // Retrieve session key
    APISimulation.getCurrentSessionKey(moodleEndpoint, (err, sessionKey) => {
      if (err) {
        callback(err)
      } else {
        // Retrieve client_id for comment
        /* APISimulation.getClientIdForComment({
          moodleEndpoint, cmid: data.cmid, studentId: data.studentId, isTeacher: data.isTeacher
        }, (err, clientId) => {

        }) */
        const settings = {
          async: true,
          crossDomain: true,
          url: moodleEndpoint + '/comment/comment_ajax.php',
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          params: {
            wsfunction: 'mod_assign_save_grade',
            moodlewsrestformat: 'json'
          },
          data: {
            sesskey: sessionKey,
            action: 'add',
            client_id: '5c124b5dd5125', // TODO Check if it works in all moodle versions: It is a random client ID
            itemid: data.itemId,
            area: 'submission_comments',
            courseid: data.courseId,
            contextid: data.contextId,
            component: 'assignsubmission_comments',
            content: data.text
          },
          transformRequest: [(data) => {
            return jsonFormData(data)
          }]
        }
        axios(settings).then((response) => {
          callback(null, response.data)
        })
      }
    })
  }

  static getCurrentSessionKey (moodleEndpoint, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: moodleEndpoint + '/my/',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }

    axios(settings).then((response) => {
      const parser = new window.DOMParser()
      const docPreferences = parser.parseFromString(response.data, 'text/html')
      const sessionKeyInput = docPreferences.querySelector('input[name="sesskey"]')
      if (_.isElement(sessionKeyInput)) {
        callback(null, sessionKeyInput.value)
      } else {
        callback(new Error('You are not logged in moodle, please login and try it again.'))
      }
    })
  }

  static getClientIdForComment ({ moodleEndpoint, isTeacher, cmid, studentId }, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    if (isTeacher) {
      settings.url = moodleEndpoint + '/mod/assign/view.php?id=' + cmid + '&rownum=0&action=grader&userid=' + studentId
    } else {
      settings.url = moodleEndpoint + '/mod/assign/view.php?id=' + cmid
    }
    axios(settings).then((response) => {
      const parser = new window.DOMParser()
      const docPreferences = parser.parseFromString(response.data, 'text/html')
      const clientIdContainer = docPreferences.evaluate("//script[contains(., 'client_id')]", document, null, window.XPathResult.ANY_TYPE, null).iterateNext()
      if (clientIdContainer) {
        try {
          const clientId = clientIdContainer.innerText.split('client_id":"')[1].split('","commentarea')[0]
          callback(null, clientId)
        } catch (err) {
          callback(err)
        }
      }
    })
  }

  static removeSubmissionComment () {

  }

  static getSubmissionComments () {

  }

  static constructGetRubricResponse ({ cmid, rubricCriteria, assignmentId, assignmentName = '' }) {
    return {
      areas: [
        {
          cmid: cmid,
          activemethod: 'rubric',
          definitions: [
            {
              id: assignmentId,
              method: 'rubric',
              name: assignmentName,
              rubric: {
                rubric_criteria: rubricCriteria
              }
            }
          ]
        }
      ],
      warnings: []
    }
  }
}

export default APISimulation
APISimulation.jsimport _ from 'lodash'

class BackToWorkspace {
  static createWorkspaceLink (callback) {
    this.linkToWorkspace = document.createElement('a')
    if (window.abwa.codebookManager.codebookReader.codebook) {
      const rubric = window.abwa.codebookManager.codebookReader.codebook
      const studentId = window.abwa.targetManager.fileMetadata.studentId
      this.linkToWorkspace.href = rubric.moodleEndpoint + 'mod/assign/view.php?id=' + rubric.cmid + '&rownum=0&action=grader&userid=' + studentId
      this.linkToWorkspace.target = '_blank'
    }
    if (_.isFunction(callback)) {
      callback(this.linkToWorkspace)
    }
  }
}

export default BackToWorkspace
BackToWorkspace.jsimport _ from 'lodash'
import axios from 'axios'
import jsonFormData from 'json-form-data'

class MoodleClient {
  constructor (endpoint, token) {
    this.endpoint = endpoint
    this.token = token
  }

  updateToken (token) {
    this.token = token
  }

  updateEndpoint (endpoint) {
    this.endpoint = endpoint
  }

  init () {

  }

  getRubric (cmids, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      params: {
        wstoken: this.token,
        wsfunction: 'core_grading_get_definitions',
        areaname: 'submissions',
        'cmids[0]': cmids,
        moodlewsrestformat: 'json',
        activeonly: 0
      },
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }

  getCmidInfo (cmid, callback) {
    const data = { cmid: cmid }
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + 'webservice/rest/server.php?',
      method: 'POST',
      params: {
        wstoken: this.token,
        wsfunction: 'core_course_get_course_module',
        moodlewsrestformat: 'json'
      },
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'multipart/form-data'
      },
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      data: data,
      transformRequest: [(data) => {
        return jsonFormData(data)
      }]
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }

  updateStudentGradeWithRubric (data, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'multipart/form-data'
      },
      params: {
        wstoken: this.token,
        wsfunction: 'mod_assign_save_grade',
        moodlewsrestformat: 'json'
      },
      data: data,
      transformRequest: [(data) => {
        return jsonFormData(data)
      }]
    }
    axios(settings).then((response) => {
      axios(settings).then((response) => {
        callback(null, response.data)
      })
    })
  }

  getStudents (courseId, callback) {
    const settings = {
      async: true,
      crossDomain: true,
      url: this.endpoint + '/webservice/rest/server.php?',
      params: {
        wstoken: this.token,
        wsfunction: 'core_enrol_get_enrolled_users',
        courseid: courseId,
        moodlewsrestformat: 'json'
      },
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    axios(settings).then((response) => {
      if (_.isFunction(callback)) {
        callback(null, response.data)
      }
    })
  }
}

export default MoodleClient
MoodleClient.jsimport MoodleClient from './MoodleClient'
import _ from 'lodash'
import MoodleFunctions from './MoodleFunctions'
import APISimulation from './APISimulation'
import Config from '../Config'
// const RolesManager = require('../contentScript/RolesManager')

class MoodleClientManager {
  constructor (moodleEndPoint) {
    if (_.isNull(moodleEndPoint)) {
      console.error('Moodle client manager requires a moodle endpoint')
    } else {
      this.moodleEndpoint = moodleEndPoint
    }
  }

  init (callback) {
    // Retrieve token from moodle
    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'getTokenForEndpoint', data: { endpoint: this.moodleEndpoint } }, (result) => {
      if (result.err) {
        callback(new Error('Unable to retrieve valid token'))
      } else {
        this.tokens = result.tokens
        this.moodleClient = new MoodleClient(this.moodleEndpoint)
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }

  getRubric (cmids, callback) {
    if (_.isFunction(callback)) {
      // Check if API simulation is enabled
      chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'isApiSimulationActivated' }, (isActivated) => {
        if (isActivated.activated) {
          APISimulation.getRubric(cmids, callback)
        } else {
          const token = this.getTokenFor(MoodleFunctions.getRubric.wsFunc)
          if (_.isString(token)) {
            this.moodleClient.updateToken(token)
            this.moodleClient.getRubric(cmids, callback)
          } else {
            callback(new Error('NoPermissions'))
          }
        }
      })
    }
  }

  getCmidInfo (cmid, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.getCourseModuleInfo.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.getCmidInfo(cmid, callback)
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  updateStudentGradeWithRubric (data, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.updateStudentsGradeWithRubric.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.updateStudentGradeWithRubric(data, (err, data) => {
          if (err) {
            callback(err)
          } else {
            if (data === null) {
              callback(null)
            } else if (data.exception === 'dml_missing_record_exception') {
              callback(new Error(chrome.i18n.getMessage('ErrorSavingMarksInMoodle')))
            }
          }
        })
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  getStudents (courseId, callback) {
    if (_.isFunction(callback)) {
      const token = this.getTokenFor(MoodleFunctions.getStudents.wsFunc)
      if (_.isString(token)) {
        this.moodleClient.updateToken(token)
        this.moodleClient.getStudents(courseId, callback)
      } else {
        callback(new Error('NoPermissions'))
      }
    }
  }

  getTokenFor (wsFunction) {
    const tokenWrapper = _.find(this.tokens, (token) => {
      return _.find(token.tests, (test) => {
        return test.service === wsFunction && test.enabled
      })
    })
    if (tokenWrapper) {
      return tokenWrapper.token
    } else {
      return null
    }
  }

  addSubmissionComment ({ courseId, studentId, text, callback }) {
    APISimulation.addSubmissionComment(this.moodleEndpoint, {
      courseId,
      studentId,
      text,
      isTeacher: window.abwa.rolesManager.role === Config.tags.producer,
      callback,
      contextId: window.abwa.targetManager.fileMetadata.contextId,
      itemId: window.abwa.targetManager.fileMetadata.itemId
    }, callback)
  }

  removeSubmissionComment ({ commentId, annotationId, callback }) {
    if (commentId) {

    }
  }

  getSubmissionComments () {

  }

  getStudentPreviousSubmissions ({ studentId, course = null }) {

  }
}

export default MoodleClientManager
MoodleClientManager.jsimport _ from 'lodash'
import AnnotationUtils from '../utils/AnnotationUtils'
import jsYaml from 'js-yaml'
import Codebook from '../codebook/model/Codebook'

class MoodleEstimation {
  static getAssessmentHistoricDataForStudentAssignmentPair ({ definitionAnnotationsFromSameCmid, assessmentAnnotations }) {
    return definitionAnnotationsFromSameCmid.map((definitionAnnotationForStudent) => {
      // Get assessment annotations for the student
      let assessmentAnnotationsForStudent = assessmentAnnotations.filter(assessmentAnnotation => {
        return assessmentAnnotation.group === definitionAnnotationForStudent.group
      })
      if (assessmentAnnotationsForStudent.length > 1) {
        assessmentAnnotationsForStudent = _.sortBy(assessmentAnnotationsForStudent, 'created')
        // Calculate taking into account that teacher could not evaluate it constantly (e.g.: whole assignment in the same day)
        // Group annotations that have not more than 1 hour of difference between it and the next/previous ones (we supose that if teacher spent more than 1 hour creating an annotation, means that there was a stop during assessment activity)
        let groups = []
        let groupCount = 0
        let time = new Date(assessmentAnnotationsForStudent[0].created).getTime()
        groups[groupCount] = [assessmentAnnotationsForStudent[0]]
        for (let i = 1; i < assessmentAnnotationsForStudent.length; i++) {
          let currentAnnoTime = new Date(assessmentAnnotationsForStudent[i].created).getTime()
          if (time < currentAnnoTime - 1000 * 60 * 15) {
            groupCount += 1
            groups[groupCount] = [assessmentAnnotationsForStudent[i]]
          } else {
            groups[groupCount].push(assessmentAnnotationsForStudent[i])
          }
          time = currentAnnoTime
        }
        // For each group, get oldest and newest annotation and sum difference
        let times = groups.map(group => {
          let oldestAnnotation = _.first(group)
          let newestAnnotation = _.last(group)
          return Math.abs(new Date(newestAnnotation.created).getTime() - new Date(oldestAnnotation.created).getTime())
        })
        let timeRequired = _.sum(times)
        // Calculate number of criterion assessed
        let annotationsWithMark = assessmentAnnotationsForStudent.filter(assessmentAnnotation => {
          return AnnotationUtils.getTagFromAnnotation(assessmentAnnotation, 'oa:code:')
        })
        let assessedCriteria = _.groupBy(annotationsWithMark, (annotationWithMark) => {
          return AnnotationUtils.getTagFromAnnotation(annotationWithMark, 'oa:isCodeOf:').replace('oa:isCodeOf:', '')
        })
        return {
          time: timeRequired,
          numberOfCriterionAssessed: _.keys(assessedCriteria).length
        }
      } else if (assessmentAnnotationsForStudent.length === 1) {
        //
        if (assessmentAnnotationsForStudent[0].created !== assessmentAnnotationsForStudent[0].updated &&
          AnnotationUtils.getTagFromAnnotation(assessmentAnnotationsForStudent[0], 'oa:code:')) {
          let timeRequired = new Date(assessmentAnnotationsForStudent[0].updated).getTime() - new Date(assessmentAnnotationsForStudent[0].created).getTime()
          return {
            time: timeRequired,
            numberOfCriterionAssessed: 1
          }
        } else {
          return { time: 0, numberOfCriterionAssessed: 0 }
        }
      } else {
        return { time: 0, numberOfCriterionAssessed: 0 }
      }
    })
  }

  static retrieveAnnotationsForMarkAndGo (annotationServerManager, callback) {
    annotationServerManager.client.getListOfGroups({}, (err, groups) => {
      if (err) {

      } else {
        let moodleBasedGroups = groups.filter(group => group.name.startsWith('MG'))
        let promises = []
        let annotationsPerGroup = {}
        moodleBasedGroups.forEach((moodleBasedGroup) => {
          promises.push(new Promise((resolve, reject) => {
            annotationServerManager.client.searchAnnotations({
              group: moodleBasedGroup.id
            }, (err, annotations) => {
              if (err) {
                reject(err)
              } else {
                annotationsPerGroup[moodleBasedGroup.id] = annotations
                resolve()
              }
            })
          }))
        })
        Promise.allSettled(promises).then(() => {
          // Get assignment name
          callback(null, annotationsPerGroup)
        })
      }
    })
  }

  static estimateTimeInMilisecondsPendingToAssess ({ annotationsPerGroup, assignmentName, cmid, numberOfStudentsAssignmentsSubmitted }, callback) {
    // Find if same group exist
    let allAnnotations = _.flattenDeep(_.values(annotationsPerGroup))
    let definitionAnnotations = allAnnotations.filter(anno => anno.motivation === 'defining')
    let assessmentAnnotations = AnnotationUtils.filterByPurpose(allAnnotations, 'classifying')
    if (definitionAnnotations) {
      // Get definition annotations for assignment with same name (in previous courses was defined with same name)
      let definitionAnnotationsWithSameAssignmentName = definitionAnnotations.filter(anno => {
        let assignmentConfig = jsYaml.load(anno.text)
        if (assignmentConfig) {
          return assignmentConfig.assignmentName === assignmentName
        }
      })
      // Get definition annotations for same cmid
      let definitionAnnotationsFromSameCmid = definitionAnnotations.filter(anno => AnnotationUtils.getTagFromAnnotation(anno, 'cmid:' + cmid))
      // Exists annotations or configuration for current assignment
      if (definitionAnnotationsFromSameCmid.length > 0) {
        // Get rubric
        MoodleEstimation.getCodebookForCmidFromAnnotations(cmid, allAnnotations, (err, codebook) => {
          if (err) {
            console.error(err)
          } else {
            console.log(codebook)
            // Get number of criterion evaluated for each student and its time
            let studentsAndTimes = MoodleEstimation.getAssessmentHistoricDataForStudentAssignmentPair({ assessmentAnnotations, definitionAnnotationsFromSameCmid })
            let validStudentsAndTimesToCalculateTime = _.filter(studentsAndTimes, (studentAndTime) => {
              return studentAndTime.numberOfCriterionAssessed > 0
            })
            // Calculate extra time required to assess
            let numberOfAssessedCriteria = 0
            let timeOfAssessedCriteria = 0
            validStudentsAndTimesToCalculateTime.forEach(studentAndTime => {
              timeOfAssessedCriteria += studentAndTime.time
              numberOfAssessedCriteria += studentAndTime.numberOfCriterionAssessed
            })
            let timeInMilisecondsPendingToAssess = (timeOfAssessedCriteria / numberOfAssessedCriteria) * ((codebook.themes.length * numberOfStudentsAssignmentsSubmitted) - numberOfAssessedCriteria)
            callback(null, {
              timeInMilisecondsPendingToAssess, studentsAndTimes, numberOfAssessedCriteria, timeOfAssessedCriteria
            })
          }
        })
        // Check if similar assignments are already assessed

      } else if (definitionAnnotationsWithSameAssignmentName.length > 0) { // TODO There is a previously configured group with same assignment name

      } else { // TODO There are not found annotations or configuration for current assignment, nothing to do

      }
    }
  }

  static getCodebookForCmidFromAnnotations (cmid, allAnnotations, callback) {
    let annotationsForCmid = _.filter(allAnnotations, (annotation) => {
      return _.isString(AnnotationUtils.getTagFromAnnotation(annotation, 'cmid:' + cmid))
    })
    let rubricDefinitionAnnotations = _.filter(_.first(_.values(_.groupBy(annotationsForCmid, 'group'))), anno => anno.motivation === 'codebookDevelopment' || anno.motivation === 'defining')
    Codebook.fromAnnotations(rubricDefinitionAnnotations, (err, codebook) => {
      if (err) {
        callback(err)
      } else {
        callback(null, codebook)
      }
    })
  }
}

export default MoodleEstimation
MoodleEstimation.jsimport MoodleEstimation from './MoodleEstimation'
import DateTimeUtils from '../utils/DateTimeUtils'
import axios from 'axios'
import _ from 'lodash'
import Events from '../Events'

class MoodleEstimationManager {
  constructor () {
    this.assignmentName = window.abwa.codebookManager.codebookReader.codebook.assignmentName
    this.cmid = window.abwa.codebookManager.codebookReader.codebook.cmid
  }

  init (callback) {
    this.initEventListeners(() => {
      this.calculateAndDisplayEstimation(callback)
    })
  }

  calculateAndDisplayEstimation (callback) {
    MoodleEstimation.retrieveAnnotationsForMarkAndGo(window.abwa.annotationServerManager, (err, annotationsPerGroup) => {
      if (err) {
        console.error('Unable to retrieve annotations of previous mark&go groups')
      } else {
        // Get number of students assignments submitted
        this.getNumberOfStudentsAssignmentsSubmitted((err, numberOfStudentsAssignmentsSubmitted) => {
          if (err) {
            console.error('Unable to retrieve number of students who submit their assignments.')
          } else {
            MoodleEstimation.estimateTimeInMilisecondsPendingToAssess({
              annotationsPerGroup, assignmentName: this.assignmentName, cmid: this.cmid, numberOfStudentsAssignmentsSubmitted
            }, (err, { numberOfAssessedCriteria, timeOfAssessedCriteria }) => {
              if (err) {
                console.error(err)
              } else {
                // Get number of total criterion to assess per student
                let timePerCriterion = timeOfAssessedCriteria / numberOfAssessedCriteria

                // Get pending assessment
                let doneCriterionNumber = _.compact(window.abwa.annotatedContentManager.annotatedThemes.map(annotatedTheme => annotatedTheme.annotatedCodes.find(code => code.annotations.length > 0))).length
                let pendingCriterionNumber = window.abwa.codebookManager.codebookReader.codebook.themes.length - doneCriterionNumber

                // Divide total estimated time by number of criteria
                let pendingTimeInMiliseconds = timePerCriterion * pendingCriterionNumber

                // Display extra time required to assess
                let estimatedTimeCounterElement = document.querySelector('#estimatedTimeCounter')
                let humanReadablePendingTime = DateTimeUtils.getHumanReadableTimeFromUnixTimeInMiliseconds(pendingTimeInMiliseconds)
                let result
                if (humanReadablePendingTime === 0) {
                  result = '- Assessed'
                } else if (_.isError(humanReadablePendingTime)) {
                  result = ''
                } else {
                  result = ' - ' + humanReadablePendingTime
                }
                if (_.isElement(estimatedTimeCounterElement)) {
                  estimatedTimeCounterElement.innerText = result
                } else {
                  document.querySelector('#toolsetHeader').innerHTML += '<span id="estimatedTimeCounter">' + result + '</span>'
                }
                if (_.isFunction(callback)) {
                  callback()
                }
              }
            })
          }
        })
      }
    })
  }

  initEventListeners (callback) {
    this.events = {}
    // Estimation time must be updated if it is detected a new annotation creation, modification (marked) or deletion
    // Created
    this.events.annotationCreatedEvent = { element: document, event: Events.annotationCreated, handler: this.createEstimationEventListener() }
    this.events.annotationCreatedEvent.element.addEventListener(this.events.annotationCreatedEvent.event, this.events.annotationCreatedEvent.handler, false)
    // Deleted
    this.events.annotationDeletedEvent = { element: document, event: Events.annotationDeleted, handler: this.createEstimationEventListener() }
    this.events.annotationDeletedEvent.element.addEventListener(this.events.annotationDeletedEvent.event, this.events.annotationDeletedEvent.handler, false)
    // Marked
    this.events.codeToAllEvent = { element: document, event: Events.codeToAll, handler: this.createEstimationEventListener() }
    this.events.codeToAllEvent.element.addEventListener(this.events.codeToAllEvent.event, this.events.codeToAllEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createEstimationEventListener () {
    return () => {
      this.calculateAndDisplayEstimation()
    }
  }

  getNumberOfStudentsAssignmentsSubmitted (callback) {
    if (_.isFunction(callback)) {
      if (_.isNumber(this.submittedAssignments)) {
        callback(null, this.submittedAssignments)
      } else {
        // Get url of asssignment description in moodle
        let assignmentURL = window.abwa.codebookManager.codebookReader.codebook.moodleEndpoint + 'mod/assign/view.php?id=' + window.abwa.codebookManager.codebookReader.codebook.cmid
        axios.get(assignmentURL).then((response) => {
          let container = document.implementation.createHTMLDocument().documentElement
          container.innerHTML = response.data
          let result = Number.parseInt(container.querySelector('#region-main > div:nth-child(3) > div.gradingsummary > div > table > tbody > tr:nth-child(3) > td').innerText)
          this.submittedAssignments = result
          callback(null, result)
        })
      }
    }
  }
}

export default MoodleEstimationManager
MoodleEstimationManager.jsimport MoodleClient from './MoodleClient'

const moodleClient = new MoodleClient('', '')

const MoodleFunctions = {
  updateStudentsGradeWithRubric: {
    wsFunc: 'mod_assign_save_grade',
    testParams: {},
    clientFunc: moodleClient.updateStudentGradeWithRubric
  },
  getRubric: {
    wsFunc: 'core_grading_get_definitions',
    testParams: '0',
    clientFunc: moodleClient.getRubric
  },
  getStudents: {
    wsFunc: 'core_enrol_get_enrolled_users',
    testParams: '0',
    clientFunc: moodleClient.getStudents
  },
  getCourseModuleInfo: {
    wsFunc: 'core_course_get_course_module',
    testParams: {},
    clientFunc: moodleClient.getCmidInfo
  }
}

export default MoodleFunctions
MoodleFunctions.jsimport CryptoUtils from '../utils/CryptoUtils'

class MoodleUtils {
  static createURLForAnnotation ({ annotation, studentId, courseId, cmid }) {
    return annotation.target[0].source.url + '#studentId:' + studentId + '&mag:' + annotation.id + '&courseId:' + courseId + '&cmid:' + cmid
  }

  static getHashedGroup ({ studentId, moodleEndpoint, courseId }) {
    const groupName = moodleEndpoint + courseId + '-' + studentId
    // We create a hash using the course ID and the student ID to anonymize the Hypothes.is group
    return 'MG' + CryptoUtils.hash(groupName).substring(0, 23)
  }
}

export default MoodleUtils
MoodleUtils.js// PVSCL:IFCOND(MoodleProvider or MoodleConsumer, LINE)
import URLUtils from '../utils/URLUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleConsumer or MoodleProvider, LINE)
    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'getMoodleCustomEndpoint' }, (endpoint) => {
      document.querySelector('#moodleEndpoint').value = endpoint.endpoint
    })

    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'isApiSimulationActivated' }, (isActivated) => {
      document.querySelector('#apiSimulationCheckbox').checked = isActivated.activated
    })
    document.querySelector('#apiSimulationCheckbox').addEventListener('change', () => {
      this.updateApiSimulationCheckbox()
    })
    document.querySelector('#moodleEndpoint').addEventListener('change', () => {
      this.updateMoodleEndpoint()
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or MoodleConsumer, LINE)

  updateApiSimulationCheckbox () {
    const isChecked = document.querySelector('#apiSimulationCheckbox').checked
    chrome.runtime.sendMessage({
      scope: 'moodle',
      cmd: 'setApiSimulationActivation',
      data: { isActivated: isChecked }
    }, (response) => {
      console.debug('Api simulation is updated to: ' + response.activated)
    })
  }

  updateMoodleEndpoint () {
    const value = document.querySelector('#moodleEndpoint').value
    let isValidUrl = URLUtils.isUrl(value)
    if (!isValidUrl) {
      isValidUrl = URLUtils.isUrl(value + '/')
      if (isValidUrl) {
        document.querySelector('#moodleEndpoint').value = value + '/'
      }
    }
    if (isValidUrl) {
      chrome.runtime.sendMessage({
        scope: 'moodle',
        cmd: 'setMoodleCustomEndpoint',
        data: { endpoint: value }
      }, ({ endpoint }) => {
        console.debug('Endpoint updated to ' + endpoint.endpoint)
      })
    } else {
      Alerts.errorAlert({ error: 'URL is malformed' }) // TODO i18n
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)
import MoodleDownloadManager from './background/MoodleDownloadManager'
import MoodleBackgroundManager from './background/MoodleBackgroundManager'
import TaskManager from './background/TaskManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider, LINE)
    // Initialize moodle background manager
    this.moodleBackgroundManager = new MoodleBackgroundManager()
    this.moodleBackgroundManager.init()

    // Initialize moodle download manager
    this.moodleDownloadManager = new MoodleDownloadManager()
    this.moodleDownloadManager.init()

    // Initialize task manager
    this.taskManager = new TaskManager()
    this.taskManager.init()

    // PVSCL:ENDCONDimport _ from 'lodash'

window.addEventListener('load', () => {
  console.debug('Loaded moodle assignment add content script')
  // Look for send students notifications
  const studentsNotificationsSelectElement = document.querySelector('#id_sendstudentnotifications')
  if (_.isElement(studentsNotificationsSelectElement)) {
    studentsNotificationsSelectElement.value = 0
    console.debug('Disabled automatic notification to students')
  }

  // Enable feedback comments
  const feedbackCommentsCheckElement = document.querySelector('#id_assignfeedback_comments_enabled')
  if (_.isElement(feedbackCommentsCheckElement)) {
    feedbackCommentsCheckElement.checked = true
    console.debug('Activated feedback comments to students')
  }
})
moodleAssignmentAddContentScript.jsimport _ from 'lodash'
import MoodleProvider from './codebook/operations/create/moodleProvider/MoodleProvider'
import MoodleAugmentation from './codebook/operations/create/moodleProvider/augmentation/MoodleAugmentation'

window.addEventListener('load', () => {
  console.debug('Loaded moodle content script')
  // When page is loaded, popup button should be always deactivated
  chrome.runtime.sendMessage({ scope: 'extension', cmd: 'deactivatePopup' }, (result) => {
    console.log('Deactivated popup')
  })
  // When popup button is clicked
  chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
    if (_.isEmpty(window.mag)) {
      if (msg.action === 'initContentScript') {
        window.mag = {}
        window.mag.moodleContentScript = new MoodleProvider()
        window.mag.moodleContentScript.init(() => {
          // Disable the button of popup
          chrome.runtime.sendMessage({ scope: 'extension', cmd: 'deactivatePopup' }, (result) => {
            console.log('Deactivated popup')
          })
          window.mag = null
        })
      }
    }
  })
  // Augmentate moodle to add user id for each file link
  window.moodleAugmentation = new MoodleAugmentation()
  window.moodleAugmentation.init()
})
moodleContentScript.jsimport HypothesisClientManager from './annotationServer/hypothesis/HypothesisClientManager'
import BrowserStorageManager from './annotationServer/browserStorage/BrowserStorageManager'
import _ from 'lodash'
import DateTimeUtils from './utils/DateTimeUtils'
import MoodleEstimation from './moodle/MoodleEstimation'

class MoodleEstimationContentScript {
  init () {
    this.cmid = this.getCmid()
    this.assignmentName = this.getAssignmentName()
    this.moodleEndpoint = this.getMoodleEndpoint()
    this.loadAnnotationServer((err) => {
      if (err) {
        console.error('Unable to load annotation server. Error: ' + err.message)
      } else {
        MoodleEstimation.retrieveAnnotationsForMarkAndGo(this.annotationServerManager, (err, annotationsPerGroup) => {
          if (err) {
            console.error('Unable to retrieve annotations of previous mark&go groups. Error: ' + err.message)
          } else {
            // Get number of students assignments submitted
            let numberOfStudentsAssignmentsSubmitted = Number.parseInt(document.querySelector('#region-main > div:nth-child(3) > div.gradingsummary > div > table > tbody > tr:nth-child(3) > td').innerText)
            MoodleEstimation.estimateTimeInMilisecondsPendingToAssess({
              annotationsPerGroup, assignmentName: this.assignmentName, cmid: this.cmid, numberOfStudentsAssignmentsSubmitted
            }, (err, { timeInMilisecondsPendingToAssess }) => {
              if (err) {
                console.error(err)
              } else {
                // Display extra time required to assess
                let humanReadablePendingTime = DateTimeUtils.getHumanReadableTimeFromUnixTimeInMiliseconds(timeInMilisecondsPendingToAssess)
                if (_.isError(humanReadablePendingTime)) {
                  console.error('Unable to calculate estimated time to assess')
                } else {
                  let rowElementInGradingSummary = document.querySelector('#region-main > div:nth-child(3) > div.gradingsummary > div > table > tbody > tr:nth-child(5)')
                  let estimatedTimeNode = rowElementInGradingSummary.cloneNode(true)
                  estimatedTimeNode.querySelector('th').innerText = 'Estimated assessment time'
                  estimatedTimeNode.querySelector('td').innerText = humanReadablePendingTime
                  rowElementInGradingSummary.insertAdjacentElement('afterend', estimatedTimeNode)
                }
              }
            })
          }
        })
      }
    })
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }

  getCmid () {
    // For page with form: mod/assign/view.php?id=
    return new URL(window.location.href).searchParams.get('id')
  }

  getAssignmentName () {
    return document.querySelector('#region-main > div:nth-child(3) > h2').innerText
  }

  getMoodleEndpoint () {
    return window.location.href.split('mod/assign/view.php')[0]
  }
}

window.addEventListener('load', () => {
  window.moodleEstimation = {}
  window.moodleEstimation.moodleEstimationContentScript = new MoodleEstimationContentScript()
  window.moodleEstimation.moodleEstimationContentScript.init()
})
moodleEstimation.jsimport _ from 'lodash'
import HypothesisClientManager from './annotationServer/hypothesis/HypothesisClientManager'
import BrowserStorageManager from './annotationServer/browserStorage/BrowserStorageManager'
import MoodleFunctions from './moodle/MoodleFunctions'
import MoodleClientManager from './moodle/MoodleClientManager'
import MoodleUtils from './moodle/MoodleUtils'

class MoodleResumptionContentScript {
  init () {
    console.debug('Loading moodle resumption content script')
    this.moodleEndpoint = this.getMoodleInstanceUrl()
    this.moodleClientManager = new MoodleClientManager(this.moodleEndpoint)
    this.moodleClientManager.init((err) => {
      if (err) {
        console.error('Unable to load moodle client manager.' + err.message)
      } else {
        // Get course id
        this.courseId = this.getCourseId()
        // Get list of students' id
        this.getStudentsId(this.courseId, (err, students) => {
          if (err) {
            console.error('Unable to retrieve students from this course.' + err.message)
          } else {
            this.loadAnnotationServer(() => {
              this.getUserGroups((err, groups) => {
                if (err) {
                  console.error('Unable to retrieve groups of current user')
                } else {
                  // Get assignments
                  const activityInstances = [...document.querySelectorAll('.activityinstance')]
                  activityInstances.forEach((activityInstance) => {
                    let activityUrl = activityInstance.querySelector('.aalink').href
                    let activityId = this.getActivityIdFromUrl(activityUrl)
                    // Get annotations for each activity
                    this.annotationServerManager.client.searchAnnotations({
                      wildcard_uri: this.moodleEndpoint + '*',
                      tag: 'cmid:' + activityId,
                      sort: 'updated'
                    }, (err, annotations) => {
                      if (err) {
                        console.error('Unable to retrieve annotations to check recent activity for moodle activity ' + activityId)
                      } else {
                        if (annotations.length > 0) {
                          // Get last annotation
                          let lastAnnotation = annotations[0]
                          let groupOfLastAnnotation = groups.find(group => group.id === lastAnnotation.group)
                          // Find student for group of last annotation
                          let student = this.findStudentForAnnotationGroup({ groupName: groupOfLastAnnotation.name, students })
                          // Get link to last student
                          let studentGradePageUrl = this.getStudentGradePageUrl({ assignmentId: activityId, studentId: student.id })
                          // Create icon
                          let actionsContainer = activityInstance.parentElement.querySelector('.actions')
                          if (actionsContainer) {
                            actionsContainer.insertAdjacentHTML('afterbegin', '<span class="resumptionFacility">' +
                              '<a target="_blank" href="' + studentGradePageUrl + '"><img title="Resume ' + student.name + '\'s assessment" class="icon iconsmall" style="width:24px;height:24px;" src="' + chrome.extension.getURL('/images/resume.png') + '"/></a></span>')
                          }
                          console.debug('Loading moodle resumption content script')
                        }
                      }
                    })
                  })
                }
              })
            })
          }
        })
      }
    })
  }

  getStudentGradePageUrl ({ assignmentId, studentId }) {
    // The grading url has the following form: https://moodle.haritzmedina.com/mod/assign/view.php?id=2&action=grader&userid=4
    return this.moodleEndpoint + 'mod/assign/view.php?id=' + assignmentId + '&action=grader&userid=' + studentId
  }

  getUserGroups (callback) {
    this.annotationServerManager.client.getListOfGroups(null, (err, groups) => {
      if (err) {
        callback(err)
      } else {
        callback(null, groups)
      }
    })
  }

  getStudentsId (courseId, callback) {
    this.getStudents(courseId, (err, students) => {
      if (err) {
        callback(err)
      } else {
        let studentsIds = _.compact(students.map((student) => {
          if (student.roles.find(role => role.shortname === 'student')) {
            return { id: student.id, name: student.fullname }
          }
        }))
        callback(null, studentsIds)
      }
    })
  }

  getStudents (courseId, callback) {
    this.moodleClientManager.getStudents(courseId, (err, students) => {
      if (err) {
        callback(new Error('Unable to get students from moodle. Check if you have the permission: ' + MoodleFunctions.getStudents.wsFunc))
      } else {
        callback(null, students)
      }
    })
  }

  getCourseId () {
    return new URL(window.location.href).searchParams.get('id')
  }

  destroy () {

  }

  getActivityIdFromUrl (url) {
    let parsedUrl = new URL(url)
    return parsedUrl.searchParams.get('id')
  }

  getMoodleInstanceUrl () {
    return window.location.href.split('course/view.php')[0]
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }

  findStudentForAnnotationGroup ({ groupName, students }) {
    return students.find((student) => {
      const hashedGroupName = MoodleUtils.getHashedGroup({ studentId: student.id, courseId: this.courseId, moodleEndpoint: this.moodleEndpoint })
      if (hashedGroupName === groupName) {
        return student
      }
    })
  }
}

window.addEventListener('load', () => {
  window.moodleResumption = {}
  window.moodleResumption.moodleResumptionContentScript = new MoodleResumptionContentScript()
  window.moodleResumption.moodleResumptionContentScript.init()
})
moodleResumption.js      // PVSCL:IFCOND(Manual and Hypothesis and NOT (MoodleProvider),LINE)
      "exclude_matches": ["https://hypothes.is/login"],
      // PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider,LINE)
      "exclude_matches": ["*://*/*grade/grading/*", "*://*/*mod/assign/view.php*", "*://*/*course/modedit.php?add=assign*"PVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCOND],      //PVSCL:ENDCONDPVSCL:IFCOND(MoodleProvider),
    {
      "matches": ["*://*/*grade/grading/*", "*://*/*mod/assign/view.php*"],
      "js": ["scripts/moodleContentScript.js"],
      "run_at": "document_end"
    }, {
      "matches": ["*://*/*course/modedit.php?add=assign*"],
      "js": ["scripts/moodleAssignmentAddContentScript.js"],
      "run_at": "document_end"
    }PVSCL:ENDCOND