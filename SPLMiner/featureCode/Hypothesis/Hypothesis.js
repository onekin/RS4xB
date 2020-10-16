// PVSCL:IFCOND(Hypothesis, LINE)
  <div id="notLoggedInGroupContainer" class="sidebarContainer" aria-hidden="true">
    <div id="hypothesisLogin" class="containerHeader">
      Please log in your chosen annotation server
    </div>
    <div>
      <h4>Hypothes.is</h4>
      <a href="https://hypothes.is/login" target="_blank">Log in</a> / <a href="https://hypothes.is/signup" target="_blank">Sign up</a>
    </div>
  </div>
  // PVSCL:ENDCOND/* PVSCL:IFCOND(Hypothesis) */else {
          annotationWithTitle = _.find(codingAnnotationsForPrimaryStudy, (annotation) => {
            return annotation.documentMetadata.title
          })
          if (annotationWithTitle) {
            title = annotationWithTitle.documentMetadata.title
          }
        } /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hypothesis,LINE)
import HypothesisClientManager from '../annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
    // Hypothes.is supports comments, but they are not stored in body, they use text
    const commentingBody = this.getBodyForPurpose(Commenting.purpose)
    if (commentingBody) {
      data.text = commentingBody.value
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    // The following lines are added to maintain compatibility with hypothes.is's data model that doesn't follow the W3C in all their attributes
    // PVSCL:IFCOND(Commenting, LINE)
    // Hypothes.is supports comments, but they are not stored in body, they use text
    const commentingBody = this.getBodyForPurpose(Commenting.purpose)
    if (commentingBody) {
      data.text = commentingBody.value
    }
    // PVSCL:ENDCOND    // Adaptation of target source to hypothes.is's compatible document attribute
    if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
      // Add uri attribute
      data.uri = window.abwa.targetManager.getDocumentURIToSaveInAnnotationServer()
      // Add document, uris, title, etc.
      const uris = window.abwa.targetManager.getDocumentURIs()
      data.document = {}
      if (uris.urn) {
        data.document.documentFingerprint = uris.urn
      }
      data.document.link = Object.values(uris).map(uri => { return { href: uri } })
      if (uris.doi) {
        data.document.dc = { identifier: [uris.doi] }
        data.document.highwire = { doi: [uris.doi] }
      }
      // If document title is retrieved
      if (_.isString(window.abwa.targetManager.documentTitle)) {
        data.document.title = window.abwa.targetManager.documentTitle
      }
      // Copy to metadata field because hypothes.is doesn't return from its API all the data that it is placed in document
      data.documentMetadata = this.target
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
      annotation.target = annotationObject.documentMetadata || annotationObject.target
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
import HypothesisClientManager from '../../annotationServer/hypothesis/HypothesisClientManager'
import Hypothesis from '../../annotationServer/hypothesis/Hypothesis'
import LanguageUtils from '../../utils/LanguageUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    if (LanguageUtils.isInstanceOf(this.annotationServerClientManager, HypothesisClientManager)) {
      annotationServer.group.links.html = annotationServer.group.links.html.substr(0, annotationServer.group.links.html.lastIndexOf('/'))
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    if (LanguageUtils.isInstanceOf(this.annotationServerClientManager, HypothesisClientManager)) {
      rubric.annotationServer.group.links.html = rubric.annotationServer.group.links.html.substr(0, rubric.annotationServer.group.links.html.lastIndexOf('/'))
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCONDimport DOM from '../utils/DOM'
import $ from 'jquery'
import HypothesisClientManager from '../annotationServer/hypothesis/HypothesisClientManager'
import _ from 'lodash'
import HypothesisBackgroundManager from '../annotationServer/hypothesis/HypothesisBackgroundManager'
const checkHypothesisLoggedIntervalInSeconds = 20 // fetch token every X seconds
const checkHypothesisLoggedInWhenPromptInSeconds = 0.5 // When user is prompted to login, the checking should be with higher period
const maxTries = 10 // max tries before deleting the token

class HypothesisManager {
  constructor () {
    // Define token
    this.token = null
    // Define tries before logout
    this.tries = 0
  }

  init () {
    // Try to load token for first time
    this.retrieveHypothesisToken((err, token) => {
      this.setToken(err, token)
    })

    // Init hypothesis client manager
    this.initHypothesisClientManager()
    // Init hypothesis background manager, who listens to commands from contentScript
    this.initHypothesisBackgroundManager()

    // Create an observer to check if user is logged to hypothesis
    this.createRetryHypothesisTokenRetrieve()

    // Initialize replier for login form authentication
    this.initShowHypothesisLoginForm()

    // Initialize replier for requests of hypothesis related metadata
    this.initResponserForGetToken()
  }

  createRetryHypothesisTokenRetrieve (intervalSeconds = checkHypothesisLoggedIntervalInSeconds) {
    const intervalHandler = () => {
      this.retrieveHypothesisToken((err, token) => {
        this.setToken(err, token)
      })
    }
    this.retrieveTokenInterval = setInterval(intervalHandler, intervalSeconds * 1000)
  }

  changeTokenRetrieveInterval (seconds = checkHypothesisLoggedIntervalInSeconds) {
    clearInterval(this.retrieveTokenInterval)
    this.createRetryHypothesisTokenRetrieve(seconds)
  }

  retrieveHypothesisToken (callback) {
    const callSettings = {
      async: true,
      crossDomain: true,
      url: 'https://hypothes.is/account/developer',
      method: 'GET'
    }

    DOM.scrapElement(callSettings, '#token', (error, resultNodes) => {
      if (error) {
        callback(error)
      } else {
        if (!resultNodes[0]) {
          $.post('https://hypothes.is/account/developer', () => {
            DOM.scrapElement(callSettings, '#token', (error, resultNodes) => {
              if (error) {
                callback(error)
              } else {
                const hypothesisToken = resultNodes[0].value
                callback(null, hypothesisToken)
              }
            })
          })
        } else {
          const hypothesisToken = resultNodes[0].value
          callback(null, hypothesisToken)
        }
      }
    })
  }

  setToken (err, token) {
    if (err) {
      console.error('The token is unreachable')
      if (this.tries >= maxTries) { // The token is unreachable after some tries, probably the user is logged out
        this.token = null // Probably the website is down or the user has been logged out
        console.error('The token is deleted after unsuccessful %s tries', maxTries)
      } else {
        this.tries += 1 // The token is unreachable, add a done try
        console.debug('The token is unreachable for %s time(s), but is maintained %s', this.tries, this.token)
      }
    } else {
      console.debug('User is logged in Hypothesis. His token is %s', token)
      this.token = token
      this.tries = 0
    }
  }

  initShowHypothesisLoginForm () {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'hypothesis') {
        if (request.cmd === 'userLoginForm') {
          // Create new tab on google chrome
          chrome.tabs.create({ url: 'https://hypothes.is/login' }, (tab) => {
            // Retrieve hypothesis token periodically
            const interval = setInterval(() => {
              this.retrieveHypothesisToken((err, token) => {
                if (err) {
                  console.log('Checking again in %s seconds', checkHypothesisLoggedInWhenPromptInSeconds)
                } else {
                  // Once logged in, take the token and close the tab
                  this.token = token
                  chrome.tabs.remove(tab.id, () => {
                    clearInterval(interval)
                    sendResponse({ token: this.token })
                  })
                }
              })
            }, checkHypothesisLoggedInWhenPromptInSeconds * 1000)
            // Set event for when user close the tab
            const closeTabListener = (closedTabId) => {
              if (closedTabId === tab.id && !this.token) {
                // Remove listener for hypothesis token
                clearInterval(interval)
                // Hypothes.is login tab is closed
                sendResponse({ error: 'Hypothesis tab closed intentionally' })
              }
              chrome.tabs.onRemoved.removeListener(closeTabListener)
            }
            chrome.tabs.onRemoved.addListener(closeTabListener)
          })
        }
      }
      return true
    })
  }

  initResponserForGetToken () {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'hypothesis') {
        if (request.cmd === 'getToken') {
          sendResponse(this.token)
        } else if (request.cmd === 'startListeningLogin') {
          this.changeTokenRetrieveInterval(checkHypothesisLoggedInWhenPromptInSeconds) // Reduce to 0.5 seconds
        } else if (request.cmd === 'stopListeningLogin') {
          this.changeTokenRetrieveInterval(checkHypothesisLoggedIntervalInSeconds) // Token retrieve to 20 seconds
        }
      }
    })
  }

  initHypothesisClientManager () {
    this.annotationServerManager = new HypothesisClientManager()
    this.annotationServerManager.init((err) => {
      console.error('Unable to initialize hypothesis client manager. Error: ' + err.message)
    })
  }

  initHypothesisBackgroundManager () {
    this.hypothesisBackgroundManager = new HypothesisBackgroundManager()
    this.hypothesisBackgroundManager.init()
  }
}

