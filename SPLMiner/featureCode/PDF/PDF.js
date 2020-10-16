// PVSCL:IFCOND(PDF, LINE)
import PDF from './formats/PDF'
// PVSCL:ENDCOND// PVSCL:IFCOND(PDF, LINE)
    if (this.documentFormat === PDF) {
      // Reload to original pdf website
      window.location.href = window.PDFViewerApplication.baseUrl
    }
    // PVSCL:ENDCOND/* PVSCL:IFCOND(PDF) */if (this.documentFormat === PDF) {
      return document.querySelector('#viewer')
    } /* PVSCL:ELSEIFCOND(HTML) */ else if (this.documentFormat === HTML) {
      return document.body
    } /* PVSCL:ELSEIFCOND(TXT) */ else if (this.documentFormat === TXT) {
      return document.body
    } /* PVSCL:ELSECOND */ else {
      Alerts.errorAlert({ text: 'The format of the document to be annotated is not supported by the tool yet.' })
    } /* PVSCL:ENDCOND */