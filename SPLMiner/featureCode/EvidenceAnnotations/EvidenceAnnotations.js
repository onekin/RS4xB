// PVSCL:IFCOND(EvidenceAnnotations, LINE)
            if (deserializedAnnotation.body) {
              let bodyWithClassifyingPurpose = deserializedAnnotation.getBodyForPurpose('classifying')
              if (bodyWithClassifyingPurpose) {
                LanguageUtils.dispatchCustomEvent(Events.evidenceAnnotationAdded, { annotation: deserializedAnnotation })
              }
            }
            // PVSCL:ENDCOND/* PVSCL:IFCOND(EvidenceAnnotations) */,
        addToCXL: true /* PVSCL:ENDCOND */// PVSCL:IFCOND(EvidenceAnnotations,LINE)
    this.initEvidenceAnnotationAddedEvent()
    this.initEvidenceAnnotationRemovedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations,LINE)
  initEvidenceAnnotationRemovedEvent () {
    this.events.evidenceAnnotationRemovedEvent = { element: document, event: Events.evidenceAnnotationRemoved, handler: this.evidenceAnnotationRemovedEventHandler() }
    this.events.evidenceAnnotationRemovedEvent.element.addEventListener(this.events.evidenceAnnotationRemovedEvent.event, this.events.evidenceAnnotationRemovedEvent.handler, false)
  }

  initEvidenceAnnotationAddedEvent () {
    this.events.evidenceAnnotationAddedEvent = { element: document, event: Events.evidenceAnnotationAdded, handler: this.evidenceAnnotationAddedEventHandler() }
    this.events.evidenceAnnotationAddedEvent.element.addEventListener(this.events.evidenceAnnotationAddedEvent.event, this.events.evidenceAnnotationAddedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations,LINE)

  evidenceAnnotationAddedEventHandler () {
    return (event) => {
      let annotation = event.detail.annotation
      let foundConcept = _.filter(this.concepts, (concept) => {
        return concept.theme.id === annotation.body[0].value.id
      })
      foundConcept[0].evidenceAnnotations.push(annotation)
    }
  }

  evidenceAnnotationRemovedEventHandler () {
    return (event) => {
      let annotation = event.detail.annotation
      let foundConcept = _.filter(this.concepts, (concept) => {
        return concept.theme.id === annotation.body[0].value.id
      })
      foundConcept[0].evidenceAnnotations = _.filter(foundConcept.evidenceAnnotations, (evidenceAnnotation) => {
        return evidenceAnnotation.id !== annotation.id
      })
    }
  }
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
        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
                  // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ELSECOND
                  if (key === 'export') {
                    CXLExporter.exportCXLFile('cmapCloud', data.userData)
                  }
                  // PVSCL:ENDCOND/* PVSCL:IFCOND(EvidenceAnnotations) */,  evidenceAnnotations/* PVSCL:ENDCOND *//* PVSCL:IFCOND(EvidenceAnnotations) */,  userData/* PVSCL:ENDCOND */// PVSCL:IFCOND(EvidenceAnnotations, LINE)
    let urlFiles = []
    // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations and CXLExportCmapCloud, LINE)
    // resource-group-list
    let resourceGroupList = xmlDoc.createElement('resource-group-list')
    map.appendChild(resourceGroupList)
    // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
    let zip = new JSZip()
    zip.file(window.abwa.groupSelector.currentGroup.name.replace(' ', '') + '.cxl', blob)
    for (let i = 0; i < urlFiles.length; i++) {
      let urlFile = urlFiles[i]
      zip.file(urlFile.name + '.url', urlFile.content)
    }
    // zip.file('Hello.txt', 'Hello World\n')
    zip.generateAsync({ type: 'blob' }).then(function (zipFile) {
      // see FileSaver.js
      FileSaver.saveAs(zipFile, LanguageUtils.camelize(window.abwa.groupSelector.currentGroup.name) + '.zip')
    })
    // PVSCL:ELSECOND
    FileSaver.saveAs(blob, LanguageUtils.camelize(window.abwa.groupSelector.currentGroup.name) + '.cxl')
    // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations,LINE)
  evidenceAnnotationAdded: 'evidenceAnnotationAdded',
  evidenceAnnotationRemoved: 'evidenceAnnotationRemoved',
  // PVSCL:ENDCOND