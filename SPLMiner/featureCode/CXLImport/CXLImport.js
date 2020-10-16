// PVSCL:IFCOND(CXLImport, LINE)

  static fromCXLFile (conceptList, name) {
    let annotationGuide = new Codebook({ name: name })
    for (let i = 0; i < conceptList.childNodes.length; i++) {
      let concept = conceptList.childNodes[i]
      let conceptName = concept.getAttribute('label')
      let theme = new Theme({ name: conceptName, annotationGuide })
      annotationGuide.themes.push(theme)
    }
    return annotationGuide
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
import CXLImporter from '../importExport/cmap/CXLImporter'
// PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportArchiveFile OR CXLImport, LINE)
      const cxlArchiveFileImageUrl = chrome.extension.getURL('/images/cxl.png')
      this.cxlArchiveFileImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.cxlArchiveFileImage.src = cxlArchiveFileImageUrl
      this.cxlArchiveFileImage.id = 'cxlArchiveFileButton'
      this.cxlArchiveFileImage.title = 'Export resources to an archive file on the local file system'
      this.toolsetBody.appendChild(this.cxlArchiveFileImage)
      // Add menu when clicking on the button
      this.CXLArchiveFileButtonHandler()
      // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
        items.import = { name: 'Import CXL' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
            if (key === 'import') {
              CXLImporter.importCXLfile()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
            if (key === 'import') {
              // AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)

  static readCXLFile (file, callback) {
    FileUtils.readTextFile(file, (err, text) => {
      if (err) {
        callback(err)
      } else {
        let extension = (file.name.substring(file.name.lastIndexOf('.'))).toLowerCase()
        if (extension === '.cxl') {
          try {
            let parser = new DOMParser()
            let xmlDoc = parser.parseFromString(text, 'text/xml')
            callback(null, xmlDoc)
          } catch (err) {
            callback(err)
          }
        } else {
          callback(new Error('The file must have .cxl extension'))
        }
      }
    })
  }
// PVSCL:ENDCOND