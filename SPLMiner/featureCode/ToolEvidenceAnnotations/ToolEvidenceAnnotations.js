// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
            if (key === 'exportWithHypothesisURL') {
              CXLExporter.exportCXLFile('archiveFile', 'hypothesis')
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND