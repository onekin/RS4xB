// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
            if (key === 'exportWithToolURL') {
              CXLExporter.exportCXLFile('archiveFile', 'tool')
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND