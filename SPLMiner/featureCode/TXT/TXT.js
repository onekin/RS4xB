(() => {
  let fileToLoad = (new URL(document.location)).searchParams.get('file')

  function reqListener () {
    document.querySelector('pre').innerText = this.responseText
  }

  let oReq = new XMLHttpRequest()
  oReq.addEventListener('load', reqListener)
  oReq.open('GET', fileToLoad)
  oReq.send()
})()
index.js// PVSCL:IFCOND(TXT, LINE)
import TXT from './formats/TXT'
// PVSCL:ENDCOND/* PVSCL:IFCOND(TXT) */else if (document.body && document.body.children.length === 1 && document.body.children[0].nodeName === 'PRE') { // TODO Check if document is loaded in content/plainTextFileViewer
        // TODO Check if document.body is loaded or not yet
        this.documentFormat = TXT
        resolve()
      } /* PVSCL:ENDCOND */