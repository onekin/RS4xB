// PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
        <span pv:condition="ExportCodebook" class="groupSelectorItemOption exportGroup" title="Export codebook">Export</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
        <span pv:condition="ExportCodebook" class="groupSelectorItemOption exportGroup" title="Export codebook">Export</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
        <span pv:condition="CodebookDelete" class="groupSelectorItemOption deleteGroup" title="Delete codebook">Delete</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete, LINE)
      <span pv:condition="RenameCodebook or ExportCodebook or CodebookDelete" class="groupSelectorItemToggle"></span>
      <div pv:condition="RenameCodebook or ExportCodebook or CodebookDelete" class="groupSelectorItemOptionsContainer">
        // PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
        // PVSCL:ENDCOND        // PVSCL:IFCOND(ExportCodebook, LINE)
        <span pv:condition="ExportCodebook" class="groupSelectorItemOption exportGroup" title="Export codebook">Export</span>
        // PVSCL:ENDCOND        // PVSCL:IFCOND(CodebookDelete, LINE)
        <span pv:condition="CodebookDelete" class="groupSelectorItemOption deleteGroup" title="Delete codebook">Delete</span>
        // PVSCL:ENDCOND      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook or Export, LINE)

  toObjects (name) {
    const object = {
      name: name,
      definition: []
    }
    // For each criteria create the object
    for (let i = 0; i < this.themes.length; i++) {
      const theme = this.themes[i]
      if (LanguageUtils.isInstanceOf(theme, Theme)) {
        object.definition.push(theme.toObjects())
      }
    }
    return object
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    if (this.codes.length > 0) {
      object.codes = []
      // For each level
      for (let i = 0; i < this.codes.length; i++) {
        const code = this.codes[i]
        if (LanguageUtils.isInstanceOf(code, Code)) {
          object.codes.push(code.toObject())
        }
      }
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)

  toObjects () {
    const object = {
      name: this.name,
      description: this.description
    }
    // PVSCL:IFCOND(Hierarchy, LINE)
    if (this.codes.length > 0) {
      object.codes = []
      // For each level
      for (let i = 0; i < this.codes.length; i++) {
        const code = this.codes[i]
        if (LanguageUtils.isInstanceOf(code, Code)) {
          object.codes.push(code.toObject())
        }
      }
    }
    // PVSCL:ENDCOND    return object
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    // Instance codes
    for (let i = 0; i < theme.codes.length; i++) {
      instancedTheme.codes[i] = Code.createCodeFromObject(theme.codes[i], instancedTheme)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or ExportCodebook, LINE)
  static createThemeFromObject (theme, rubric) {
    theme.annotationGuide = rubric
    // Instance theme object
    const instancedTheme = Object.assign(new Theme(theme))
    // PVSCL:IFCOND(Hierarchy, LINE)
    // Instance codes
    for (let i = 0; i < theme.codes.length; i++) {
      instancedTheme.codes[i] = Code.createCodeFromObject(theme.codes[i], instancedTheme)
    }
    // PVSCL:ENDCOND    return instancedTheme
  }
  // PVSCL:ENDCONDimport Events from '../../../Events'
import _ from 'lodash'
import ExportCodebookJSON from './ExportCodebookJSON'

class ExportCodebook {
  constructor () {
    this.events = {}
  }

  init () {
    // Add event listener for export codebook event
    this.initExportCodebookEventHandler()
  }

  destroy () {
    // Remove event listeners
    const events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  // EVENTS
  initExportCodebookEventHandler () {
    this.events.exportCodebookEvent = { element: document, event: Events.exportCodebook, handler: this.exportCodebookEventHandler() }
    this.events.exportCodebookEvent.element.addEventListener(this.events.exportCodebookEvent.event, this.events.exportCodebookEvent.handler, false)
  }

  exportCodebookEventHandler () {
    return (event) => {
      switch (event.detail.exportTo) {
        case 'JSON':
          ExportCodebookJSON.exportConfigurationSchemaToJSONFile(event.detail.codebookAnnotations, event.detail.codebook)
          break
        default :
          ExportCodebookJSON.exportConfigurationSchemaToJSONFile(event.detail.codebookAnnotations, event.detail.codebook)
      }
    }
  }
}

export default ExportCodebook
ExportCodebook.jsimport _ from 'lodash'
import FileSaver from 'file-saver'
import Alerts from '../../../utils/Alerts'
import Codebook from '../../model/Codebook'

class ExportCodebookJSON {
  static exportConfigurationSchemeToJSObject (schemeAnnotations, name, callback) {
    Codebook.fromAnnotations(schemeAnnotations, (err, guide) => {
      if (err) {
        Alerts.errorAlert({ text: 'The codebook scheme is not exported correctly. Error: ' + err.message })
      } else {
        if (_.isFunction(callback)) {
          callback(guide.toObjects(name))
        }
      }
    })
  }

  static exportConfigurationSchemaToJSONFile (schemeAnnotations, group) {
    ExportCodebookJSON.exportConfigurationSchemeToJSObject(schemeAnnotations, group.name, (object) => {
      if (_.isObject(object)) {
        // Stringify JS object
        const stringifyObject = JSON.stringify(object, null, 2)
        // Download the file
        const blob = new window.Blob([stringifyObject], {
          type: 'text/plain;charset=utf-8'
        })
        FileSaver.saveAs(blob, group.name + '.json')
      } else {
        Alerts.errorAlert({ text: 'An unexpected error happened when trying to retrieve review model configuration. Reload webpage and try again.' })
      }
    })
  }
}

export default ExportCodebookJSON
ExportCodebookJSON.js// PVSCL:IFCOND(ExportCodebook, LINE)
import ExportCodebook from './operations/export/ExportCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
    this.codebookExporter = new ExportCodebook()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
    this.codebookExporter.init()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
    this.codebookExporter.destroy()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
    this.initCodebookExportedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)

  initCodebookExportedEvent () {
    this.events.codebookExportedEvent = { element: document, event: Events.codebookExported, handler: this.codebookExportedEventHandler() }
    this.events.codebookExportedEvent.element.addEventListener(this.events.codebookExportedEvent.event, this.events.codebookExportedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook,LINE)
      groupSelectorItem.querySelector('.renameGroup').addEventListener('click', this.createGroupSelectorRenameOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook,LINE)
      groupSelectorItem.querySelector('.exportGroup').addEventListener('click', this.createGroupSelectorExportOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook,LINE)
      groupSelectorItem.querySelector('.exportGroup').addEventListener('click', this.createGroupSelectorExportOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete,LINE)
      groupSelectorItem.querySelector('.deleteGroup').addEventListener('click', this.createGroupSelectorDeleteOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete,LINE)
      // Toggle
      groupSelectorItem.querySelector('.groupSelectorItemToggle').addEventListener('click', this.createGroupSelectorItemToggleEventHandler(group.id))
      // Options
      // PVSCL:IFCOND(RenameCodebook,LINE)
      groupSelectorItem.querySelector('.renameGroup').addEventListener('click', this.createGroupSelectorRenameOptionEventHandler(group))
      // PVSCL:ENDCOND      // PVSCL:IFCOND(ExportCodebook,LINE)
      groupSelectorItem.querySelector('.exportGroup').addEventListener('click', this.createGroupSelectorExportOptionEventHandler(group))
      // PVSCL:ENDCOND      // PVSCL:IFCOND(CodebookDelete,LINE)
      groupSelectorItem.querySelector('.deleteGroup').addEventListener('click', this.createGroupSelectorDeleteOptionEventHandler(group))
      // PVSCL:ENDCOND      // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete,LINE)

  createGroupSelectorItemToggleEventHandler (groupId) {
    return (e) => {
      const groupSelectorItemContainer = document.querySelector('#groupSelectorContainerSelector').querySelector('#groupSelectorItemContainer_' + groupId)
      if (groupSelectorItemContainer.getAttribute('aria-expanded') === 'true') {
        groupSelectorItemContainer.setAttribute('aria-expanded', 'false')
      } else {
        groupSelectorItemContainer.setAttribute('aria-expanded', 'true')
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook,LINE)

  createGroupSelectorExportOptionEventHandler (group) {
    return () => {
      window.abwa.codebookManager.codebookReader.getCodebookDefinition(group, (err, groupAnnotations) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to export group.' })
        } else {
          // Export codebook
          LanguageUtils.dispatchCustomEvent(Events.exportCodebook, { exportTo: 'JSON', codebookAnnotations: groupAnnotations, codebook: group })
        }
      })
    }
  }

  codebookExportedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when trying to export codebook. Error: ' + event.detail.err })
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
  exportCodebook: 'exportCodebook',
  codebookExported: 'codebookExported',
  // PVSCL:ENDCOND