// PVSCL:IFCOND(ScienceDirect, LINE)
import URLUtils from '../utils/URLUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(ScienceDirect, LINE)
    this.scienceDirect = { urls: ['*://www.sciencedirect.com/science/article/pii/*'] }
    // PVSCL:ENDCOND// PVSCL:IFCOND(ScienceDirect, LINE)
    // Requests to sciencedirect, redirection from linkinghub.elsevier.com (parse doi and annotation hash param if present)
    chrome.webRequest.onBeforeSendHeaders.addListener((requestHeaders) => {
      const referer = _.find(requestHeaders.requestHeaders, (requestHeader) => { return requestHeader.name === 'Referer' })
      if (referer && referer.value.includes('linkinghub.elsevier.com')) {
        chrome.tabs.get(requestHeaders.tabId, (tab) => {
          let doi = null
          let annotationId = null
          const url = tab.url
          // Retrieve doi
          const doiGroups = DOI.groups(url)
          if (doiGroups && doiGroups[1]) {
            doi = doiGroups[1]
            doi = doi.split('&' + Config.urlParamName)[0] // If doi-regex inserts also the annotation hash parameter, remove it, is not part of the doi
          }
          const params = URLUtils.extractHashParamsFromUrl(url)
          if (params && params[Config.urlParamName]) {
            annotationId = params[Config.urlParamName]
          }
          console.debug(requestHeaders)
          if (doi && annotationId) {
            const redirectUrl = requestHeaders.url + '#doi:' + doi + '&' + Config.urlParamName + ':' + annotationId
            chrome.tabs.update(requestHeaders.tabId, { url: redirectUrl })
          } else if (doi) {
            const redirectUrl = requestHeaders.url + '#doi:' + doi
            chrome.tabs.update(requestHeaders.tabId, { url: redirectUrl })
          } else if (annotationId) {
            const redirectUrl = requestHeaders.url + '#' + Config.urlParamName + ':' + annotationId
            chrome.tabs.update(requestHeaders.tabId, { url: redirectUrl })
          }
        })
      }
    }, this.scienceDirect, ['requestHeaders', 'blocking', 'extraHeaders'])
    // PVSCL:ENDCONDimport TextUtils from './utils/URLUtils'
import Config from './Config'
// PVSCL:IFCOND(Hypothesis,LINE)

// PVSCL:IFCOND(BrowserStorage,LINE)

import _ from 'lodash'

class ScienceDirectContentScript {
  init () {
    // Get if this tab has an annotation to open and a doi
    const params = TextUtils.extractHashParamsFromUrl(window.location.href)
    if (!_.isEmpty(params) && !_.isEmpty(params[Config.namespace])) {
      // Activate the extension
      chrome.runtime.sendMessage({ scope: 'extension', cmd: 'activatePopup' }, (result) => {
        // Retrieve if annotation is done in current url or in pdf version
        this.loadAnnotationServer(() => {
          window.scienceDirect.annotationServerManager.client.fetchAnnotation(params[Config.namespace], (err, annotation) => {
            if (err) {
              console.error(err)
            } else {
              // TODO Check if annotation is from this page
            }
          })
        })
      })
    }
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }
}

window.scienceDirect = {}
window.scienceDirect.scienceDirectContentScript = new ScienceDirectContentScript()
window.scienceDirect.scienceDirectContentScript.init()
scienceDirectContentScript.jsPVSCL:IFCOND(ScienceDirect),
    {
      "matches": ["*://www.sciencedirect.com/science/article/pii/*"],
      "js": ["scripts/scienceDirectContentScript.js"],
      "run_at": "document_end"
    }PVSCL:ENDCONDPVSCL:IFCOND(ScienceDirect),
    "*://www.sciencedirect.com/science/article/pii/*"PVSCL:ENDCOND