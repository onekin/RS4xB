/* PVSCL:IFCOND(DOI) */  this.target[0].source.doi || /* PVSCL:ENDCOND */// PVSCL:IFCOND(DOI, LINE)
    this.doiUrlFilterObject = { urls: ['*://*.doi.org/*', '*://doi.org/*'] }
    // PVSCL:ENDCOND// PVSCL:IFCOND(DOI, LINE)
    // Requests to doi.org
    chrome.webRequest.onHeadersReceived.addListener((responseDetails) => {
      console.debug(responseDetails)
      const locationIndex = _.findIndex(responseDetails.responseHeaders, (header) => header.name === 'location')
      const locationUrl = responseDetails.responseHeaders[locationIndex].value
      try {
        const redirectUrl = new URL(locationUrl)
        // Retrieve doi from call
        let doi = ''
        if (_.isArray(DOI.groups(responseDetails.url))) {
          doi = DOI.groups(responseDetails.url)[1]
        }
        const annotationId = this.extractAnnotationId(responseDetails.url)
        if (doi) {
          if (_.isEmpty(redirectUrl.hash)) {
            redirectUrl.hash += '#doi:' + doi
          } else {
            redirectUrl.hash += '&doi:' + doi
          }
        }
        if (annotationId) {
          if (_.isEmpty(redirectUrl.hash)) {
            redirectUrl.hash += '#' + Config.urlParamName + ':' + annotationId
          } else {
            redirectUrl.hash += '&' + Config.urlParamName + ':' + annotationId
          }
        }
        responseDetails.responseHeaders[locationIndex].value = redirectUrl.toString()
        this.tabs[responseDetails.tabId] = { doi: doi, annotationId: annotationId }
        return { responseHeaders: responseDetails.responseHeaders }
      } catch (e) {
        return { responseHeaders: responseDetails.responseHeaders }
      }
    }, this.doiUrlFilterObject, ['responseHeaders', 'blocking'])
    // PVSCL:ENDCONDimport DOI from 'doi-regex'
// PVSCL:IFCOND(ScienceDirect, LINE)

import Config from '../Config'
import _ from 'lodash'

class TargetManager {
  constructor () {
    // PVSCL:IFCOND(DOI, LINE)

    // PVSCL:IFCOND(ScienceDirect, LINE)

    // PVSCL:IFCOND(Dropbox, LINE)

  }

  init () {
    // PVSCL:IFCOND(DOI, LINE)

    // PVSCL:IFCOND(ScienceDirect, LINE)

    // PVSCL:IFCOND(Dropbox, LINE)

  }

  extractAnnotationId (url) {
    if (url.includes('#')) {
      const parts = url.split('#')[1].split(':')
      if (parts[0] === Config.urlParamName) {
        return parts[1] || null
      }
    } else {
      return null
    }
  }
}

export default TargetManager
TargetManager.js// PVSCL:IFCOND(DOI, LINE)
    // Try to load doi from the document, page metadata or URL hash param
    this.tryToLoadDoi()
    // PVSCL:ENDCOND// PVSCL:IFCOND(DOI, LINE)

  tryToLoadDoi () {
    // Try to load doi from hash param
    const decodedUri = decodeURIComponent(window.location.href)
    const params = URLUtils.extractHashParamsFromUrl(decodedUri)
    if (!_.isEmpty(params) && !_.isEmpty(params.doi)) {
      this.doi = decodeURIComponent(params.doi)
    }
    // Try to load doi from page metadata
    if (_.isEmpty(this.doi)) {
      try {
        this.doi = document.querySelector('meta[name="citation_doi"]').content
        if (!this.doi) {
          this.doi = document.querySelector('meta[name="dc.identifier"]').content
        }
      } catch (e) {
        console.debug('Doi not found for this document')
      }
    }
    // TODO Try to load doi from chrome tab storage
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(DOI or NavigationScript, LINE)
import TargetManager from './background/TargetManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(DOI or NavigationScript, LINE)
    // Initialize doi manager
    this.targetManager = new TargetManager()
    this.targetManager.init()

    // PVSCL:ENDCONDPVSCL:IFCOND(DOI),
    "*://doi.org/*",
    "*://dx.doi.org/*"PVSCL:ENDCOND