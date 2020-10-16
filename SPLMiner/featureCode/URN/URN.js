// PVSCL:IFCOND(URN, LINE)
import CryptoUtils from '../utils/CryptoUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(URN, LINE)
    this.localFile = false
    // PVSCL:ENDCOND// PVSCL:IFCOND(URN, LINE)

  tryToLoadPlainTextFingerprint () {
    const fileTextContentElement = document.querySelector('body > pre')
    if (fileTextContentElement) {
      const fileTextContent = fileTextContentElement.innerText
      return CryptoUtils.hash(fileTextContent.innerText)
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(URN, LINE)
      // Check if current tab is a local file
      if (tab.url.startsWith('file://')) {
        // Check if permission to access file URL is enabled
        chrome.extension.isAllowedFileSchemeAccess((isAllowedAccess) => {
          if (isAllowedAccess === false) {
            chrome.tabs.create({ url: chrome.runtime.getURL('pages/filePermission.html') })
          } else {
            if (this.tabs[tab.id]) {
              if (this.tabs[tab.id].activated) {
                this.tabs[tab.id].deactivate()
              } else {
                this.tabs[tab.id].activate()
              }
            } else {
              this.tabs[tab.id] = new Popup()
              this.tabs[tab.id].activate()
            }
          }
        })
      } else {
        if (this.tabs[tab.id]) {
          if (this.tabs[tab.id].activated) {
            this.tabs[tab.id].deactivate()
          } else {
            this.tabs[tab.id].activate()
          }
        } else {
          this.tabs[tab.id] = new Popup()
          this.tabs[tab.id].activate()
        }
      }
      // PVSCL:ELSECOND
      if (this.tabs[tab.id]) {
        if (this.tabs[tab.id].activated) {
          this.tabs[tab.id].deactivate()
        } else {
          this.tabs[tab.id].activate()
        }
      } else {
        this.tabs[tab.id] = new Popup()
        this.tabs[tab.id].activate()
      }
      // PVSCL:ENDCONDPVSCL:IFCOND(URN),  "file:///*/*"PVSCL:ENDCONDPVSCL:IFCOND(URN),
    "downloads",
    "notifications",
    "file://*/*"PVSCL:ENDCOND