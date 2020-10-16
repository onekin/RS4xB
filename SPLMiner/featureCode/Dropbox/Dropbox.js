// PVSCL:IFCOND(Dropbox, LINE)
    this.dropbox = { urls: ['*://www.dropbox.com/s/*?raw=1*'] }
    this.dropboxContent = { urls: ['*://*.dropboxusercontent.com/*'] }
    this.tabs = {}
    // PVSCL:ENDCOND// PVSCL:IFCOND(Dropbox, LINE)
    // Request to dropbox
    chrome.webRequest.onHeadersReceived.addListener((responseDetails) => {
      this.tabs[responseDetails.tabId] = {
        url: responseDetails.url.split('#')[0],
        annotationId: this.extractAnnotationId(responseDetails.url)
      }
    }, this.dropbox, ['responseHeaders', 'blocking'])
    // Request dropbox pdf files
    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
      const index = _.findIndex(details.requestHeaders, (header) => { return header.name.toLowerCase() === 'accept' })
      details.requestHeaders[index].value = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      return { requestHeaders: details.requestHeaders }
    }, this.dropboxContent, ['blocking', 'requestHeaders'])

    chrome.webRequest.onCompleted.addListener((details) => {
      if (this.tabs[details.tabId]) {
        chrome.tabs.sendMessage(details.tabId, this.tabs[details.tabId])
      }
    }, this.dropboxContent)
    // PVSCL:ENDCOND// PVSCL:IFCOND(Dropbox, LINE)
    this.tryToLoadURLParam()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Dropbox, LINE)
    if (window.location.href.includes('dl.dropboxusercontent.com') && !window.location.href.includes('chrome-extension')) {
      chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {
        let location = window.location.href + 'url::' + request.url
        if (request.annotationId) {
          const Config = require('./Config').default
          location += '&' + Config.urlParamName + ':' + request.annotationId
        }
        window.location.href = location
        resolve()
      })
    } else {
      resolve()
    }
    // PVSCL:ELSECOND
    resolve()
    // PVSCL:ENDCONDPVSCL:IFCOND(Dropbox),
    "*://www.dropbox.com/s/",
    "*://*.dropboxusercontent.com/*"PVSCL:ENDCOND