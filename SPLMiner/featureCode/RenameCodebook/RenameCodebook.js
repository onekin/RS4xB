// PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
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
      // PVSCL:ENDCONDimport _ from 'lodash'
import Events from '../../../Events'
import Alerts from '../../../utils/Alerts'
import LanguageUtils from '../../../utils/LanguageUtils'

class RenameCodebook {
  constructor () {
    this.events = {}
  }

  init () {
    // Add event listener for renameCodebook event
    this.initRenameCodebookEvent()
  }

  destroy () {
    // Remove event listeners
    const events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  // EVENTS
  initRenameCodebookEvent () {
    this.events.renameCodebookEvent = { element: document, event: Events.renameCodebook, handler: this.renameCodebookEventHandler() }
    this.events.renameCodebookEvent.element.addEventListener(this.events.renameCodebookEvent.event, this.events.renameCodebookEvent.handler, false)
  }

  /**
   * Event handler for renameCodebook.
   */
  renameCodebookEventHandler () {
    return (event) => {
      const codebook = event.detail.codebook
      let title
      // PVSCL:IFCOND(TopicBased, LINE)

      Alerts.inputTextAlert({
        title: title,
        inputPlaceholder: 'Type here the name of your new review model...',
        inputValue: codebook.name,
        preConfirm: (codebookName) => {
          if (_.isString(codebookName)) {
            if (codebookName.length <= 0) {
              const swal = require('sweetalert2')
              swal.showValidationMessage('Name cannot be empty.')
            } else if (codebookName.length > 25) {
              const swal = require('sweetalert2')
              swal.showValidationMessage('The review model name cannot be higher than 25 characters.')
            } else {
              return codebookName
            }
          }
        },
        callback: (err, codebookName) => {
          if (err) {
            window.alert('Unable to load swal. Please contact developer.')
            LanguageUtils.dispatchCustomEvent(Events.codebookRenamed, { err: err })
          } else {
            codebookName = LanguageUtils.normalizeString(codebookName)
            window.abwa.annotationServerManager.client.updateGroup(codebook.id, {
              name: codebookName,
              description: codebook.description || 'A Review&Go group to conduct a review'
            }, (err, codebook) => {
              if (err) {
                LanguageUtils.dispatchCustomEvent(Events.codebookRenamed, { err: err })
              } else {
                LanguageUtils.dispatchCustomEvent(Events.codebookRenamed, { group: codebook })
              }
            })
          }
        }
      })
    }
  }
}

export default RenameCodebook
RenameCodebook.js// PVSCL:IFCOND(RenameCodebook, LINE)
import RenameCodebook from './operations/update/RenameCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
    this.codebookRenamer = new RenameCodebook()
    // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
    this.codebookRenamer.init()
    // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
    this.codebookRenamer.destroy()
    // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
    this.initCodebookRenamedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)

  initCodebookRenamedEvent () {
    this.events.codebookRenamedEvent = { element: document, event: Events.codebookRenamed, handler: this.codebookRenamedEventHandler() }
    this.events.codebookRenamedEvent.element.addEventListener(this.events.codebookRenamedEvent.event, this.events.codebookRenamedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook,LINE)
      groupSelectorItem.querySelector('.renameGroup').addEventListener('click', this.createGroupSelectorRenameOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook,LINE)
      groupSelectorItem.querySelector('.renameGroup').addEventListener('click', this.createGroupSelectorRenameOptionEventHandler(group))
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook,LINE)

  createGroupSelectorRenameOptionEventHandler (group) {
    return () => {
      LanguageUtils.dispatchCustomEvent(Events.renameCodebook, { codebook: group })
    }
  }

  codebookRenamedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when renaming the group: ' + event.detail.err.message })
      } else {
        this.currentGroup = event.detail.group
        this.retrieveGroups(() => {
          this.reloadGroupsContainer(() => {
            this.container.setAttribute('aria-expanded', 'true')
            window.abwa.sidebar.openSidebar()
          })
        })
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook, LINE)
  renameCodebook: 'renameCodebook',
  codebookRenamed: 'codebookRenamed',
  // PVSCL:ENDCOND