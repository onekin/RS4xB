// PVSCL:IFCOND(CXLExportArchiveFile OR CXLImport, LINE)
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
        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
        // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND        // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND        // PVSCL:ELSECOND
        items.export = { name: 'Export CXL' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
        // PVSCL:IFCOND(EvidenceAnnotations, LINE)
        // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND        // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND        // PVSCL:ELSECOND
        items.export = { name: 'Export CXL' }
        // PVSCL:ENDCOND        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
            if (key === 'import') {
              CXLImporter.importCXLfile()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
            if (key === 'exportWithHypothesisURL') {
              CXLExporter.exportCXLFile('archiveFile', 'hypothesis')
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
            if (key === 'exportWithToolURL') {
              CXLExporter.exportCXLFile('archiveFile', 'tool')
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
            // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
            if (key === 'exportWithHypothesisURL') {
              CXLExporter.exportCXLFile('archiveFile', 'hypothesis')
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
            if (key === 'exportWithToolURL') {
              CXLExporter.exportCXLFile('archiveFile', 'tool')
            }
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            if (key === 'export') {
              CXLExporter.exportCXLFile('archiveFile')
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
            // PVSCL:IFCOND(EvidenceAnnotations, LINE)
            // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
            if (key === 'exportWithHypothesisURL') {
              CXLExporter.exportCXLFile('archiveFile', 'hypothesis')
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
            if (key === 'exportWithToolURL') {
              CXLExporter.exportCXLFile('archiveFile', 'tool')
            }
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            if (key === 'export') {
              CXLExporter.exportCXLFile('archiveFile')
            }
            // PVSCL:ENDCOND            // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportArchiveFile, LINE)

  CXLArchiveFileButtonHandler () {
    // Create context menu for import export
    $.contextMenu({
      selector: '#cxlArchiveFileButton',
      trigger: 'left',
      build: () => {
        // Create items for context menu
        let items = {}
        // PVSCL:IFCOND(CXLImport, LINE)
            if (key === 'import') {
              CXLImporter.importCXLfile()
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(CXLExport, LINE)
            // PVSCL:IFCOND(EvidenceAnnotations, LINE)
            // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
            if (key === 'exportWithHypothesisURL') {
              CXLExporter.exportCXLFile('archiveFile', 'hypothesis')
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
            if (key === 'exportWithToolURL') {
              CXLExporter.exportCXLFile('archiveFile', 'tool')
            }
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            if (key === 'export') {
              CXLExporter.exportCXLFile('archiveFile')
            }
            // PVSCL:ENDCOND            // PVSCL:ENDCOND          },
          items: items
        }
      }
    })
  }
  // PVSCL:ENDCOND