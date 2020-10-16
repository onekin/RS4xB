// PVSCL:IFCOND(TopicBased, LINE)

  static fromTopic (topicName) {
    let annotationGuide = new Codebook({ name: topicName + 'concept map' })
    let theme = new Theme({ name: topicName, description: 'Topic of the concept map', isTopic: true, annotationGuide })
    annotationGuide.themes.push(theme)
    return annotationGuide
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(TopicBased) */,
    isTopic = false/* PVSCL:ENDCOND */// PVSCL:IFCOND(TopicBased, LINE)
    this.isTopic = isTopic
    // PVSCL:ENDCOND/* PVSCL:IFCOND(TopicBased) */,
        isTopic: this.isTopic/* PVSCL:ENDCOND */// PVSCL:IFCOND(TopicBased,LINE)
        let isTopic = config.isTopic
        // PVSCL:ENDCOND/* PVSCL:IFCOND(TopicBased) */,
          isTopic/* PVSCL:ENDCOND *//* PVSCL:IFCOND(TopicBased) */,
      isTopic: this.isTopic/* PVSCL:ENDCOND */import _ from 'lodash'
import Alerts from '../../../../utils/Alerts'
import Codebook from '../../../model/Codebook'

class TopicBased {
  static createDefaultAnnotations (topic, callback) {
    Codebook.setAnnotationServer(null, (annotationServer) => {
      // Create annotation guide from user defined topic
      let annotationGuide = Codebook.fromTopic(topic)
      annotationGuide.annotationServer = annotationServer
      let annotations = annotationGuide.toAnnotations()
      window.abwa.annotationServerManager.client.createNewAnnotations(annotations, (err, newAnnotations) => {
        if (err) {
          Alerts.errorAlert({ text: 'Unable to create required configuration for Dynamic highlighter. Please, try it again.' }) // TODO i18n
        } else {
          // Open the sidebar, to notify user that the annotator is correctly created
          window.abwa.sidebar.openSidebar()
          if (_.isFunction(callback)) {
            callback(null, newAnnotations)
          }
        }
      })
    })
  }
}

export default TopicBased
TopicBased.js// PVSCL:IFCOND(TopicBased, LINE)
import TopicBased from './topicBased/TopicBased'
// PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
        let topic = event.detail.topic
        if (howCreate === 'topicBased') {
          TopicBased.createDefaultAnnotations(topic, (err, annotations) => {
            if (err) {
              reject(err)
            } else {
              resolve(annotations)
            }
          })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            const currentGroupFullName = window.abwa.groupSelector.groupFullName || ''
            // PVSCL:ELSECOND
            const currentGroupName = window.abwa.groupSelector.currentGroup.name || ''
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
            // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'topicBased', topic: currentGroupFullName })
            resolve()
            // PVSCL:ELSECOND
            // PVSCL:IFCOND(CodebookUpdate, LINE)
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
            // PVSCL:ENDCOND            // PVSCL:ELSECOND
            // If codebook is not updateable, it is necessary to create the default one, as otherwise the user can select empty codebook and get an unusable configuration
            LanguageUtils.dispatchCustomEvent(Events.createCodebook, { howCreate: 'builtIn' })
            resolve()
            // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
    const rootTheme = this.getTopicTheme()
    themes = this.filterTopicTheme()
    // PVSCL:ELSECOND
    themes = this.codebook.themes
    // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased,LINE)
    if (rootTheme) {
      themeButtonContainer = this.createThemeButtonContainer(rootTheme)
      if (_.isElement(themeButtonContainer)) {
        this.buttonContainer.append(themeButtonContainer)
      }
    }
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
      // PVSCL:ENDCOND      // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)

  getTopicTheme () {
    let themes = this.codebook.themes
    return _.find(themes, (theme) => { return theme.isTopic === true })
  }

  filterTopicTheme () {
    let themes = this.codebook.themes
    return themes.filter((theme) => { return theme.isTopic === false })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
      title = 'Rename concept map ' + codebook.name
      // PVSCL:ELSECOND
      title = 'Rename review model ' + codebook.name
      // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
          if (theme.isTopic) {
            themeToUpdate = new Theme({ name: themeName, description: themeDescription, isTopic: true, annotationGuide: window.abwa.codebookManager.codebookReader.codebook })
          } else {
            themeToUpdate = new Theme({ name: themeName, description: themeDescription, annotationGuide: window.abwa.codebookManager.codebookReader.codebook })
          }
          // PVSCL:ELSECOND
          themeToUpdate = new Theme({ name: themeName, description: themeDescription, annotationGuide: window.abwa.codebookManager.codebookReader.codebook })
          // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased,LINE)
    this.groupFullName = null
    // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                  title = 'What is the topic or the focus question of the concept map?'
                  // PVSCL:ELSECOND
                  title = 'You do not have a group to start annotating, please provide a group name to get started.'
                  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                  inputPlaceholder = 'Type here the topic of the map...'
                  // PVSCL:ELSECOND
                  inputPlaceholder = 'Type here the name of the group...'
                  // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                          this.groupFullName = groupName
                          console.log(groupName)
                          groupName = groupName.substring(0, 24)
                          console.log(groupName)
                          return groupName
                          // PVSCL:ELSECOND
                          const swal = require('sweetalert2')
                          swal.showValidationMessage('The name cannot be higher than 25 characters.')
                          // PVSCL:ENDCOND// PVSCL:IFCOND(TopicBased, LINE)
                          this.groupFullName = groupName
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
            // PVSCL:ENDCOND