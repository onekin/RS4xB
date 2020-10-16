// PVSCL:IFCOND(RenameCodebook, LINE)
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
      // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
  <div id="loggedInGroupContainer" class="sidebarContainer">
    <div id="groupSelectorContainerHeader" class="containerHeader">
      <div id="groupSelector" aria-expanded="false">
        <span id="groupSelectorName"></span>
        <span id="groupSelectorToggle"></span>
        <div id="groupSelectorContainerSelector" class="sidebarContainer">
        </div>
      </div>
    </div>
  </div>
  <template id="groupSelectorItem">
    <div class="groupSelectorItemContainer" aria-expanded="false">
      <span class="groupSelectorItemName"></span>
      // PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete, LINE)
      <span pv:condition="RenameCodebook or ExportCodebook or CodebookDelete" class="groupSelectorItemToggle"></span>
      <div pv:condition="RenameCodebook or ExportCodebook or CodebookDelete" class="groupSelectorItemOptionsContainer">
        // PVSCL:IFCOND(RenameCodebook, LINE)
        <span pv:condition="RenameCodebook" class="groupSelectorItemOption renameGroup" title="Rename codebook">Rename</span>
        // PVSCL:ENDCOND        // PVSCL:IFCOND(ExportCodebook, LINE)
        <span pv:condition="ExportCodebook" class="groupSelectorItemOption exportGroup" title="Export codebook">Export</span>
        // PVSCL:ENDCOND        // PVSCL:IFCOND(CodebookDelete, LINE)
        <span pv:condition="CodebookDelete" class="groupSelectorItemOption deleteGroup" title="Delete codebook">Delete</span>
        // PVSCL:ENDCOND      </div>
      // PVSCL:ENDCOND    </div>
  </template>
  // PVSCL:ENDCOND// PVSCL:IFCOND(Manual,LINE)
            sheetName = spreadsheet.properties.title
            // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
          isGroupNameEqual = group.name === this.annotationGuide.name.substr(0, 25)
          // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