export default HypothesisManager
HypothesisManager.js// PVSCL:IFCOND(Hypothesis, LINE)
import Hypothesis from '../../annotationServer/hypothesis/Hypothesis'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
    annotationAnnotationServer = new Hypothesis({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
import HypothesisClientManager from '../../../../annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    window.googleSheetProvider.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
import HypothesisClientManager from '../../../../annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.AnnotationServerClientManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    const HypothesisClientManager = require('../annotationServer/hypothesis/HypothesisClientManager').default
    window.abwa.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
      if (annotationServer === 'hypothesis') {
        // Hypothesis
        const HypothesisClientManager = require('../annotationServer/hypothesis/HypothesisClientManager').default
        window.abwa.annotationServerManager = new HypothesisClientManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
import HypothesisClientManager from '../annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
                  // Modify group URL in Hypothes.is as it adds the name at the end of the URL
                  if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                    group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
                            // Modify group URL in hypothesis
                            if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                              if (_.has(group, 'links.html')) {
                                group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
                              }
                            }
                            // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
        // Display login/sign up form
        $('#notLoggedInGroupContainer').attr('aria-hidden', 'false')
        // Hide group container
        $('#loggedInGroupContainer').attr('aria-hidden', 'true')
        // Hide purposes wrapper
        $('#purposesWrapper').attr('aria-hidden', 'true')
        // Start listening to when is logged in continuously
        chrome.runtime.sendMessage({ scope: 'hypothesis', cmd: 'startListeningLogin' })
        // Open the sidebar to notify user that needs to log in
        window.abwa.sidebar.openSidebar()
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
        // Remove public group in hypothes.is and modify group URL
        if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
          _.remove(this.groups, (group) => {
            return group.id === '__world__'
          })
          _.forEach(this.groups, (group) => {
            if (_.has(group, 'links.html')) {
              group.links.html = group.links.html.substr(0, group.links.html.lastIndexOf('/'))
            }
          })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
import HypothesisClientManager from '../../annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
                  // Remove public group in hypothes.is and modify group URL
                  if (LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, HypothesisClientManager)) {
                    if (_.has(newGroup, 'links.html')) {
                      newGroup.links.html = newGroup.links.html.substr(0, newGroup.links.html.lastIndexOf('/'))
                    }
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
import HypothesisManager from './background/HypothesisManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.hypothesisManager = null
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    // Initialize hypothesis manager
    this.hypothesisManager = new HypothesisManager()
    this.hypothesisManager.init()

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
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    this.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis,LINE)
import HypothesisClientManager from './annotationServer/hypothesis/HypothesisClientManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hypothesis, LINE)
    window.scienceDirect.annotationServerManager = new HypothesisClientManager()
    // PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis and AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1),
    {
      "matches": [
        "https://hypothes.is/groups/*/*"
      ],
      "js": [
        "scripts/hypothesisGroupContentScript.js"
      ],
      "run_at": "document_end"
    }PVSCL:ENDCOND