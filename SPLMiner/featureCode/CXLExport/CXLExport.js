// PVSCL:IFCOND(CXLExport, LINE)
import Linking from '../purposes/linking/Linking'
import Classifying from '../../annotationManagement/purposes/Classifying'
// PVSCL:ENDCOND// PVSCL:IFCOND(NOT(CXLExport), LINE)
      url: window.abwa.targetManager.getDocumentURIToSearchInAnnotationServer(),
      uri: window.abwa.targetManager.getDocumentURIToSaveInAnnotationServer(),
      // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
        // this.annotationObjects = annotationObjects.map(annotationObject => Annotation.deserialize(annotationObject))
        let currentResourceAnnotations = _.filter(annotationObjects, (annotationObject) => {
          return annotationObject.uri === window.abwa.targetManager.getDocumentURIToSaveInAnnotationServer()
        })
        this.allGroupAnnotations = annotationObjects.map(annotationObject => Annotation.deserialize(annotationObject))
        this.allAnnotations = currentResourceAnnotations.map(currentResourceAnnotation => Annotation.deserialize(currentResourceAnnotation))
        this.groupLinkingAnnotations = _.filter(this.allGroupAnnotations, (annotation) => {
          if (annotation.body.length > 0) {
            return LanguageUtils.isInstanceOf(annotation.body[0], Linking)
          }
        })
        this.groupClassifiyingAnnotations = _.filter(this.allGroupAnnotations, (annotation) => {
          if (annotation.body.length > 0) {
            return LanguageUtils.isInstanceOf(annotation.body[0], Classifying)
          }
        })
        // PVSCL:ELSECOND
        // Deserialize retrieved annotations
        this.allAnnotations = annotationObjects.map(annotationObject => Annotation.deserialize(annotationObject))
        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
import { MapContentManager } from './MapContentManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
      .then(() => {
        return this.reloadMapContentManager()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)

  reloadMapContentManager () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyMapContentManager()
      // Create a new content annotator for the current group
      window.abwa.mapContentManager = new MapContentManager()
      window.abwa.mapContentManager.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)

  destroyMapContentManager () {
    // Destroy current map content
    if (!_.isEmpty(window.abwa.mapContentManager)) {
      window.abwa.mapContentManager.destroy()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)

import LanguageUtils from '../utils/LanguageUtils'
import _ from 'lodash'
import Events from '../Events'
// PVSCL:IFCOND(Linking, LINE)


export class Concept {
  constructor (theme = null, evidenceAnnotations = []) {
    // code
    this.theme = theme
    this.evidenceAnnotations = evidenceAnnotations
  }
}
// PVSCL:IFCOND(Linking, LINE)


export class MapContentManager {
  constructor () {
    this.concepts = {}
    // PVSCL:IFCOND(Linking, LINE)

    this.events = {}
  }

  init (callback) {
    console.debug('Initializing MapContentManager')
    // Retrieve all the annotations for this assignment
    this.updateMapContent(() => {
      console.debug('Initialized MapContentManager')
      if (_.isFunction(callback)) {
        callback()
      }
    })
    // Init event handlers
    // PVSCL:IFCOND(CodebookUpdate,LINE)

    // PVSCL:IFCOND(Linking,LINE)

    // PVSCL:IFCOND(EvidenceAnnotations,LINE)

  }

  // EVENTS
  // PVSCL:IFCOND(CodebookUpdate,LINE)

  // PVSCL:IFCOND(Linking,LINE)


  // PVSCL:IFCOND(EvidenceAnnotations,LINE)


  destroy () {
    // Remove event listeners
    let events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  updateMapContent (callback) {
    // Retrieve all the annotations for this assignment
    this.createConcepts((err) => {
      if (err) {
        // TODO Unable to retrieve annotations for this assignment
      } else {
        console.debug('Updated annotations for assignment')
        // PVSCL:IFCOND(Linking, LINE)

      }
    })
  }
  // PVSCL:IFCOND(CodebookUpdate,LINE)


  createConcepts (callback) {
    let conceptsList = []
    let themes = window.abwa.codebookManager.codebookReader.codebook.themes
    if (themes) {
      for (let i = 0; i < themes.length; i++) {
        let theme = themes[i]
        let conceptEvidenceAnnotation = _.filter(window.abwa.annotationManagement.annotationReader.groupClassifiyingAnnotations, (annotation) => {
          return annotation.body[0].value.id === theme.id
        })
        let concept = new Concept(theme, conceptEvidenceAnnotation)
        conceptsList.push(concept)
      }
    }
    this.concepts = conceptsList
    if (_.isFunction(callback)) {
      callback(null)
    }
  }
  // PVSCL:IFCOND(Linking, LINE)

  // PVSCL:IFCOND(EvidenceAnnotations,LINE)

}


MapContentManager.js// PVSCL:IFCOND(CXLExport, LINE)
import { CXLExporter } from '../importExport/cmap/CXLExporter'
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
        // PVSCL:ENDCOND        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
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
            // PVSCL:ENDCOND            // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
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
        // PVSCL:ENDCOND        // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
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
                  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
            chrome.runtime.sendMessage({ scope: 'cmapCloud', cmd: 'getUserData' }, (response) => {
              if (response.data) {
                let data = response.data
                if (data.userData.user && data.userData.password && data.userData.uid) {
                  // PVSCL:IFCOND(EvidenceAnnotations, LINE)
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
                  // PVSCL:ENDCOND                  // PVSCL:ENDCOND