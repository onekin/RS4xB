// PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook, LINE)
        <span pv:condition="ExportCodebook" class="groupSelectorItemOption exportGroup" title="Export codebook">Export</span>
        // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
        <span pv:condition="CodebookDelete" class="groupSelectorItemOption deleteGroup" title="Delete codebook">Delete</span>
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
      // PVSCL:ENDCONDimport Config from '../../../Config'
import Events from '../../../Events'
import Alerts from '../../../utils/Alerts'
import LanguageUtils from '../../../utils/LanguageUtils'
import _ from 'lodash'

class DeleteCodebook {
  constructor () {
    this.events = {}
  }

  init () {
    // Add event listener for deleteCodebook event
    this.initDeleteCodebookEvent()
  }

  destroy () {
    // Remove event listeners
    const events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  // EVENTS
  initDeleteCodebookEvent () {
    this.events.deleteCodebookEvent = { element: document, event: Events.deleteCodebook, handler: this.deleteCodebookEventHandler() }
    this.events.deleteCodebookEvent.element.addEventListener(this.events.deleteCodebookEvent.event, this.events.deleteCodebookEvent.handler, false)
  }

  deleteCodebookEventHandler () {
    return (event) => {
      const codebook = event.detail.codebook
      const user = event.detail.user
      Alerts.confirmAlert({
        title: 'Deleting annotation group ' + codebook.name,
        text: 'Are you sure that you want to delete this group? ' + Config.codebook + ' and all the annotations done in all the documents will be erased.',
        alertType: Alerts.alertType.warning,
        callback: () => {
          window.abwa.annotationServerManager.client.removeAMemberFromAGroup({ id: codebook.id, user: user }, (err) => {
            if (err) {
              LanguageUtils.dispatchCustomEvent(Events.codebookDeleted, { err: err })
            } else {
              LanguageUtils.dispatchCustomEvent(Events.codebookDeleted, { group: codebook })
            }
          })
        }
      })
    }
  }
}

export default DeleteCodebook
DeleteCodebook.jsimport Alerts from '../../../utils/Alerts'
import LanguageUtils from '../../../utils/LanguageUtils'
import Events from '../../../Events'

class DeleteGroup {
  static deleteAnnotations () {
    // Ask user if they are sure to delete it
    Alerts.confirmAlert({
      alertType: Alerts.alertType.question,
      title: chrome.i18n.getMessage('DeleteAllAnnotationsConfirmationTitle'),
      text: chrome.i18n.getMessage('DeleteAllAnnotationsConfirmationMessage'),
      callback: (err, toDelete) => {
        // It is run only when the user confirms the dialog, so delete all the annotations
        if (err) {
          // Nothing to do
        } else {
          // Dispatch delete all annotations event
          LanguageUtils.dispatchCustomEvent(Events.deleteAllAnnotations)
          // TODO Check if it is better to maintain the sidebar opened or not
          window.abwa.sidebar.openSidebar()
        }
      }
    })
  }
}

export default DeleteGroup
DeleteGroup.js// PVSCL:IFCOND(CodebookDelete, LINE)
import DeleteCodebook from './operations/delete/DeleteCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
    this.codebookDeleter = new DeleteCodebook()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
    this.codebookDeleter.init()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
    this.codebookDeleter.destroy()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
    this.initCodebookDeletedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)

  initCodebookDeletedEvent () {
    this.events.codebookDeletedEvent = { element: document, event: Events.codebookDeleted, handler: this.codebookDeletedEventHandler() }
    this.events.codebookDeletedEvent.element.addEventListener(this.events.codebookDeletedEvent.event, this.events.codebookDeletedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook,LINE)
      groupSelectorItem.querySelector('.renameGroup').addEventListener('click', this.createGroupSelectorRenameOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(ExportCodebook,LINE)
      groupSelectorItem.querySelector('.exportGroup').addEventListener('click', this.createGroupSelectorExportOptionEventHandler(group))
      // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete,LINE)
      groupSelectorItem.querySelector('.deleteGroup').addEventListener('click', this.createGroupSelectorDeleteOptionEventHandler(group))
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete,LINE)

  createGroupSelectorDeleteOptionEventHandler (group) {
    return (event) => {
      LanguageUtils.dispatchCustomEvent(Events.deleteCodebook, { codebook: group, user: this.user })
    }
  }

  codebookDeletedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when deleting the group: ' + event.detail.err.message })
      } else {
        // If removed group is the current group, current group must defined again
        if (event.detail.group.id === this.currentGroup.id) {
          this.currentGroup = null
        }
        // Move to first other group if exists
        this.defineCurrentGroup(() => {
          this.reloadGroupsContainer(() => {
            // Dispatch group has changed
            this.updateCurrentGroupHandler(this.currentGroup.id)
            // Expand groups container
            this.container.setAttribute('aria-expanded', 'false')
            // Reopen sidebar if closed
            window.abwa.sidebar.openSidebar()
          })
        })
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookDelete, LINE)
  deleteCodebook: 'deleteCodebook',
  codebookDeleted: 'codebookDeleted',
  // PVSCL:ENDCOND