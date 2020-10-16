// PVSCL:IFCOND(Hierarchy, LINE)
import Code from '../../codebook/model/Code'
// PVSCL:ENDCOND/* PVSCL:IFCOND(Hierarchy) */LanguageUtils.isInstanceOf(code,  Code) || /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
    if (LanguageUtils.isInstanceOf(code, Code)) {
      tooltip += 'Code ' + code.name + ' for theme ' + code.theme.name
    } else {
      if (code) {
        tooltip += Config.tags.grouped.group.toString().trim().replace(/^\w/, c => c.toUpperCase()) + ': ' + code.name
      } else {
        tooltip += 'Deleted theme or code: ' + this.value.name
      }
    }
    // PVSCL:ELSECOND
    if (code) {
      tooltip += Config.tags.grouped.group.toString().trim().replace(/^\w/, c => c.toUpperCase()) + ': ' + code.name
    } else {
      tooltip += 'Deleted ' + Config.tags.grouped.group + ': ' + this.value.name
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
              if (body.value.id === codeId || (body.value.theme && body.value.theme.id === codeId)) {
                return true
              }
              // PVSCL:ELSECOND
              return body.value.id === codeId
              // PVSCL:ENDCONDimport jsYaml from 'js-yaml'
import _ from 'lodash'
import Config from '../../Config'
import LanguageUtils from '../../utils/LanguageUtils'

class Code {
  constructor ({
    id,
    name,
    description = '',
    createdDate = new Date(),
    color, theme/* PVSCL:IFCOND(MoodleProvider) */,

  }) {
    this.id = id
    this.name = name
    this.color = color
    this.theme = theme
    this.description = description
    if (LanguageUtils.isInstanceOf(createdDate, Date)) {
      this.createdDate = createdDate
    } else {
      const timestamp = Date.parse(createdDate)
      if (_.isNumber(timestamp)) {
        this.createdDate = new Date(createdDate)
      }
    }
    // PVSCL:IFCOND(MoodleProvider, LINE)

  }

  toAnnotations () {
    return [this.toAnnotation()]
  }

  toAnnotation () {
    const codeTag = Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + this.name
    const isCodeOfTag = Config.namespace + ':' + Config.tags.grouped.relation + ':' + this.theme.name
    const motivationTag = Config.namespace + ':' + Config.tags.motivation + ':' + 'codebookDevelopment'
    const tags = [codeTag, isCodeOfTag, motivationTag]
    // PVSCL:IFCOND(MoodleProvider, LINE)

    return {
      id: this.id,
      group: this.theme.annotationGuide.annotationServer.getGroupId(),
      permissions: {
        read: ['group:' + this.theme.annotationGuide.annotationServer.getGroupId()]
      },
      motivation: 'codebookDevelopment',
      references: [],
      tags: tags,
      target: [],
      text: jsYaml.dump({ id: this.id || '', description: this.description }),
      uri: this.theme.annotationGuide.annotationServer.getGroupUrl()
    }
  }

  getTags () {
    return [Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + this.name, Config.namespace + ':' + Config.tags.grouped.relation + ':' + this.theme.name]
  }

  static fromAnnotations () {
    // TODO Xabi
  }

  static fromAnnotation (annotation, theme = {}) {
    const codeTag = _.find(annotation.tags, (tag) => {
      return tag.includes(Config.namespace + ':' + Config.tags.grouped.subgroup + ':')
    })
    if (_.isString(codeTag)) {
      const name = codeTag.replace(Config.namespace + ':' + Config.tags.grouped.subgroup + ':', '')
      const config = jsYaml.load(annotation.text)
      if (_.isObject(config)) {
        const description = config.description
        const id = annotation.id
        let codeToReturn
        // PVSCL:IFCOND(MoodleProvider, LINE)

        return codeToReturn
      } else {
        console.error('Unable to retrieve mark configuration from annotation')
      }
    } else {
      console.error('Unable to retrieve mark from annotation')
    }
  }

  toObject () {
    return {
      name: this.name,
      description: this.description,
      id: this.id,
      theme: this.theme.toObject()
    }
  }
  // PVSCL:IFCOND(MoodleProvider, LINE)

}

export default Code
Code.js// PVSCL:IFCOND(Hierarchy,LINE)
import Code from './Code'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
        const codeAnnotations = _.remove(annotations, (annotation) => {
          return _.some(annotation.tags, (tag) => {
            return tag.includes(Config.namespace + ':' + Config.tags.grouped.subgroup + ':')
          })
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
        for (let i = 0; i < codeAnnotations.length; i++) {
          const codeAnnotation = codeAnnotations[i]
          // Get theme corresponding to the level
          const themeTag = _.find(codeAnnotation.tags, (tag) => {
            return tag.includes(Config.namespace + ':' + Config.tags.grouped.relation + ':')
          })
          const themeName = themeTag.replace(Config.namespace + ':' + Config.tags.grouped.relation + ':', '')
          const theme = _.find(guide.themes, (theme) => {
            return theme.name === themeName
          })
          const code = Code.fromAnnotation(codeAnnotation, theme)
          if (LanguageUtils.isInstanceOf(theme, Theme)) {
            theme.codes.push(code)
          } else {
            console.debug('Code %s has no theme', code.name)
          }
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
      theme.codes = []
      if (_.isArray(themeDefinition.codes)) {
        for (let j = 0; j < themeDefinition.codes.length; j++) {
          const codeDefinition = themeDefinition.codes[j]
          const code = new Code({ name: codeDefinition.name, description: codeDefinition.description, theme: theme })
          theme.codes.push(code)
        }
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
          theme.multivalued = numberOfColumns > 1
          // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
          // Find codes
          if (sheet.data[0].rowData[1] && sheet.data[0].rowData[1].values) {
            // Get cells for codes
            const values = _.slice(sheet.data[0].rowData[1].values, 1, lastIndex)
            // For each cell
            for (let i = 0; i < themesArray.length; i++) {
              // Retrieve its facet
              const currentThemeName = themesArray[i]
              // If theme of current row is text and is a facet and is not already set the possible codes
              const currentTheme = _.find(themes, (facet) => { return facet.name === currentThemeName })
              if (_.isString(currentThemeName) && currentTheme && currentTheme.codes.length === 0) {
                // If cell has data validation "ONE_OF_LIST"
                if (_.isObject(values[i]) && _.isObject(values[i].dataValidation) && values[i].dataValidation.condition.type === 'ONE_OF_LIST') {
                  currentTheme.inductive = false
                  currentTheme.codes = _.map(values[i].dataValidation.condition.values, (value) => { return new Code({ name: value.userEnteredValue, theme: currentTheme }) })
                } else { // If cell has not data validation
                  currentTheme.inductive = true
                }
              }
            }
          }
          // PVSCL:ENDCOND/* PVSCL:IFCOND(Hierarchy) */ else {
      // Look for code inside themes
      for (let i = 0; i < this.themes.length; i++) {
        const theme = this.themes[i]
        const code = _.find(theme.codes, (code) => {
          return code.id === id
        })
        if (LanguageUtils.isInstanceOf(code, Code)) {
          themeOrCodeToReturn = code
        }
      }
    } /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
import Code from './Code'
// PVSCL:ENDCOND/* PVSCL:IFCOND(GoogleSheetProvider and Hierarchy) */,
    multivalued,
    inductive/* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy,LINE)
    this.codes = []
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    this.multivalued = multivalued
    this.inductive = inductive
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
    // Create its children annotations
    for (let i = 0; i < this.codes.length; i++) {
      annotations = annotations.concat(this.codes[i].toAnnotations())
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    if (this.multivalued) {
      tags.push(Config.namespace + ':' + Config.tags.statics.multivalued)
    }
    if (this.inductive) {
      tags.push(Config.namespace + ':' + Config.tags.statics.inductive)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    const multivaluedTag = _.find(annotation.tags, (tag) => {
      return tag.includes(Config.namespace + ':multivalued')
    })
    const inductiveTag = _.find(annotation.tags, (tag) => {
      return tag.includes(Config.namespace + ':inductive')
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
      // multivalued and inductive
      const multivalued = _.isString(multivaluedTag)
      const inductive = _.isString(inductiveTag)
      // PVSCL:ENDCOND/* PVSCL:IFCOND(GoogleSheetProvider and Hierarchy) */,
          multivalued,
          inductive/* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)

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
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    // Instance codes
    for (let i = 0; i < theme.codes.length; i++) {
      instancedTheme.codes[i] = Code.createCodeFromObject(theme.codes[i], instancedTheme)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
  getCodeByName (name) {
    if (_.isString(name)) {
      return this.codes.find(code => code.name === name)
    } else {
      return null
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
import Code from '../../../model/Code'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
          for (let j = 0; j < moodleCriteria.levels.length; j++) {
            const moodleLevel = moodleCriteria.levels[j]
            const level = new Code({ name: moodleLevel.score, id: moodleLevel.id, description: LanguageUtils.normalizeString(moodleLevel.definition), theme: criteria })
            criteria.codes.push(level)
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
import Code from '../../model/Code'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
    this.initCodeCreatedEvent()
    this.initCodeUpdatedEvent()
    this.initCodeRemovedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking AND NOT(Hierarchy) ,LINE)
    this.initRelationshipsLoadedEvent()
    this.initRelationshipAddedEvent()
    this.initRelationshipDeletedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking AND NOT(Hierarchy), LINE)

  initRelationshipsLoadedEvent () {
    this.events.relationshipsLoadedEvent = { element: document, event: Events.relationshipsLoaded, handler: this.relationshipsLoadedEventHandler() }
    this.events.relationshipsLoadedEvent.element.addEventListener(this.events.relationshipsLoadedEvent.event, this.events.relationshipsLoadedEvent.handler, false)
  }

  initRelationshipAddedEvent () {
    this.events.relationshipAddedEvent = { element: document, event: Events.relationshipAdded, handler: this.relationshipAddedEventHandler() }
    this.events.relationshipAddedEvent.element.addEventListener(this.events.relationshipAddedEvent.event, this.events.relationshipAddedEvent.handler, false)
  }

  initRelationshipDeletedEvent () {
    this.events.relationshipDeletedEvent = { element: document, event: Events.relationshipDeleted, handler: this.relationshipDeletedEventHandler() }
    this.events.relationshipDeletedEvent.element.addEventListener(this.events.relationshipDeletedEvent.event, this.events.relationshipDeletedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)

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
  // PVSCL:ENDCOND// PVSCL:IFCOND(Alphabetical, LINE)
        result = a.name.localeCompare(b.name)
        // PVSCL:ELSEIFCOND(Number, LINE)
        result = parseFloat(a.name) > parseFloat(b.name)
        // PVSCL:ELSEIFCOND(Date, LINE)
        // PVSCL:ENDCOND// PVSCL:IFCOND(Alphabetical, LINE)
      codes = codes.sort((a, b) => a.name.localeCompare(b.name))
      // PVSCL:ENDCOND// PVSCL:IFCOND(Number, LINE)
      codes = codes.sort((a, b) => parseFloat(a.name) - parseFloat(b.name))
      // PVSCL:ENDCOND// PVSCL:IFCOND(Date, LINE)
      codes = codes.sort((a, b) => a.createdDate - b.createdDate)
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
      let codes = theme.codes
      codes = codes.sort((a, b) => {
        let result
        // PVSCL:IFCOND(Alphabetical, LINE)
      codes = codes.sort((a, b) => a.name.localeCompare(b.name))
      // PVSCL:ENDCOND      // PVSCL:IFCOND(Number, LINE)
      codes = codes.sort((a, b) => parseFloat(a.name) - parseFloat(b.name))
      // PVSCL:ENDCOND      // PVSCL:IFCOND(Date, LINE)
      codes = codes.sort((a, b) => a.createdDate - b.createdDate)
      // PVSCL:ENDCOND      if (theme.codes.length > 0) {
        themeButtonContainer = this.createGroupedThemeButtonContainer(theme, codes)
      } else {
        themeButtonContainer = this.createThemeButtonContainer(theme)
      }
      // PVSCL:ELSECOND
      themeButtonContainer = this.createThemeButtonContainer(theme)
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
        // Set a color for each theme
        theme.color = ColorUtils.setAlphaToColor(color, Config.colors.minAlpha)
        // Set color gradient for each code
        const numberOfCodes = theme.codes.length
        theme.codes.forEach((code, j) => {
          const alphaForChild = (Config.colors.maxAlpha - Config.colors.minAlpha) / numberOfCodes * (j + 1) + Config.colors.minAlpha
          code.color = ColorUtils.setAlphaToColor(color, alphaForChild)
        })
        // PVSCL:ELSECOND
        theme.color = ColorUtils.setAlphaToColor(color, 0.5)
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
      items.createNewCode = { name: 'Create new code' }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
          if (key === 'createNewCode') {
            const theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              LanguageUtils.dispatchCustomEvent(Events.createCode, { theme: theme })
            }
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
        items.updateCode = { name: 'Modify code' }
        items.removeCode = { name: 'Remove code' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
        // items['pageAnnotation'] = {name: 'Page annotation'}
        // PVSCL:ENDCOND// PVSCL:IFCOND(CodebookUpdate, LINE)
            if (key === 'removeCode') {
              LanguageUtils.dispatchCustomEvent(Events.removeCode, { code: code })
            }
            if (key === 'updateCode') {
              LanguageUtils.dispatchCustomEvent(Events.updateCode, { code: code })
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
            // TODO Page level annotations, take into account that tags are necessary here (take into account Moodle related case)
            if (key === 'pageAnnotation') {
              Alerts.infoAlert({ text: 'If sidebar navigation is active, it is not possible to make page level annotations yet.' })
              /* let theme = this.codebook.getCodeOrThemeFromId(codeId)
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                theme: theme,
                codeId: theme.id
              }) */
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)

  /**
   * This function creates the codes right click context menu.
   */
  codeRightClickHandler () {
    return (codeId) => {
      // Get code from id
      const code = this.codebook.getCodeOrThemeFromId(codeId)
      if (LanguageUtils.isInstanceOf(code, Code)) {
        const items = {}
        // PVSCL:IFCOND(CodebookUpdate, LINE)
            if (key === 'removeCode') {
              LanguageUtils.dispatchCustomEvent(Events.removeCode, { code: code })
            }
            if (key === 'updateCode') {
              LanguageUtils.dispatchCustomEvent(Events.updateCode, { code: code })
            }
            // PVSCL:ENDCOND            // PVSCL:IFCOND(SidebarNavigation, LINE)
            // TODO Page level annotations, take into account that tags are necessary here (take into account Moodle related case)
            if (key === 'pageAnnotation') {
              Alerts.infoAlert({ text: 'If sidebar navigation is active, it is not possible to make page level annotations yet.' })
              /* let theme = this.codebook.getCodeOrThemeFromId(codeId)
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                theme: theme,
                codeId: theme.id
              }) */
            }
            // PVSCL:ENDCOND          },
          items: items
        }
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(Linking AND NOT(Hierarchy), LINE)

  relationshipsLoadedEventHandler () {
    return () => {
      let relations = window.abwa.mapContentManager.relationships
      for (let i = 0; i < relations.length; i++) {
        let relation = relations[i]
        // Get button
        let themeButton = document.querySelectorAll('.tagButton[data-code-id="' + relation.fromConcept.id + '"]')
        // Add relation to tooltip
        if (themeButton[0].title.includes('Relationships:')) {
          themeButton[0].title += '\n' + relation.linkingWord + ' ' + relation.toConcept.name
        } else {
          themeButton[0].title += '\nRelationships:\n' + relation.linkingWord + ' ' + relation.toConcept.name
        }
      }
    }
  }

  relationshipAddedEventHandler () {
    return (event) => {
      let relation = event.detail.relation
      let themeButton = document.querySelectorAll('.tagButton[data-code-id="' + relation.fromConcept.id + '"]')
      // Add relation to tooltip
      if (themeButton[0].title.includes('Relationships:')) {
        themeButton[0].title += '\n' + relation.linkingWord + ' ' + relation.toConcept.name
      } else {
        themeButton[0].title += '\nRelationships:\n' + relation.linkingWord + ' ' + relation.toConcept.name
      }
    }
  }

  relationshipDeletedEventHandler () {
    return (event) => {
      let relation = event.detail.relation
      let themeButton = document.querySelectorAll('.tagButton[data-code-id="' + relation.fromConcept.id + '"]')
      // Add relation to tooltip
      if (themeButton[0].title.includes('Relationships:')) {
        themeButton[0].title = themeButton[0].title.replace('\n' + relation.linkingWord + ' ' + relation.toConcept.name, '')
      }
      if (((themeButton[0].title.match(/\n/g)) || []).length === 1) {
        themeButton[0].title = themeButton[0].title.replace('\nRelationships:', '')
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
import Code from '../../model/Code'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
    this.initCreateCodeEvent()
    this.initRemoveCodeEvent()
    this.initUpdateCodeEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)

  initCreateCodeEvent (callback) {
    this.events.createCodeEvent = { element: document, event: Events.createCode, handler: this.createCodeEventHandler() }
    this.events.createCodeEvent.element.addEventListener(this.events.createCodeEvent.event, this.events.createCodeEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  initUpdateCodeEvent () {
    this.events.updateCodeEvent = { element: document, event: Events.updateCode, handler: this.createUpdateCodeEventHandler() }
    this.events.updateCodeEvent.element.addEventListener(this.events.updateCodeEvent.event, this.events.updateCodeEvent.handler, false)
  }

  initRemoveCodeEvent (callback) {
    this.events.removeCodeEvent = { element: document, event: Events.removeCode, handler: this.removeCodeEventHandler() }
    this.events.removeCodeEvent.element.addEventListener(this.events.removeCodeEvent.event, this.events.removeCodeEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
          theme.codes.forEach(code => { code.theme = themeToUpdate })
          themeToUpdate.codes = theme.codes
          // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)

  /**
   * This function creates a handler to create a new code when it receives the createCode event.
   * @return Events
   */
  createCodeEventHandler () {
    return (event) => {
      const theme = event.detail.theme
      if (!LanguageUtils.isInstanceOf(theme, Theme)) {
        Alerts.errorAlert({ text: 'Unable to create new code, theme is not defined.' })
      } else {
        let newCode // The code that the user is creating
        // Ask user for name and description
        Alerts.multipleInputAlert({
          title: 'You are creating a new code for theme: ',
          html: '<input autofocus class="formCodeName swal2-input" type="text" id="codeName" type="text" placeholder="Code name" value=""/>' +
            '<textarea class="formCodeDescription swal2-textarea" data-minchars="1" data-multiple rows="6" id="codeDescription" placeholder="Please type a description that describes this code..."></textarea>',
          preConfirm: () => {
            const codeNameElement = document.querySelector('#codeName')
            let codeName
            if (_.isElement(codeNameElement)) {
              codeName = codeNameElement.value
            }
            const codeDescriptionElement = document.querySelector('#codeDescription')
            let codeDescription
            if (_.isElement(codeDescriptionElement)) {
              codeDescription = codeDescriptionElement.value
            }
            newCode = new Code({ name: codeName, description: codeDescription, theme: theme })
          },
          callback: () => {
            const newCodeAnnotation = newCode.toAnnotation()
            window.abwa.annotationServerManager.client.createNewAnnotation(newCodeAnnotation, (err, annotation) => {
              if (err) {
                Alerts.errorAlert({ text: 'Unable to create the new code. Error: ' + err.toString() })
              } else {
                LanguageUtils.dispatchCustomEvent(Events.codeCreated, { newCodeAnnotation: annotation, theme: theme })
              }
            })
          }
        })
      }
    }
  }

  createUpdateCodeEventHandler () {
    return (event) => {
      const code = event.detail.code
      let codeToUpdate
      // Show form to update theme
      Alerts.multipleInputAlert({
        title: 'You are updating the code ' + code.name + 'pertaining to theme' + code.theme.name,
        html: '<input autofocus class="formCodeName swal2-input" type="text" id="codeName" type="text" placeholder="Code name" value="' + code.name + '"/>' +
          '<textarea class="formCodeDescription swal2-textarea" data-minchars="1" data-multiple rows="6" id="codeDescription" placeholder="Please type a description that describes this code...">' + code.description + '</textarea>',
        preConfirm: () => {
          const codeNameElement = document.querySelector('#codeName')
          let codeName
          if (_.isElement(codeNameElement)) {
            codeName = codeNameElement.value
          }
          const codeDescriptionElement = document.querySelector('#codeDescription')
          let codeDescription
          if (_.isElement(codeDescriptionElement)) {
            codeDescription = codeDescriptionElement.value
          }
          codeToUpdate = new Code({ name: codeName, description: codeDescription, theme: code.theme })
          codeToUpdate.id = code.id
        },
        callback: () => {
          // Update codebook
          this.updateCodebookCode(codeToUpdate)
          // Update all annotations done with this theme
          this.updateAnnotationsWithCode(codeToUpdate)
        }
      })
    }
  }

  updateCodebookCode (codeToUpdate, callback) {
    const annotationsToUpdate = codeToUpdate.toAnnotation()
    window.abwa.annotationServerManager.client.updateAnnotation(annotationsToUpdate.id, annotationsToUpdate, (err, annotation) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
        Alerts.errorAlert({ text: 'Unable to create the new code. Error: ' + err.toString() })
      } else {
        if (_.isFunction(callback)) {
          callback()
        }
        LanguageUtils.dispatchCustomEvent(Events.codeUpdated, { updatedCode: codeToUpdate })
      }
    })
  }

  updateAnnotationsWithCode () {

  }

  /**
   * This function creates a handler to remove a code when it receives the removeCode event.
   * @return Events
   */
  removeCodeEventHandler () {
    return (event) => {
      const code = event.detail.code
      // Ask user is sure to remove
      Alerts.confirmAlert({
        title: 'Removing code ' + code.name,
        text: 'Are you sure that you want to remove the code ' + code.name + '. You cannot undo this operation.',
        alertType: Alerts.alertType.warning,
        callback: () => {
          window.abwa.annotationServerManager.client.deleteAnnotation(code.id, (err, result) => {
            if (err) {
              Alerts.errorAlert({ text: 'Unexpected error when deleting the code.' })
            } else {
              LanguageUtils.dispatchCustomEvent(Events.codeRemoved, { code: code })
            }
          })
        }
      })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    promises.push(searchByTagPromise(Config.namespace + ':' + Config.tags.grouped.relation + ':' + theme.id))
    // PVSCL:ENDCOND/* PVSCL:IFCOND(Hierarchy, LINE) */
            if (classifyingBody.value.theme && classifyingBody.value.theme.id === theme.id) {
              const code = theme.codes.find(code => code.id === classifyingBody.value.id)
              if (code) {
                classifyingBody.value = code.toObject()
                return annotation
              }
            }
            /* PVSCL:ELSECOND */
            return null
            /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
import Code from '../codebook/model/Code'
// PVSCL:ENDCOND/* PVSCL:IFCOND(Hierarchy) */,  annotatedCodes = []/* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
    this.annotatedCodes = annotatedCodes
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)

export class AnnotatedCode {
  constructor ({ code = null, annotations = [] }) {
    this.code = code
    this.annotations = annotations
  }

  hasAnnotations () {
    return !(this.annotations.length === 0)
  }
}
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
    annotatedThemesStructure = _.map(window.abwa.codebookManager.codebookReader.codebook.themes, (theme) => {
      const codes = _.map(theme.codes, (code) => {
        return new AnnotatedCode({ code: code })
      })
      return new AnnotatedTheme({ theme: theme, annotatedCodes: codes })
    })
    // PVSCL:ELSECOND
    annotatedThemesStructure = _.map(window.abwa.codebookManager.codebookReader.codebook.themes, (theme) => {
      return new AnnotatedTheme({ theme: theme })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
      const childAnnotations = _.flatMap(themeOrCode.annotatedCodes.map(annotatedCode =>
        _.filter(annotatedCode.annotations, (annotation) => {
          return _.intersection(window.abwa.targetManager.getDocumentLink(), _.values(annotation.target[0].source))
        })))
      annotations = annotations.concat(childAnnotations)
      // PVSCL:ENDCOND/* PVSCL:IFCOND(Hierarchy) */else if (LanguageUtils.isInstanceOf(themeOrCode, AnnotatedCode)) {
      return _.filter(themeOrCode.annotations, (annotation) => {
        return _.intersection(window.abwa.targetManager.getDocumentLink(), _.values(annotation.target[0].source))
      })
    }/* PVSCL:ENDCOND *//* PVSCL:IFCOND(Hierarchy) */else if (LanguageUtils.isInstanceOf(themeOrCode, Code)) {
      // Return annotationCode with the codeId we need
      const annotatedTheme = _.find(annotatedThemesObject, (annotatedTheme) => {
        return annotatedTheme.theme.id === themeOrCode.theme.id
      })
      return _.find(annotatedTheme.annotatedCodes, (annotatedCode) => {
        return annotatedCode.code.id === themeOrCode.id
      })
    } /* PVSCL:ENDCOND */// PVSCL:IFCOND(Hierarchy, LINE)
        for (let j = 0; j < annotatedTheme.annotatedCodes.length; j++) {
          const annotatedCode = annotatedTheme.annotatedCodes[j]
          const annotatedCodeButton = document.querySelectorAll('.tagButton[data-code-id="' + annotatedCode.code.id + '"]')
          annotatedCodeButton[0].dataset.numberOfAnnotations = this.getAnnotationsDoneWithThemeOrCodeId(annotatedCode.code.id).length
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
                                if (code.theme) {
                                  const themeName = code.theme.name
                                  theme = codebook.getThemeByName(themeName)
                                } else {
                                  theme = codebook.getThemeByName(codeName)
                                }
                                // PVSCL:ELSECOND
                                theme = codebook.getThemeByName(codeName)
                                // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
                                if (code.theme) {
                                  codeOrTheme = theme.getCodeByName(codeName)
                                } else {
                                  codeOrTheme = theme
                                }
                                // PVSCL:ELSECOND
                                codeOrTheme = theme
                                // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
grouped.subgroup = 'code'
grouped.relation = 'isCodeOf'
// PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
  createCode: 'createCode',
  codeCreated: 'codeCreated',
  removeCode: 'removeCode',
  codeRemoved: 'codeRemoved',
  updateCode: 'updateCode',
  codeUpdated: 'codeUpdated',
  // PVSCL:ENDCOND