import Events from '../Events'
// PVSCL:ENDCOND// PVSCL:IFCOND(Manual,LINE)
              // Initialize listener for group change to reload the content
              this.initListenerForGroupChange()
              // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)

  initListenerForGroupChange () {
    this.events.groupChangedEvent = { element: document, event: Events.groupChanged, handler: this.groupChangedEventHandlerCreator() }
    this.events.groupChangedEvent.element.addEventListener(this.events.groupChangedEvent.event, this.events.groupChangedEvent.handler, false)
  }

  groupChangedEventHandlerCreator () {
    return (event) => {
      this.reloadContentByGroup()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
      document.removeEventListener(Events.groupChanged, this.events.groupChangedEvent)
      // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
      const groupSelectorContainer = this.sidebarContainer.querySelector('#groupSelectorContainer')
      groupSelectorContainer.insertAdjacentHTML('beforebegin', response.data)
      // PVSCL:ELSECOND
      this.sidebarContainer.insertAdjacentHTML('afterbegin', response.data)
      // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
import Events from '../Events'
// PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
            this.reloadGroupsContainer()
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
      // PVSCL:ENDCOND      // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn,LINE)
    // New group button
    const newGroupButton = document.createElement('div')
    newGroupButton.innerText = 'Create ' + Config.codebook
    newGroupButton.id = 'createNewModelButton'
    newGroupButton.className = 'groupSelectorButton'
    newGroupButton.title = 'Create a new codebook'
    newGroupButton.addEventListener('click', this.createNewReviewModelEventHandler())
    groupsContainer.appendChild(newGroupButton)
    // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook,LINE)
    // Import button
    const importGroupButton = document.createElement('div')
    importGroupButton.className = 'groupSelectorButton'
    importGroupButton.innerText = 'Import codebook'
    importGroupButton.id = 'importReviewModelButton'
    importGroupButton.addEventListener('click', this.createImportGroupButtonEventHandler())
    groupsContainer.appendChild(importGroupButton)
    // PVSCL:ENDCOND// PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete,LINE)

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
  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
    title = 'What is the topic or the focus question?'
    inputPlaceholder = 'Type here the topic ...'
    // PVSCL:ELSECOND
    title = 'Create a new codebook'
    inputPlaceholder = 'Type here the new codebook name...'
    // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            console.log(groupName)
            this.groupFullName = groupName
            groupName = groupName.substring(0, 24)
            console.log(groupName)
            return groupName
            // PVSCL:ELSECOND
            // const swal = require('sweetalert2').default
            swal.showValidationMessage('The codebook name cannot be higher than 25 characters.')
            // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            this.groupFullName = groupName
            // PVSCL:ENDCOND// PVSCL:IFCOND(BuiltIn,LINE)

  createNewReviewModelEventHandler () {
    return () => {
      this.createNewGroup((err, result) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create a new group. Please try again or contact developers if the error continues happening.' })
        } else {
          // Update list of groups from annotation Server
          this.retrieveGroups(() => {
            // Move group to new created one
            this.setCurrentGroup(result.id, () => {
              // Expand groups container
              this.container.setAttribute('aria-expanded', 'false')
              // Reopen sidebar if closed
              window.abwa.sidebar.openSidebar()
            })
          })
        }
      })
    }
  }

  createNewGroup (callback) {
    let title
    let inputPlaceholder
    // PVSCL:IFCOND(TopicBased, LINE)
            this.groupFullName = groupName
            // PVSCL:ENDCOND            return groupName
          }
        }
      },
      callback: (err, groupName) => {
        if (err) {
          window.alert('Unable to load swal. Please contact developer.')
        } else {
          groupName = LanguageUtils.normalizeString(groupName)
          window.abwa.annotationServerManager.client.createNewGroup({
            name: groupName,
            description: 'A group created using annotation tool ' + chrome.runtime.getManifest().name
          }, callback)
        }
      }
    })
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(ImportCodebook,LINE)

  createImportGroupButtonEventHandler () {
    return () => {
      LanguageUtils.dispatchCustomEvent(Events.importCodebook, { importTo: 'JSON' })
    }
  }

  codebookImportedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when deleting the group: ' + event.detail.err.message })
      } else {
        // Update groups from annotation server
        this.retrieveGroups(() => {
          this.setCurrentGroup(event.detail.groupId)
        })
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)

  reloadGroupsContainer (callback) {
    this.retrieveGroups(() => {
      this.container = document.querySelector('#groupSelector')
      this.container.setAttribute('aria-expanded', 'false')
      this.renderGroupsContainer()
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }

  renderGroupsContainer () {
    // Current group element rendering
    const currentGroupNameElement = document.querySelector('#groupSelectorName')
    if (this.currentGroup) {
      currentGroupNameElement.innerText = this.currentGroup.name
      currentGroupNameElement.title = this.currentGroup.name
    }
    // Toggle functionality
    const toggleElement = document.querySelector('#groupSelectorToggle')
    if (this.groupSelectorToggleClickEvent) {
      currentGroupNameElement.removeEventListener('click', this.groupSelectorToggleClickEvent)
      toggleElement.removeEventListener('click', this.groupSelectorToggleClickEvent)
    }
    this.groupSelectorToggleClickEvent = this.createGroupSelectorToggleEvent()
    currentGroupNameElement.addEventListener('click', this.groupSelectorToggleClickEvent)
    toggleElement.addEventListener('click', this.groupSelectorToggleClickEvent)
    // Groups container
    const groupsContainer = document.querySelector('#groupSelectorContainerSelector')
    groupsContainer.innerText = ''
    // For each group
    const groupSelectorItemTemplate = document.querySelector('#groupSelectorItem')
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]
      const groupSelectorItem = $(groupSelectorItemTemplate.content.firstElementChild).clone().get(0)
      // Container
      groupsContainer.appendChild(groupSelectorItem)
      groupSelectorItem.id = 'groupSelectorItemContainer_' + group.id
      // Name
      const nameElement = groupSelectorItem.querySelector('.groupSelectorItemName')
      nameElement.innerText = group.name
      nameElement.title = 'Move to annotation group ' + group.name
      nameElement.addEventListener('click', this.createGroupChangeEventHandler(group.id))
      // PVSCL:IFCOND(RenameCodebook or ExportCodebook or CodebookDelete,LINE)

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
  // PVSCL:ENDCOND  // PVSCL:IFCOND(BuiltIn,LINE)

  createNewReviewModelEventHandler () {
    return () => {
      this.createNewGroup((err, result) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create a new group. Please try again or contact developers if the error continues happening.' })
        } else {
          // Update list of groups from annotation Server
          this.retrieveGroups(() => {
            // Move group to new created one
            this.setCurrentGroup(result.id, () => {
              // Expand groups container
              this.container.setAttribute('aria-expanded', 'false')
              // Reopen sidebar if closed
              window.abwa.sidebar.openSidebar()
            })
          })
        }
      })
    }
  }

  createNewGroup (callback) {
    let title
    let inputPlaceholder
    // PVSCL:IFCOND(TopicBased, LINE)
            this.groupFullName = groupName
            // PVSCL:ENDCOND            return groupName
          }
        }
      },
      callback: (err, groupName) => {
        if (err) {
          window.alert('Unable to load swal. Please contact developer.')
        } else {
          groupName = LanguageUtils.normalizeString(groupName)
          window.abwa.annotationServerManager.client.createNewGroup({
            name: groupName,
            description: 'A group created using annotation tool ' + chrome.runtime.getManifest().name
          }, callback)
        }
      }
    })
  }
  // PVSCL:ENDCOND  // PVSCL:IFCOND(CodebookDelete,LINE)

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
  // PVSCL:ENDCOND  // PVSCL:IFCOND(RenameCodebook,LINE)

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
  // PVSCL:ENDCOND  // PVSCL:IFCOND(ImportCodebook,LINE)

  createImportGroupButtonEventHandler () {
    return () => {
      LanguageUtils.dispatchCustomEvent(Events.importCodebook, { importTo: 'JSON' })
    }
  }

  codebookImportedEventHandler () {
    return (event) => {
      if (event.detail.err) {
        Alerts.errorAlert({ text: 'Error when deleting the group: ' + event.detail.err.message })
      } else {
        // Update groups from annotation server
        this.retrieveGroups(() => {
          this.setCurrentGroup(event.detail.groupId)
        })
      }
    }
  }
  // PVSCL:ENDCOND  // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
    // Destroy intervals
    if (this.loggedInInterval) {
      clearInterval(this.loggedInInterval)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Manual, LINE)
  groupChanged: 'groupChanged',
  // PVSCL:ENDCONDimport ChromeStorage from './utils/ChromeStorage'
