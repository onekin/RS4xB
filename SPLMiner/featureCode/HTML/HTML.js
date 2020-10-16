// PVSCL:IFCOND(HTML, LINE)
import HTML from './formats/HTML'
// PVSCL:ENDCOND// PVSCL:IFCOND(HTML, LINE)
    this.documentFormat = HTML // By default document type is html
    // PVSCL:ELSEIFCOND(PDF, LINE)
    this.documentFormat = PDF // By default document type is pdf
    // PVSCL:ELSEIFCOND(TXT, LINE)
    // this.documentFormat = TXT // By default document type is txt
    // PVSCL:ENDCOND// PVSCL:IFCOND(HTML, LINE)
        this.documentFormat = HTML
        // PVSCL:ELSEIFCOND(TXT, LINE)
        this.documentFormat = TXT
        // PVSCL:ENDCOND