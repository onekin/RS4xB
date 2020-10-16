// PVSCL:IFCOND(ImportAnnotations, LINE)
    this.initAnnotationsImportedEventListener()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)

  initAnnotationsImportedEventListener (callback) {
    this.events.annotationsImportedEvent = { element: document, event: Events.annotationsImported, handler: this.createAnnotationsImportedEventHandler() }
    this.events.annotationsImportedEvent.element.addEventListener(this.events.annotationsImportedEvent.event, this.events.annotationsImportedEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createAnnotationsImportedEventHandler () {
    return (e) => {
      // Reload annotations

    }
  }

  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
      theme.codes = []
      if (_.isArray(themeDefinition.codes)) {
        for (let j = 0; j < themeDefinition.codes.length; j++) {
          const codeDefinition = themeDefinition.codes[j]
          const code = new Code({ name: codeDefinition.name, description: codeDefinition.description, theme: theme })
          theme.codes.push(code)
        }
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn or ImportCodebook or NOT(Codebook) or ImportAnnotations, LINE)

  static fromObjects (userDefinedHighlighterDefinition) {
    const annotationGuide = new Codebook({ name: userDefinedHighlighterDefinition.name })
    for (let i = 0; i < userDefinedHighlighterDefinition.definition.length; i++) {
      const themeDefinition = userDefinedHighlighterDefinition.definition[i]
      const theme = new Theme({ name: themeDefinition.name, description: themeDefinition.description, annotationGuide })
      // PVSCL:IFCOND(Hierarchy,LINE)
      theme.codes = []
      if (_.isArray(themeDefinition.codes)) {
        for (let j = 0; j < themeDefinition.codes.length; j++) {
          const codeDefinition = themeDefinition.codes[j]
          const code = new Code({ name: codeDefinition.name, description: codeDefinition.description, theme: theme })
          theme.codes.push(code)
        }
      }
      // PVSCL:ENDCOND      annotationGuide.themes.push(theme)
    }
    return annotationGuide
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
import AnnotationImporter from '../importExport/AnnotationImporter'
// PVSCL:ENDCOND// PVSCL:IFCOND(JSON OR ImportAnnotations, LINE)
      const exportImportImageUrl = chrome.extension.getURL('/images/importExport.png')
      this.exportImportImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.exportImportImage.src = exportImportImageUrl
      this.exportImportImage.id = 'importExportButton'
      this.exportImportImage.title = 'Export or import annotations' // TODO i18n
      this.toolsetBody.appendChild(this.exportImportImage)
      // Add menu when clicking on the button
      this.importExportButtonHandler()
      // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
        items.import = { name: 'Import annotations' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
        items.import = { name: 'Import annotations' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(JSON, LINE)
        items.export = { name: 'Export annotations in JSON' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
            if (key === 'import') {
              AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
            if (key === 'import') {
              AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(JSON, LINE)
            if (key === 'export') {
              AnnotationExporter.exportCurrentDocumentAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations or JSON, LINE)
  importExportButtonHandler () {
    // Create context menu for import export
    $.contextMenu({
      selector: '#importExportButton',
      trigger: 'left',
      build: () => {
        // Create items for context menu
        const items = {}
        // PVSCL:IFCOND(ImportAnnotations, LINE)
            if (key === 'import') {
              AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(JSON, LINE)
            if (key === 'export') {
              AnnotationExporter.exportCurrentDocumentAnnotations()
            }
            // PVSCL:ENDCOND          },
          items: items
        }
      }
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
  annotationsImported: 'annotationsImported',
  // PVSCL:ENDCOND