import HypothesisClientManager from './annotationServer/hypothesis/HypothesisClientManager'
import _ from 'lodash'
const selectedGroupNamespace = 'hypothesis.currentGroup'

console.log('Loaded hypothesis group content script')

window.addEventListener('load', () => {
  // Retrieve last saved group
  ChromeStorage.getData(selectedGroupNamespace, ChromeStorage.local, (err, savedCurrentGroup) => {
    if (err) {
      console.error('Error while retrieving default group')
    } else {
      // Parse chrome storage result
      if (!_.isEmpty(savedCurrentGroup) && savedCurrentGroup.data) {
        // Nothing to change
      } else {
        // Set hypothes.is web page group as current group
        window.abwa = {}
        window.abwa.annotationServerManager = new HypothesisClientManager()
        window.abwa.annotationServerManager.init(() => {
          window.abwa.annotationServerManager.client.getUserProfile((err, userProfile) => {
            if (err) {
              console.error('Error while retrieving user profile in hypothesis')
            } else {
              const urlSplit = window.location.href.split('/')
              const indexOfGroups = _.indexOf(urlSplit, 'groups')
              if (urlSplit[indexOfGroups + 1]) {
                const groupId = urlSplit[indexOfGroups + 1]
                // Set current group
                const group = _.find(userProfile.groups, (group) => { return group.id === groupId })
                if (group) {
                  // Save to chrome storage current group
                  ChromeStorage.setData(selectedGroupNamespace, { data: JSON.stringify(group) }, ChromeStorage.local, () => {
                    console.log('Set as group: ' + group.name)
                  })
                }
              }
            }
          })
        })
      }
    }
  })
})
hypothesisGroupContentScript.js/* PVSCL:IFCOND(Manual, LINE) */
@import './groupSelection';
/* PVSCL:ENDCOND */PVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCONDPVSCL:IFCOND(Manual and Hypothesis and AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1),
    {
      "matches": [
        "https://hypothes.is/groups/*/*"
      ],
      "js": [
        "scripts/hypothesisGroupContentScript.js"
      ],
      "run_at": "document_end"
    }PVSCL:ENDCOND