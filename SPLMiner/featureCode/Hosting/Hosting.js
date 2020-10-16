import DOI from 'doi-regex'
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
TargetManager.jsimport URLUtils from './utils/URLUtils'
import Config from './Config'
import _ from 'lodash'
import DOI from 'doi-regex'

class ACMContentScript {
  constructor () {
    this.doi = null
  }

  init () {
    // Get url params
    const params = URLUtils.extractHashParamsFromUrl(window.location.href)
    // Get document doi
    if (!_.isEmpty(params) && !_.isEmpty(params.doi)) {
      this.doi = params.doi
    } else {
      // Scrap the doi from web
      this.doi = this.findDoi()
    }
    // Get pdf link element
    const pdfLinkElement = this.getPdfLinkElement()
    if (pdfLinkElement) {
      // Get if this tab has an annotation to open
      if (!_.isEmpty(params) && !_.isEmpty(params[Config.urlParamName])) {
        // Activate the extension
        chrome.runtime.sendMessage({ scope: 'extension', cmd: 'activatePopup' }, (result) => {
          console.log('Activated popup')
          // Retrieve pdf url
          let pdfUrl = pdfLinkElement.href
          // Create hash with required params to open extension
          let hash = '#' + Config.urlParamName + ':' + params[Config.urlParamName]
          if (this.doi) {
            hash += '&doi:' + this.doi
          }
          // Append hash to pdf url
          pdfUrl += hash
          // Redirect browser to pdf
          window.location.replace(pdfUrl)
        })
      } else {
        // Append doi to PDF url
        if (pdfLinkElement) {
          pdfLinkElement.href += '#doi:' + this.doi
        }
      }
    }
  }

  /**
   * Depending on the article, the ACM-DL shows the DOI in different parts of the document. This function tries to find in the DOM the DOI for the current paper
   * @returns {*}
   */
  findDoi () {
    let doiElement = document.querySelector('#divmain > table:nth-child(4) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > span:nth-child(10) > a')
    if (this.checkIfDoiElement(doiElement)) {
      return doiElement.innerText
    }
    doiElement = document.querySelector('#divmain > table > tbody > tr > td:nth-child(1) > table:nth-child(3) > tbody > tr > td > table > tbody > tr:nth-child(5) > td > span:nth-child(10) > a')
    if (this.checkIfDoiElement(doiElement)) {
      return doiElement.innerText
    }
    doiElement = document.querySelector('#divmain > table > tbody > tr > td:nth-child(1) > table:nth-child(3) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > span:nth-child(10) > a')
    if (this.checkIfDoiElement(doiElement)) {
      return doiElement.innerText
    }
    return null
  }

  checkIfDoiElement (doiElement) {
    return _.isElement(doiElement) &&
      _.isString(doiElement.innerText) &&
      _.isArray(DOI.groups(doiElement.innerText)) &&
      _.isString(DOI.groups(doiElement.innerText)[1])
  }

  getPdfLinkElement () {
    return document.querySelector('#divmain > table:nth-child(2) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(2) > a')
  }
}

window.acm = {}
window.acm.acmContentScript = new ACMContentScript()
window.acm.acmContentScript.init()
acmContentScript.jsimport TextUtils from './utils/URLUtils'
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
scienceDirectContentScript.jsimport URLUtils from './utils/URLUtils'
import _ from 'lodash'
import DOI from 'doi-regex'
import Config from './Config'

class SpringerContentScript {
  constructor () {
    this.doi = null
  }

  init () {
    // Get document doi from metadata or dom
    // Get url params
    const params = URLUtils.extractHashParamsFromUrl(window.location.href)
    // Get document doi
    if (!_.isEmpty(params) && !_.isEmpty(params.doi)) {
      this.doi = params.doi
    } else {
      // Scrap the doi from web
      this.doi = this.findDoi()
    }
    // Get pdf link element
    const pdfLinkElements = this.getPdfLinkElement()
    if (pdfLinkElements.length > 0) {
      // Get if this tab has an annotation to open
      if (!_.isEmpty(params) && !_.isEmpty(params[Config.urlParamName])) {
        // Activate the extension
        chrome.runtime.sendMessage({ scope: 'extension', cmd: 'activatePopup' }, (result) => {
          console.log('Activated popup')
          // Retrieve pdf url
          let pdfUrl = pdfLinkElements[0].href
          // Create hash with required params to open extension
          let hash = '#' + Config.urlParamName + ':' + params[Config.urlParamName]
          if (this.doi) {
            hash += '&doi:' + this.doi
          }
          // Append hash to pdf url
          pdfUrl += hash
          // Redirect browser to pdf
          window.location.replace(pdfUrl)
        })
      } else {
        // Append doi to PDF url
        const doi = this.doi
        pdfLinkElements.forEach(function (pdfLinkElement) {
          pdfLinkElement.href += '#doi:' + doi
        })
      }
    }
  }

  /**
   * Depending on the article, the ACM-DL shows the DOI in different parts of the document. This function tries to find in the DOM the DOI for the current paper
   * @returns {*}
   */
  findDoi () {
    const doiElem = document.querySelector('head > meta[name="citation_doi"]')
    if (_.isElement(doiElem)) {
      if (!this.checkIfDoiElement(doiElem.content)) {
        return doiElem.content
      }
    }

    const doiText = document.querySelector('#doi-url')
    if (this.checkIfDoiElement(doiText)) {
      return doiText.innerText
    }
    return null
  }

  checkIfDoiElement (doiElement) {
    return _.isElement(doiElement) &&
      _.isString(doiElement.innerText) &&
      _.isArray(DOI.groups(doiElement.innerText)) &&
      _.isString(DOI.groups(doiElement.innerText)[1])
  }

  getPdfLinkElement () {
    // Paper download link
    const selectorsStrings = ['#main-content > div > div > div.cta-button-container.cta-button-container--top.cta-button-container--stacked.u-mb-16.u-hide-two-col > div > a',
      '#article-actions > div > div.download-article.test-pdf-link > div > a',
      '#cobranding-and-download-availability-text > div > a',
      '#main-content > article.main-wrapper.main-wrapper--no-gradient.main-wrapper--dual-main > div > div > div.cta-button-container.cta-button-container--inline.cta-button-container--stacked.u-pt-36.test-download-book-separate-buttons > div:nth-child(1) > a',
      '#main-content > article.main-wrapper.main-wrapper--no-gradient.main-wrapper--dual-main > div > div > div.cta-button-container.cta-button-container--stacked.u-pt-36 > div > div > a']
    const pdfLinks = selectorsStrings.reduce(function (result, selector) {
      const pdfLink = document.querySelector(selector)
      if (_.isElement(pdfLink)) {
        result.push(pdfLink)
      }
      return result
    }, [])
    return pdfLinks
  }
}

window.springer = {}
window.springer.springerContentScript = new SpringerContentScript()
window.springer.springerContentScript.init()
springerContentScript.js