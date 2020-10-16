// PVSCL:IFCOND(CodebookUpdate, LINE)
    this.initCodebookUpdatedEventListener()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)

  initCodebookUpdatedEventListener (callback) {
    this.events.codebookUpdated = { element: document, event: Events.codebookUpdated, handler: this.createCodebookUpdatedEventHandler() }
    this.events.codebookUpdated.element.addEventListener(this.events.codebookUpdated.event, this.events.codebookUpdated.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createCodebookUpdatedEventHandler () {
    return () => {
      // Reload annotations
      this.updateAllAnnotations(() => {
        console.debug('annotations updated')
      })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
import ColorUtils from '../../utils/ColorUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)

  addTheme (theme) {
    if (LanguageUtils.isInstanceOf(theme, Theme)) {
      this.themes.push(theme)
      // Get new color for the theme
      const colors = ColorUtils.getDifferentColors(this.themes.length)
      const lastColor = colors.pop()
      theme.color = ColorUtils.setAlphaToColor(lastColor, Config.colors.minAlpha)
    }
  }

  updateTheme (theme, previousId) {
    if (LanguageUtils.isInstanceOf(theme, Theme)) {
      // Find item index using _.findIndex
      const index = _.findIndex(this.themes, (it) => {
        return it.id === theme.id || it.id === previousId
      })
      const previousTheme = this.themes[index]
      // Replace item at index using native splice
      this.themes.splice(index, 1, theme)
      theme.color = previousTheme.color
    }
  }

  removeTheme (theme) {
    _.remove(this.themes, theme)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
import ColorUtils from '../../utils/ColorUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)

  addCode (code) {
    this.codes.push(code)
    // Re-set colors for each code
    this.reloadColorsForCodes()
  }

  updateCode (code, previousId) {
    if (LanguageUtils.isInstanceOf(code, Code)) {
      // Find item index using _.findIndex
      const index = _.findIndex(this.codes, (it) => {
        return it.id === code.id || it.id === previousId
      })
      const previousCode = this.codes[index]
      code.color = previousCode.color
      // Replace item at index using native splice
      this.codes.splice(index, 1, code)
    }
  }

  removeCode (code) {
    _.remove(this.codes, code)
    // Re-set colors for each code
    this.reloadColorsForCodes()
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE) // Check if it is possible to add codes to the definition model if it is not selected Dynamic feature
  // PVSCL:IFCOND(Hierarchy, LINE)

  addCode (code) {
    this.codes.push(code)
    // Re-set colors for each code
    this.reloadColorsForCodes()
  }

  updateCode (code, previousId) {
    if (LanguageUtils.isInstanceOf(code, Code)) {
      // Find item index using _.findIndex
      const index = _.findIndex(this.codes, (it) => {
        return it.id === code.id || it.id === previousId
      })
      const previousCode = this.codes[index]
      code.color = previousCode.color
      // Replace item at index using native splice
      this.codes.splice(index, 1, code)
    }
  }

  removeCode (code) {
    _.remove(this.codes, code)
    // Re-set colors for each code
    this.reloadColorsForCodes()
  }
  // PVSCL:ENDCOND  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)

  reloadColorsForCodes () {
    this.codes.forEach((code, j) => {
      const alphaForChild = (Config.colors.maxAlpha - Config.colors.minAlpha) / this.codes.length * (j + 1) + Config.colors.minAlpha
      code.color = ColorUtils.setAlphaToColor(this.color, alphaForChild)
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
import UpdateCodebook from '../update/UpdateCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
    this.initCodeCreatedEvent()
    this.initCodeUpdatedEvent()
    this.initCodeRemovedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
    this.initThemeCreatedEvent()
    this.initThemeUpdatedEvent()
    this.initThemeRemovedEvent()
    // PVSCL:IFCOND(Hierarchy,LINE)
    this.initCodeCreatedEvent()
    this.initCodeUpdatedEvent()
    this.initCodeRemovedEvent()
    // PVSCL:ENDCOND    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)

  initCodeCreatedEvent () {
    this.events.codeCreatedEvent = { element: document, event: Events.codeCreated, handler: this.codeCreatedEventHandler() }
    this.events.codeCreatedEvent.element.addEventListener(this.events.codeCreatedEvent.event, this.events.codeCreatedEvent.handler, false)
  }

  initCodeUpdatedEvent () {
    this.events.codeUpdatedEvent = { element: document, event: Events.codeUpdated, handler: this.codeUpdatedEventHandler() }
    this.events.codeUpdatedEvent.element.addEventListener(this.events.codeUpdatedEvent.event, this.events.codeUpdatedEvent.handler, false)
  }

  initCodeRemovedEvent () {
    this.events.codeRemovedEvent = { element: document, event: Events.codeRemoved, handler: this.codeRemovedEventHandler() }
    this.events.codeRemovedEvent.element.addEventListener(this.events.codeRemovedEvent.event, this.events.codeRemovedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
  initThemeCreatedEvent () {
    this.events.themeCreatedEvent = { element: document, event: Events.themeCreated, handler: this.themeCreatedEventHandler() }
    this.events.themeCreatedEvent.element.addEventListener(this.events.themeCreatedEvent.event, this.events.themeCreatedEvent.handler, false)
  }

  initThemeUpdatedEvent () {
    this.events.themeUpdatedEvent = { element: document, event: Events.themeUpdated, handler: this.themeUpdatedEventHandler() }
    this.events.themeUpdatedEvent.element.addEventListener(this.events.themeUpdatedEvent.event, this.events.themeUpdatedEvent.handler, false)
  }

  initThemeRemovedEvent () {
    this.events.themeRemovedEvent = { element: document, event: Events.themeRemoved, handler: this.themeRemovedEventHandler() }
    this.events.themeRemovedEvent.element.addEventListener(this.events.themeRemovedEvent.event, this.events.themeRemovedEvent.handler, false)
  }
  // PVSCL:IFCOND(Hierarchy,LINE)

  initCodeCreatedEvent () {
    this.events.codeCreatedEvent = { element: document, event: Events.codeCreated, handler: this.codeCreatedEventHandler() }
    this.events.codeCreatedEvent.element.addEventListener(this.events.codeCreatedEvent.event, this.events.codeCreatedEvent.handler, false)
  }

  initCodeUpdatedEvent () {
    this.events.codeUpdatedEvent = { element: document, event: Events.codeUpdated, handler: this.codeUpdatedEventHandler() }
    this.events.codeUpdatedEvent.element.addEventListener(this.events.codeUpdatedEvent.event, this.events.codeUpdatedEvent.handler, false)
  }

  initCodeRemovedEvent () {
    this.events.codeRemovedEvent = { element: document, event: Events.codeRemoved, handler: this.codeRemovedEventHandler() }
    this.events.codeRemovedEvent.element.addEventListener(this.events.codeRemovedEvent.event, this.events.codeRemovedEvent.handler, false)
  }
  // PVSCL:ENDCOND  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
            // As codebook can be updated, the user can create an empty one and update it later
            Alerts.confirmAlert({
              title: 'Do you want to create a default annotation codebook?',
              text: currentGroupName + ' group has not codes to start annotating. Would you like to configure the highlighter?',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              alertType: Alerts.alertType.question,
              callback: () => {
                Alerts.loadingAlert({
                  title: 'Configuration in progress',
                  text: 'We are configuring everything to start reviewing.',
                  position: Alerts.position.center
                })
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
                resolve()
              },
              cancelCallback: () => {
                // PVSCL:IFCOND(CodebookUpdate,LINE)
                LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'emptyCodebook' })
                // PVSCL:ENDCOND                resolve()
              }
            })
            // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
    // Create new theme button
    UpdateCodebook.createNewThemeButton()
    // PVSCL:ENDCOND/* PVSCL:IFCOND(CodebookUpdate) */,
      groupRightClickHandler: this.themeRightClickHandler(),
      buttonRightClickHandler: this.codeRightClickHandler()/* PVSCL:ENDCOND *//* PVSCL:IFCOND(CodebookUpdate) */,
      buttonRightClickHandler: this.themeRightClickHandler()/* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
      items.createNewCode = { name: 'Create new code' }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
        items.manageRelationships = { name: 'Manage links' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
        items.manageRelationships = { name: 'Manage links' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
      items.manageRelationships = { name: 'Manage links' }
      // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
      let theme = this.codebook.getCodeOrThemeFromId(themeId)
      if (!theme.isTopic) {
        items.updateTheme = { name: 'Modify ' + Config.tags.grouped.group }
        items.removeTheme = { name: 'Remove ' + Config.tags.grouped.group }
        // PVSCL:IFCOND(Linking,LINE)
      items.manageRelationships = { name: 'Manage links' }
      // PVSCL:ENDCOND      // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
      // PVSCL:IFCOND(Hierarchy, LINE)
      items.createNewCode = { name: 'Create new code' }
      // PVSCL:ENDCOND      // PVSCL:IFCOND(TopicBased, LINE)
      let theme = this.codebook.getCodeOrThemeFromId(themeId)
      if (!theme.isTopic) {
        items.updateTheme = { name: 'Modify ' + Config.tags.grouped.group }
        items.removeTheme = { name: 'Remove ' + Config.tags.grouped.group }
        // PVSCL:IFCOND(Linking,LINE)
      items.manageRelationships = { name: 'Manage links' }
      // PVSCL:ENDCOND      // PVSCL:ENDCOND      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
          if (key === 'createNewCode') {
            const theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              LanguageUtils.dispatchCustomEvent(Events.createCode, { theme: theme })
            }
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
          if (key === 'manageRelationships') {
            let theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              window.abwa.mapContentManager.manageRelationships(theme)
            }
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
          // PVSCL:IFCOND(Hierarchy, LINE)
          if (key === 'createNewCode') {
            const theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              LanguageUtils.dispatchCustomEvent(Events.createCode, { theme: theme })
            }
          }
          // PVSCL:ENDCOND          if (key === 'updateTheme') {
            const theme = this.codebook.getCodeOrThemeFromId(themeId)
            LanguageUtils.dispatchCustomEvent(Events.updateTheme, { theme: theme })
          }
          if (key === 'removeTheme') {
            const theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              LanguageUtils.dispatchCustomEvent(Events.removeTheme, { theme: theme })
            }
          }
          // PVSCL:IFCOND(Linking, LINE)
          if (key === 'manageRelationships') {
            let theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              window.abwa.mapContentManager.manageRelationships(theme)
            }
          }
          // PVSCL:ENDCOND          // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
        items.updateCode = { name: 'Modify code' }
        items.removeCode = { name: 'Remove code' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
            if (key === 'removeCode') {
              LanguageUtils.dispatchCustomEvent(Events.removeCode, { code: code })
            }
            if (key === 'updateCode') {
              LanguageUtils.dispatchCustomEvent(Events.updateCode, { code: code })
            }
            // PVSCL:ENDCOND/* PVSCL:IFCOND(EvidenceAnnotations) */,
        addToCXL: true /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
  codeCreatedEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      const code = Code.fromAnnotation(event.detail.newCodeAnnotation, theme)
      // Add to the model the new theme
      theme.addCode(code)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Reopen sidebar to see the new added code
      window.abwa.sidebar.openSidebar()
    }
  }

  codeUpdatedEventHandler () {
    return (event) => {
      // Update model
      const code = event.detail.updatedCode
      const theme = code.theme
      theme.updateCode(code)
      this.codebook.updateTheme(theme)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Open the sidebar
      window.abwa.sidebar.openSidebar()
    }
  }

  /**
   * This function removes the given code from the codebook and reloads the button container.
   */
  codeRemovedEventHandler () {
    return (event) => {
      const code = event.detail.code
      code.theme.removeCode(code)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)

  /**
   * This function stores the new theme in the codebook and reloads the button container.
   */
  themeCreatedEventHandler () {
    return (event) => {
      const theme = Theme.fromAnnotation(event.detail.newThemeAnnotation, this.codebook)
      // Add to the model the new theme
      this.codebook.addTheme(theme)
      // Create theme annotation
      LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
        purpose: 'classifying',
        target: event.detail.target,
        codeId: theme.id/* PVSCL:IFCOND(EvidenceAnnotations) */,
        addToCXL: true /* PVSCL:ENDCOND */      })
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Open the sidebar
      window.abwa.sidebar.openSidebar()
    }
  }

  themeUpdatedEventHandler () {
    return (event) => {
      // Update model
      this.codebook.updateTheme(event.detail.updatedTheme)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Open the sidebar
      window.abwa.sidebar.openSidebar()
    }
  }

  /**
   * This function removes the given theme from the codebook and reloads the button container.
   */
  themeRemovedEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      theme.annotationGuide.removeTheme(theme)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
    }
  }

  /**
   * This function stores the new code in the codebook and reloads the button container.
   */
  // PVSCL:IFCOND(Hierarchy, LINE)
  codeCreatedEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      const code = Code.fromAnnotation(event.detail.newCodeAnnotation, theme)
      // Add to the model the new theme
      theme.addCode(code)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Reopen sidebar to see the new added code
      window.abwa.sidebar.openSidebar()
    }
  }

  codeUpdatedEventHandler () {
    return (event) => {
      // Update model
      const code = event.detail.updatedCode
      const theme = code.theme
      theme.updateCode(code)
      this.codebook.updateTheme(theme)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
      // Open the sidebar
      window.abwa.sidebar.openSidebar()
    }
  }

  /**
   * This function removes the given code from the codebook and reloads the button container.
   */
  codeRemovedEventHandler () {
    return (event) => {
      const code = event.detail.code
      code.theme.removeCode(code)
      // Reload button container
      this.reloadButtonContainer()
      // Dispatch codebook updated event
      LanguageUtils.dispatchCustomEvent(Events.codebookUpdated, { codebook: this.codebook })
    }
  }
  // PVSCL:ENDCOND  // PVSCL:ENDCONDimport _ from 'lodash'
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
RenameCodebook.jsimport Events from '../../../Events'
import Alerts from '../../../utils/Alerts'
import _ from 'lodash'
import $ from 'jquery'
import Config from '../../../Config'
import Theme from '../../model/Theme'
import Classifying from '../../../annotationManagement/purposes/Classifying'
import Annotation from '../../../annotationManagement/Annotation'
// PVSCL:IFCOND(Hierarchy,LINE)

import LanguageUtils from '../../../utils/LanguageUtils'

class UpdateCodebook {
  constructor () {
    this.events = {}
  }

  init () {
    // Add event listener for updateCodebook event
    this.initCreateThemeEvent()
    this.initRemoveThemeEvent()
    this.initUpdateThemeEvent()
    // PVSCL:IFCOND(Hierarchy,LINE)

  }

  destroy () {
    // Remove event listeners
    const events = _.values(this.events)
    for (let i = 0; i < events.length; i++) {
      events[i].element.removeEventListener(events[i].event, events[i].handler)
    }
  }

  initCreateThemeEvent () {
    this.events.createThemeEvent = { element: document, event: Events.createTheme, handler: this.createNewThemeEventHandler() }
    this.events.createThemeEvent.element.addEventListener(this.events.createThemeEvent.event, this.events.createThemeEvent.handler, false)
  }

  initUpdateThemeEvent () {
    this.events.updateThemeEvent = { element: document, event: Events.updateTheme, handler: this.createUpdateThemeEventHandler() }
    this.events.updateThemeEvent.element.addEventListener(this.events.updateThemeEvent.event, this.events.updateThemeEvent.handler, false)
  }

  initRemoveThemeEvent (callback) {
    this.events.removeThemeEvent = { element: document, event: Events.removeTheme, handler: this.removeThemeEventHandler() }
    this.events.removeThemeEvent.element.addEventListener(this.events.removeThemeEvent.event, this.events.removeThemeEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }
  // PVSCL:IFCOND(Hierarchy,LINE)


  /**
   * This function adds a button in the sidebar that allows to create new themes.
   */
  static createNewThemeButton () {
    const newThemeButton = document.createElement('button')
    newThemeButton.innerText = 'New ' + Config.tags.grouped.group
    newThemeButton.id = 'newThemeButton'
    newThemeButton.className = 'tagButton codingElement'
    newThemeButton.addEventListener('click', () => {
      let newTheme
      let retrievedThemeName
      let target = window.abwa.annotationManagement.annotationCreator.obtainTargetToCreateAnnotation({})
      // Get user selected content
      let selection = document.getSelection()
      // If selection is child of sidebar, return null
      if ($(selection.anchorNode).parents('#annotatorSidebarWrapper').toArray().length !== 0 || selection.toString().length < 1) {
        retrievedThemeName = ''
      } else {
        retrievedThemeName = selection.toString().trim().replace(/^\w/, c => c.toUpperCase())
      }
      Alerts.multipleInputAlert({
        title: 'You are creating a new ' + Config.tags.grouped.group + ': ',
        html: '<input autofocus class="formCodeName swal2-input" type="text" id="themeName" placeholder="New ' + Config.tags.grouped.group + ' name" value="' + retrievedThemeName + '"/>' +
          '<textarea class="formCodeDescription swal2-textarea" data-minchars="1" data-multiple rows="6" id="themeDescription" placeholder="Please type a description that describes this ' + Config.tags.grouped.group + '..."></textarea>',
        preConfirm: () => {
          const themeNameElement = document.querySelector('#themeName')
          let themeName
          if (_.isElement(themeNameElement)) {
            themeName = themeNameElement.value
          }
          if (themeName.length > 0) {
            if (!this.themeNameExist(themeName)) {
              const themeDescriptionElement = document.querySelector('#themeDescription')
              let themeDescription
              if (_.isElement(themeDescriptionElement)) {
                themeDescription = themeDescriptionElement.value
              }
              newTheme = new Theme({
                name: themeName,
                description: themeDescription,
                annotationGuide: window.abwa.codebookManager.codebookReader.codebook
              })
            } else {
              const swal = require('sweetalert2')
              swal.showValidationMessage('There exist a ' + Config.tags.grouped.group + ' with the same name. Please select a different name.')
            }
          } else {
            const swal = require('sweetalert2')
            swal.showValidationMessage('Name cannot be empty.')
          }
        },
        callback: () => {
          LanguageUtils.dispatchCustomEvent(Events.createTheme, { theme: newTheme, target: target })
        },
        cancelCallback: () => {
          console.log('new theme canceled')
        }
      })
    })
    window.abwa.codebookManager.codebookReader.buttonContainer.append(newThemeButton)
  }

  static themeNameExist (newThemeName) {
    let themes = window.abwa.codebookManager.codebookReader.codebook.themes
    let theme = _.find(themes, (theme) => {
      return theme.name === newThemeName
    })
    if (theme) {
      return true
    } else {
      return false
    }
  }

  /**
   * This function creates a handler to create a new theme when it receives the createTheme event.
   * @return Event
   */
  createNewThemeEventHandler () {
    return (event) => {
      const newThemeAnnotation = event.detail.theme.toAnnotation()
      window.abwa.annotationServerManager.client.createNewAnnotation(newThemeAnnotation, (err, annotation) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create the new code. Error: ' + err.toString() })
        } else {
          LanguageUtils.dispatchCustomEvent(Events.themeCreated, { newThemeAnnotation: annotation, target: event.detail.target })
        }
      })
    }
  }

  /**
   * This function creates a handler to update a new theme when it receives the updateTheme event.
   * @return Event
   */
  createUpdateThemeEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      let themeToUpdate
      // Show form to update theme
      Alerts.multipleInputAlert({
        title: 'You are updating the theme ' + theme.name,
        html: '<input autofocus class="formCodeName swal2-input" type="text" id="themeName" type="text" placeholder="New theme name" value="' + theme.name + '"/>' +
          '<textarea class="formCodeDescription swal2-textarea" data-minchars="1" data-multiple rows="6"  id="themeDescription" placeholder="Please type a description that describes this theme...">' + theme.description + '</textarea>',
        preConfirm: () => {
          const themeNameElement = document.querySelector('#themeName')
          let themeName
          if (_.isElement(themeNameElement)) {
            themeName = themeNameElement.value
          }
          const themeDescriptionElement = document.querySelector('#themeDescription')
          let themeDescription
          if (_.isElement(themeDescriptionElement)) {
            themeDescription = themeDescriptionElement.value
          }
          // PVSCL:IFCOND(TopicBased, LINE)

          // PVSCL:IFCOND(Hierarchy, LINE)

          themeToUpdate.id = theme.id
        },
        callback: () => {
          // Update codebook
          this.updateCodebookTheme(themeToUpdate)
          // Update all annotations done with this theme
          this.updateAnnotationsWithTheme(themeToUpdate)
        },
        cancelCallback: () => {
          // showForm(preConfirmData)
        }
      })
    }
  }

  /**
   * This function creates a handler to remove a theme when it receives the removeTheme event.
   * @return Event
   */
  removeThemeEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      // Ask user is sure to remove
      Alerts.confirmAlert({
        title: 'Removing ' + Config.tags.grouped.group + theme.name,
        text: 'Are you sure that you want to remove the ' + Config.tags.grouped.group + ' ' + theme.name + '. All dependant codes will be deleted too. You cannot undo this operation.',
        alertType: Alerts.alertType.warning,
        callback: () => {
          let annotationsToDelete = [theme.id]
          // Get theme codes id to be removed too
          const codesId = _.map(theme.codes, (code) => { return code.id })
          if (_.every(codesId, _.isString)) {
            annotationsToDelete = annotationsToDelete.concat(codesId)
          }
          // Get linking annotions made with removed theme
          // PVSCL:IFCOND(Linking, LINE)

          window.abwa.annotationServerManager.client.deleteAnnotations(annotationsToDelete, (err, result) => {
            if (err) {
              Alerts.errorAlert({ text: 'Unexpected error when deleting the code.' })
            } else {
              LanguageUtils.dispatchCustomEvent(Events.themeRemoved, { theme: theme })
            }
          })
        }
      })
    }
  }
  // PVSCL:IFCOND(Hierarchy, LINE)


  updateCodebookTheme (themeToUpdate, callback) {
    const annotationsToUpdate = themeToUpdate.toAnnotations()
    const updatePromises = annotationsToUpdate.map((annotation) => {
      return new Promise((resolve, reject) => {
        window.abwa.annotationServerManager.client.updateAnnotation(annotation.id, annotation, (err, annotation) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
    Promise
      .all(updatePromises)
      .catch((rejects) => {
        Alerts.errorAlert({ text: 'Unable to create the new code. Error: ' + rejects[0].toString() })
      }).then(() => {
        if (_.isFunction(callback)) {
          callback()
        }
        LanguageUtils.dispatchCustomEvent(Events.themeUpdated, { updatedTheme: themeToUpdate })
      })
  }

  updateAnnotationsWithTheme (theme) {
    // Get all the annotations done in the group with this theme
    const searchByTagPromise = (tag) => {
      return new Promise((resolve, reject) => {
        window.abwa.annotationServerManager.client.searchAnnotations({
          group: window.abwa.groupSelector.currentGroup.id,
          tags: [tag]
        }, (err, annotations) => {
          if (err) {
            reject(err)
          } else {
            resolve(annotations)
          }
        })
      })
    }
    const promises = [
      searchByTagPromise(Config.namespace + ':' + Config.tags.grouped.group + ':' + theme.name)
    ]
    // PVSCL:IFCOND(Hierarchy, LINE)

    Promise.all(promises).then((resolves) => {
      const annotationObjects = resolves[0] // Get annotations done
      let annotations = annotationObjects.map((annotation) => {
        try {
          return Annotation.deserialize(annotation)
        } catch (err) {
          return null
        }
      })
      annotations = _.compact(annotations)
      // Update all the codes with the new name of the theme
      annotations = annotations.map(annotation => {
        const classifyingBody = annotation.getBodyForPurpose(Classifying.purpose)
        if (classifyingBody) {
          if (classifyingBody.value.id === theme.id) {
            classifyingBody.value = theme.toObject()
            return annotation
          } else {
            /* PVSCL:IFCOND(Hierarchy, LINE) */

          }
        }
      })
      const promises = annotations.forEach((annotation) => {
        return new Promise((resolve, reject) => {
          window.abwa.annotationServerManager.client.updateAnnotation(annotation.id, annotation, (err, annotation) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotation)
            }
          })
        })
      })
      Promise.all(promises || []).then(() => {})
    })
  }
}

export default UpdateCodebook
UpdateCodebook.js// PVSCL:IFCOND(CodebookUpdate, LINE)
import UpdateCodebook from './operations/update/UpdateCodebook'
// PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
    this.codebookUpdater = new UpdateCodebook()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
    this.codebookUpdater.init()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
    this.codebookUpdater.destroy()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
    this.events.codebookUpdatedEvent = { element: document, event: Events.codebookUpdated, handler: this.createCodebookUpdatedEventHandler() }
    this.events.codebookUpdatedEvent.element.addEventListener(this.events.codebookUpdatedEvent.event, this.events.codebookUpdatedEvent.handler, false)
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
  createCodebookUpdatedEventHandler () {
    return (event) => {
      this.updateAnnotationForAssignment(() => {
        this.reloadTagsChosen()
        console.debug('Annotated content manager updated')
        LanguageUtils.dispatchCustomEvent(Events.annotatedContentManagerUpdated, { annotatedThemes: this.annotatedThemes })
      })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
import Theme from '../codebook/model/Theme'
// PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
    this.initThemeCreatedEvent()
    this.initThemeUpdatedEvent()
    this.initThemeRemovedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)
  initThemeCreatedEvent () {
    this.events.themeCreatedEvent = { element: document, event: Events.themeCreated, handler: this.themeCreatedEventHandler() }
    this.events.themeCreatedEvent.element.addEventListener(this.events.themeCreatedEvent.event, this.events.themeCreatedEvent.handler, false)
  }

  initThemeUpdatedEvent () {
    this.events.themeUpdatedEvent = { element: document, event: Events.themeUpdated, handler: this.themeUpdatedEventHandler() }
    this.events.themeUpdatedEvent.element.addEventListener(this.events.themeUpdatedEvent.event, this.events.themeUpdatedEvent.handler, false)
  }

  initThemeRemovedEvent () {
    this.events.themeRemovedEvent = { element: document, event: Events.themeRemoved, handler: this.themeRemovedEventHandler() }
    this.events.themeRemovedEvent.element.addEventListener(this.events.themeRemovedEvent.event, this.events.themeRemovedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      // remove relations where the removed concept appears
      this.relationships = _.filter(this.relationships, (relation) => {
        return !(relation.fromConcept.id === theme.id || relation.toConcept.id === theme.id)
      })
      LanguageUtils.dispatchCustomEvent(Events.relationshipsLoaded, {})
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
          // Retrieve current annotatedThemes
          this.createRelationships(() => {
            LanguageUtils.dispatchCustomEvent(Events.relationshipsLoaded, {})
            console.debug('Updated annotations for assignment')
          })
          // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate,LINE)

  themeCreatedEventHandler () {
    return (event) => {
      // retrieve theme object
      let theme = Theme.fromAnnotation(event.detail.newThemeAnnotation, window.abwa.codebookManager.codebookReader.codebook)
      let conceptEvidenceAnnotation = _.filter(window.abwa.annotationManagement.annotationReader.groupClassifiyingAnnotations, (annotation) => {
        return annotation.body[0].value.id === theme.id
      })
      let concept = new Concept(theme, conceptEvidenceAnnotation)
      this.concepts.push(concept)
    }
  }

  themeRemovedEventHandler () {
    return (event) => {
      // remove concept
      let theme = event.detail.theme
      // remove concept
      this.concepts = _.filter(this.concepts, (concept) => {
        return !(concept.theme.id === theme.id)
      })
      // PVSCL:IFCOND(Linking, LINE)
          // Retrieve current annotatedThemes
          this.createRelationships(() => {
            LanguageUtils.dispatchCustomEvent(Events.relationshipsLoaded, {})
            console.debug('Updated annotations for assignment')
          })
          // PVSCL:ENDCOND        }
      })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
  codebookUpdated: 'codebookUpdated',
  createTheme: 'createTheme',
  themeCreated: 'themeCreated',
  removeTheme: 'removeTheme',
  themeRemoved: 'themeRemoved',
  updateTheme: 'updateTheme',
  themeUpdated: 'themeUpdated',
  // PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND  // PVSCL:ENDCOND