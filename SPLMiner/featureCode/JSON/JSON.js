// PVSCL:IFCOND(JSON OR ImportAnnotations, LINE)
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
        // PVSCL:ENDCOND// PVSCL:IFCOND(JSON, LINE)
        items.export = { name: 'Export annotations in JSON' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(JSON, LINE)
        items.export = { name: 'Export annotations in JSON' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(ImportAnnotations, LINE)
            if (key === 'import') {
              AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(JSON, LINE)
            if (key === 'export') {
              AnnotationExporter.exportCurrentDocumentAnnotations()
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
  // PVSCL:ENDCOND