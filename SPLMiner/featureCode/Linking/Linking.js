// PVSCL:IFCOND(Linking, LINE)
import Linking from '../purposes/linking/Linking'
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
            if (deserializedAnnotation.body) {
              let bodyWithLinkingPurpose = deserializedAnnotation.getBodyForPurpose('linking')
              if (bodyWithLinkingPurpose) {
                LanguageUtils.dispatchCustomEvent(Events.linkAnnotationCreated, { annotation: deserializedAnnotation })
              }
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
    // Get body for classifying
    if (detail.purpose === 'linking') {
      if (detail.from && detail.to && detail.linkingWord) {
        let value = {}
        value.from = detail.from
        value.to = detail.to
        value.linkingWord = detail.linkingWord
        let linkingBody = new Linking({ value })
        body.push(linkingBody.serialize())
      }
    }
    // PVSCL:ENDCONDimport Body from '../Body'

class Linking extends Body {
  constructor ({ purpose = Linking.purpose, value }) {
    super(purpose)
    this.value = value
  }

  populate (value) {
    super.populate(value)
  }

  serialize () {
    return super.serialize()
  }

  static deserialize (obj) {
    let from = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(obj.from)
    let to = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(obj.to)
    let linkingWord = obj.linkingWord
    return new Linking({ from, to, linkingWord })
  }

  tooltip () {
    let from = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(this.value.from)
    let to = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(this.value.to)
    if (from && to) {
      return 'Linking: ' + from.name + ' ' + this.value.linkingWord + ' ' + to.name
    }
  }
}

Linking.purpose = 'linking'

export default Linking
Linking.jsimport LinkingForm from './LinkingForm'

class LinkingButton {
  static createNewLinkButton () {
    let newLinkingButton = document.createElement('button')
    newLinkingButton.innerText = 'New relation'
    newLinkingButton.id = 'newRelationButton'
    newLinkingButton.className = 'tagButton codingElement'
    newLinkingButton.addEventListener('click', () => {
      let annotation
      LinkingForm.showLinkingForm(null)
    })
    window.abwa.codebookManager.codebookReader.buttonContainer.append(newLinkingButton)
  }
}

export default LinkingButton
LinkingButton.js// const _ = require('lodash')
import $ from 'jquery'
import Alerts from '../../../utils/Alerts'
import LanguageUtils from '../../../utils/LanguageUtils'
import Events from '../../../Events'

class LinkingForm {
  /**
   *
   * @param annotation annotation that is involved
   * @param formCallback callback to execute after form is closed
   * @param addingHtml
   * @returns {Promise<unknown>}
   */
  static showLinkingForm (previousRelationshipData) {
    return new Promise(() => {
      // Close sidebar if opened
      window.abwa.sidebar.closeSidebar()
      let title = 'Creating new relation'
      // Get body for classifying
      let showForm = () => {
        // Create form
        let html = LinkingForm.generateLinkingFormHTML()
        let form = LinkingForm.generateLinkingForm(previousRelationshipData)
        Alerts.threeOptionsAlert({
          title: title || '',
          html: html,
          onBeforeOpen: form.onBeforeOpen,
          // position: Alerts.position.bottom, // TODO Must be check if it is better to show in bottom or not
          confirmButtonText: 'Save relationship',
          denyButtonText: 'Save & Create another',
          callback: form.callback,
          denyCallback: form.denyCallback,
          cancelCallback: form.cancelCallback,
          customClass: 'large-swal',
          preConfirm: form.preConfirm
        })
      }
      showForm()
    })
  }

  static generateLinkingForm (previousRelationshipData) {

    // On before open
    let onBeforeOpen
    onBeforeOpen = () => {
      if (!previousRelationshipData) {
        let retrievedLW
        // Get user selected content
        let selection = document.getSelection()
        // If selection is child of sidebar, return null
        if ($(selection.anchorNode).parents('#annotatorSidebarWrapper').toArray().length !== 0 || selection.toString().length < 1) {
          retrievedLW = ''
        } else {
          retrievedLW = selection.toString().trim()
        }
        onBeforeOpen.target = window.abwa.annotationManagement.annotationCreator.obtainTargetToCreateAnnotation({})
        document.querySelector('#inputLinkingWord').value = retrievedLW
      } else {
        onBeforeOpen.target = previousRelationshipData.target
        document.querySelector('#inputLinkingWord').value = previousRelationshipData.linkingWord
        document.querySelector('#categorizeDropdownFrom').value = previousRelationshipData.from
        document.querySelector('#categorizeDropdownTo').value = previousRelationshipData.to
      }
    }
    // Preconfirm
    let preConfirmData = {}
    let preConfirm = () => {
      let from = document.querySelector('#categorizeDropdownFrom').value
      preConfirmData.linkingWord = document.querySelector('#inputLinkingWord').value
      let to = document.querySelector('#categorizeDropdownTo').value
      preConfirmData.fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(from)
      preConfirmData.toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(to)
      if (from === to) {
        const swal = require('sweetalert2')
        swal.showValidationMessage('You have to make the relation between two different concepts.')
      }
    }
    // Callback
    let callback = () => {
      // TODO comprobar que no existe
      let tags = ['from' + ':' + preConfirmData.fromTheme.name]
      tags.push('linkingWord:' + preConfirmData.linkingWord)
      tags.push('to:' + preConfirmData.toTheme.name)
      LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
        purpose: 'linking',
        tags: tags,
        from: preConfirmData.fromTheme.id,
        to: preConfirmData.toTheme.id,
        linkingWord: preConfirmData.linkingWord,
        target: onBeforeOpen.target
      })
      Alerts.simpleSuccessAlert({ text: 'Saved' })
    }
    let denyCallback = () => {
      let from = document.querySelector('#categorizeDropdownFrom').value
      preConfirmData.linkingWord = document.querySelector('#inputLinkingWord').value
      let to = document.querySelector('#categorizeDropdownTo').value
      preConfirmData.fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(from)
      preConfirmData.toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(to)
      if (from === to) {
        const swal = require('sweetalert2')
        swal.showValidationMessage('You have to make the relation between two different concepts.')
      }
      let tags = ['from' + ':' + preConfirmData.fromTheme.name]
      tags.push('linkingWord:' + preConfirmData.linkingWord)
      tags.push('to:' + preConfirmData.toTheme.name)
      LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
        purpose: 'linking',
        tags: tags,
        from: preConfirmData.fromTheme.id,
        to: preConfirmData.toTheme.id,
        linkingWord: preConfirmData.linkingWord,
        target: onBeforeOpen.target
      })
      let returnToLinkingForm = () => {
        LinkingForm.showLinkingForm(relationshipData)
      }
      Alerts.simpleSuccessAlert({ text: 'Saved', callback: returnToLinkingForm })
      let relationshipData = {}
      relationshipData.target = onBeforeOpen.target
      relationshipData.from = preConfirmData.fromTheme.id
      relationshipData.to = preConfirmData.toTheme.id
      relationshipData.linkingWord = preConfirmData.linkingWord
    }
    let cancelCallback = () => {
      console.log('new link canceled')
    }
    return { onBeforeOpen: onBeforeOpen, preConfirm: preConfirm, callback: callback, denyCallback: denyCallback, cancelCallback: cancelCallback }
  }

  static generateLinkingFormHTML () {
    let html = ''

    // Create row
    let divRow = document.createElement('div')
    divRow.id = 'divFirstRow'
    divRow.id = 'divRow'

    /** FROM **/
    // Create div
    let divFrom = document.createElement('div')
    divFrom.id = 'divFrom'
    divFrom.className = 'rowElement'

    // Create span
    let fromSpan = document.createElement('span')
    fromSpan.className = 'linkingFormLabel'
    fromSpan.textContent = 'From: '

    // Create input
    let inputFrom = document.createElement('select')
    inputFrom.id = 'categorizeDropdownFrom'
    inputFrom.className = 'linkingConceptInput'
    inputFrom.placeholder = 'Select a concept'
    inputFrom.setAttribute('list', 'fromConcepts')

    // let fromConcepts = document.createElement('datalist')
    // fromConcepts.id = 'fromConcepts'

    divFrom.appendChild(fromSpan)
    divFrom.appendChild(inputFrom)

    /** LINKING WORD **/
    // Create div
    let divLinkingWord = document.createElement('div')
    divLinkingWord.id = 'divLinkingWord'
    divLinkingWord.className = 'rowElement'

    // Create span
    let linkingWordSpan = document.createElement('span')
    linkingWordSpan.className = 'linkingFormLabel'
    linkingWordSpan.textContent = ' Linking word: '

    // Create input
    let inputLinkingWord = document.createElement('input')
    inputLinkingWord.id = 'inputLinkingWord'

    divLinkingWord.appendChild(linkingWordSpan)
    divLinkingWord.appendChild(inputLinkingWord)

    /** TO **/
    // Create Div
    let divTo = document.createElement('div')
    divTo.id = 'divTo'
    divTo.className = 'rowElement'

    // Create span
    let toSpan = document.createElement('span')
    toSpan.className = 'linkingFormLabel'
    toSpan.textContent = ' To: '

    // Create input
    let inputTo = document.createElement('select')
    inputTo.id = 'categorizeDropdownTo'
    inputTo.className = 'linkingConceptInput'
    inputTo.placeholder = 'Select a concept'
    // inputTo.setAttribute('list', 'toConcepts')

    // let toConcepts = document.createElement('datalist')
    // toConcepts.id = 'toConcepts'

    divTo.appendChild(toSpan)
    divTo.appendChild(inputTo)

    window.abwa.codebookManager.codebookReader.codebook.themes.forEach(theme => {
      let fromOption = document.createElement('option')
      fromOption.value = theme.id
      fromOption.text = theme.name
      inputFrom.add(fromOption)
      if (!theme.isTopic) {
        let toOption = document.createElement('option')
        toOption.value = theme.id
        toOption.text = theme.name
        inputTo.add(toOption)
      }
    })

    divRow.appendChild(divFrom)
    divRow.appendChild(divLinkingWord)
    divRow.appendChild(divTo)

    // RENDER
    html += divRow.outerHTML

    return html
  }

}

export default LinkingForm
LinkingForm.jsimport _ from 'lodash'
import Alerts from '../../../utils/Alerts'
import LanguageUtils from '../../../utils/LanguageUtils'
import Events from '../../../Events'
import Annotation from '../../Annotation'
import Linking from './Linking'
import LinkingForm from './LinkingForm'

class LinkingManagementForm {

  static showLinkingManagementForm (concept, conceptRelations) {
    return new Promise((resolve, reject) => {
      // Close sidebar if opened
      window.abwa.sidebar.closeSidebar()
      let title = concept.name + ' relations'
      // Get body for classifying
      let showForm = () => {
        // Create form
        let html = LinkingManagementForm.generateLinkingManagementFormHTML(conceptRelations)
        let form = LinkingManagementForm.generateLinkingManagementForm(conceptRelations)
        Alerts.multipleInputAlert({
          title: title || '',
          html: html,
          onBeforeOpen: form.onBeforeOpen,
          customClass: 'large-swal',
          confirmButtonText: 'OK',
          showCancelButton: false
        })
      }
      showForm()
    })
  }

  // Generate linking form HTML
  static generateLinkingManagementFormHTML (conceptRelations) {

    let html = ''

    // CREATE HEADER
    let relationDivHeader = document.createElement('div')
    relationDivHeader.className = 'relationDivHeader'
    relationDivHeader.id = 'divSpanHeader'

    let fromSpanHeader = document.createElement('span')
    fromSpanHeader.className = 'relationFromPartSpan relationSpanHeader'
    fromSpanHeader.innerText = 'From'

    let lwSpanHeader = document.createElement('span')
    lwSpanHeader.className = 'relationLinkingWordSpan relationSpanHeader'
    lwSpanHeader.innerText = 'Linking word'

    let toSpanHeader = document.createElement('span')
    toSpanHeader.className = 'relationToSpan relationSpanHeader'
    toSpanHeader.innerText = 'To'

    relationDivHeader.appendChild(fromSpanHeader)
    relationDivHeader.appendChild(lwSpanHeader)
    relationDivHeader.appendChild(toSpanHeader)

    html += relationDivHeader.outerHTML + '<br>'

    // CREATE ROWS

    for (let i = 0; i < conceptRelations.length; i++) {
      let relation = conceptRelations[i]
      let relationDiv = document.createElement('div')
      relationDiv.className = 'relationDiv'
      relationDiv.id = 'div' + relation.id
      let fromSpan = document.createElement('span')
      fromSpan.className = 'relationFromPartSpan'
      fromSpan.innerText = relation.fromConcept.name

      let lwSpan = document.createElement('span')
      lwSpan.className = 'relationLinkingWordSpan'
      lwSpan.innerText = relation.linkingWord

      let toSpan = document.createElement('span')
      toSpan.className = 'relationToSpan'
      toSpan.innerText = relation.toConcept.name

      relationDiv.appendChild(fromSpan)
      relationDiv.appendChild(lwSpan)
      relationDiv.appendChild(toSpan)

      let deleteButton = document.createElement('button')
      deleteButton.title = 'Delete relation'
      deleteButton.innerText = ' Delete '
      deleteButton.id = 'dlt' + relation.id
      deleteButton.className = 'relationFormBtn'
      let editButton = document.createElement('button')
      editButton.title = 'Edit relation'
      editButton.innerText = ' Edit '
      editButton.id = 'edit' + relation.id
      editButton.className = 'relationFormBtn'
      let swapButton = document.createElement('button')
      swapButton.title = 'Swap relation'
      swapButton.innerText = ' Swap '
      swapButton.id = 'swap' + relation.id
      swapButton.className = 'relationFormBtn'

      relationDiv.appendChild(deleteButton)
      relationDiv.appendChild(editButton)
      relationDiv.appendChild(swapButton)
      html += relationDiv.outerHTML + '<br>'
    }
    return html
  }

  // Generates form functionalities
  static generateLinkingManagementForm (conceptRelations) {

    // On before open
    let onBeforeOpen
    onBeforeOpen = () => {
      for (let i = 0; i < conceptRelations.length; i++) {
        let relation = conceptRelations[i]
        let deleteRelation = '#dlt' + relation.id
        let editRelation = '#edit' + relation.id
        let swapRelation = '#swap' + relation.id

        document.querySelector(swapRelation).addEventListener('click', LinkingManagementForm.swapRelationshipButtonEventHandler())
        document.querySelector(editRelation).addEventListener('click', LinkingManagementForm.editRelationshipButtonEventHandler())
        document.querySelector(deleteRelation).addEventListener('click', LinkingManagementForm.deleteRelationshipButtonEventHandler())
      }
    }
    return { onBeforeOpen: onBeforeOpen }
  }

  // Swaps the from and to parts from the relationship
  static swapRelationshipButtonEventHandler () {
    return (event) => {
      let button = event.target
      let id = button.id.toString().replace('swap', '')
      // Retrieve data
      let relation = window.abwa.mapContentManager.findRelationshipById(id)
      let fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.fromConcept.id)
      let toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.toConcept.id)
      let linkingWord = relation.linkingWord
      Alerts.confirmAlert({
        title: 'Swap relationship',
        text: fromTheme.name + ' -> ' + linkingWord + ' -> ' + toTheme.name + ' will be changed to ' + toTheme.name + ' -> ' + linkingWord + ' -> ' + fromTheme.name + '. Do you want to confirm it?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        callback: () => {
          let data = []
          data.linkingWord = linkingWord
          data.fromTheme = toTheme
          data.toTheme = fromTheme
          LinkingManagementForm.updateRelationshipAnnotations(relation, data, () => {
            Alerts.simpleSuccessAlert({ text: 'Relationship swapped' })
          })
        },
        cancelCallback: () => {
          // Nothing to do
        }
      })
    }
  }

  static editRelationshipButtonEventHandler () {
    return (event) => {
      let button = event.target
      let relationId = button.id.toString().replace('edit', '')
      LinkingManagementForm.showUpdateLinkForm(relationId)
    }
  }

  static deleteRelationshipButtonEventHandler () {
    return (event) => {
      let button = event.target
      let id = button.id.toString().replace('dlt', '')
      // Retrieve data
      let relation = window.abwa.mapContentManager.findRelationshipById(id)
      let fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.fromConcept.id)
      let toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.toConcept.id)
      let linkingWord = relation.linkingWord
      Alerts.confirmAlert({
        alertType: Alerts.alertType.question,
        title: 'Delete relationship',
        text: 'Do you want to remove the following link?' + '\n' + fromTheme.name + ' -> ' + linkingWord + ' -> ' + toTheme.name,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        callback: () => {
          // Delete all the relationship annotations
          let linksId = _.map(relation.evidenceAnnotations, (annotation) => {
            return annotation.id
          })
          window.abwa.annotationServerManager.client.deleteAnnotations(linksId, (err) => {
            if (err) {
              Alerts.errorAlert({ text: 'Unexpected error when deleting the code.' })
            } else {
              LanguageUtils.dispatchCustomEvent(Events.annotationsDeleted, { annotations: relation.evidenceAnnotations })
              LanguageUtils.dispatchCustomEvent(Events.linkAnnotationDeleted, { relation: relation })
            }
          })
        }
      })
    }
  }

  static showUpdateLinkForm (relationId) {
    return new Promise(() => {
      // Close sidebar if opened
      window.abwa.sidebar.closeSidebar()
      let title = 'Updating relation'
      // Get body for classifying
      let showForm = () => {
        // Create form
        let html = LinkingForm.generateLinkingFormHTML()
        let form = LinkingManagementForm.generateUpdateLinkForm(relationId)
        Alerts.threeOptionsAlert({
          title: title || '',
          html: html,
          onBeforeOpen: form.onBeforeOpen,
          confirmButtonText: 'Update relationship',
          showDenyButton: false,
          callback: form.callback,
          cancelCallback: form.cancelCallback,
          customClass: 'large-swal',
          preConfirm: form.preConfirm
        })
      }
      showForm()
    })
  }

  static generateUpdateLinkForm (relationId) {
    let relation = window.abwa.mapContentManager.findRelationshipById(relationId)
    let fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.fromConcept.id)
    let toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(relation.toConcept.id)
    let linkingWord = relation.linkingWord
    // On before open
    let onBeforeOpen
    onBeforeOpen = () => {
      document.querySelector('#inputLinkingWord').value = linkingWord
      document.querySelector('#categorizeDropdownFrom').value = fromTheme.id
      document.querySelector('#categorizeDropdownTo').value = toTheme.id
    }
    // Preconfirm
    let preConfirmData = {}
    let preConfirm = () => {
      let from = document.querySelector('#categorizeDropdownFrom').value
      preConfirmData.linkingWord = document.querySelector('#inputLinkingWord').value
      let to = document.querySelector('#categorizeDropdownTo').value
      preConfirmData.fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(from)
      preConfirmData.toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(to)
      if (from === to) {
        const swal = require('sweetalert2')
        swal.showValidationMessage('You have to make the relation between two different concepts.')
      }
    }
    // Callback
    let callback = () => {
      // UPDATE ANNOTATIONS
      LinkingManagementForm.updateRelationshipAnnotations(relation, preConfirmData, () => {
        Alerts.simpleSuccessAlert({ text: 'Relationship updated' })
      })
    }
    let cancelCallback = () => {
      console.log('new link canceled')
    }
    return { onBeforeOpen: onBeforeOpen, preConfirm: preConfirm, callback: callback, cancelCallback: cancelCallback }
  }

  static updateRelationshipAnnotations (relation, data, callback) {
    // Retrieve relationship annotations
    let annotations = _.compact(relation.evidenceAnnotations)
    annotations = annotations.map(annotation => {
      const linkingBody = annotation.getBodyForPurpose(Linking.purpose)
      if (linkingBody) {
        console.log(linkingBody)
        let value = {}
        value.from = data.fromTheme.id
        value.to = data.toTheme.id
        value.linkingWord = data.linkingWord
        linkingBody.value = value
      }
      let tags = ['from' + ':' + data.fromTheme.name]
      tags.push('linkingWord:' + data.linkingWord)
      tags.push('to:' + data.toTheme.name)
      annotation.tags = tags
      return annotation
    })
    console.log(annotations)
    const promises = annotations.forEach((annotation) => {
      return new Promise((resolve, reject) => {
        window.abwa.annotationServerManager.client.updateAnnotation(annotation.id, annotation.serialize(), (err, annotation) => {
          if (err) {
            reject(err)
          } else {
            const deserializedAnnotation = Annotation.deserialize(annotation)
            LanguageUtils.dispatchCustomEvent(Events.annotationCreated, { annotation: deserializedAnnotation })
            LanguageUtils.dispatchCustomEvent(Events.linkAnnotationCreated, { annotation: deserializedAnnotation })
            resolve(annotation)
          }
        })
      })
    })
    Promise.all(promises || []).then(() => {
      LanguageUtils.dispatchCustomEvent(Events.annotationsDeleted, { annotations: relation.evidenceAnnotations })
      LanguageUtils.dispatchCustomEvent(Events.linkAnnotationDeleted, { relation: relation })
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }
}

export default LinkingManagementForm
LinkingManagementForm.js// PVSCL:IFCOND(Linking, LINE)
      // If annotation is linking annotation, add to linking annotation list
      if (annotation.body.purpose === 'linking') {
        this.linkingAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
        _.remove(this.groupLinkingAnnotations, (currentAnnotation) => {
          return currentAnnotation.id === annotation.id
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      // Annotation color is based on codebook color
      // Get annotated code id
      let bodyWithLinkingPurpose = annotation.getBodyForPurpose('linking')
      if (bodyWithLinkingPurpose) {
        const ColorUtils = require('../../utils/ColorUtils').default
        color = ColorUtils.getDefaultColor()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
import Linking from './purposes/linking/Linking'
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
        if (body.purpose === Linking.purpose) {
          // To remove the purpose from the annotation body
          let tempBody = JSON.parse(JSON.stringify(body))
          delete tempBody.purpose
          // Create new element of type Linking
          return new Linking({ value: tempBody.value })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
import Linking from './purposes/linking/Linking'
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
          if (annotation.body) {
            let linkingBody = annotation.getBodyForPurpose(Linking.purpose)
            if (linkingBody) {
              let fromTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingBody.value.from)
              let toTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingBody.value.to)
              let linkingWord = linkingBody.value.linkingWord
              // How many annotations?
              let relation = window.abwa.mapContentManager.findRelationship(fromTheme, toTheme, linkingWord)
              Alerts.confirmAlert({
                alertType: Alerts.alertType.question,
                title: 'Delete relationship',
                text: 'Do you want to remove the following link?' + '\n' + fromTheme.name + ' -> ' + linkingWord + ' -> ' + toTheme.name,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                callback: () => {
                  // Delete all the relationship annotations
                  let linkingsId = _.map(relation.evidenceAnnotations, (annotation) => { return annotation.id })
                  window.abwa.annotationServerManager.client.deleteAnnotations(linkingsId, (err, result) => {
                    if (err) {
                      Alerts.errorAlert({ text: 'Unexpected error when deleting the code.' })
                    } else {
                      LanguageUtils.dispatchCustomEvent(Events.annotationsDeleted, { annotations: relation.evidenceAnnotations })
                      LanguageUtils.dispatchCustomEvent(Events.linkAnnotationDeleted, { relation: relation })
                    }
                  })
                },
                cancelCallback: () => {
                  if (relation.evidenceAnnotations.length > 1) {
                    // If more than one relationship annotation, delete only the selected annotation
                    window.abwa.annotationServerManager.client.deleteAnnotation(annotation.id, (err, result) => {
                      if (err) {
                        // Unable to delete this annotation
                        console.error('Error while trying to delete annotation %s', annotation.id)
                      } else {
                        if (!result.deleted) {
                          // Alert user error happened
                          Alerts.errorAlert({ text: chrome.i18n.getMessage('errorDeletingHypothesisAnnotation') })
                        } else {
                          // Send annotation deleted event
                          LanguageUtils.dispatchCustomEvent(Events.annotationDeleted, { annotation: annotation })
                          LanguageUtils.dispatchCustomEvent(Events.linkAnnotationDeleted, { relation: relation })
                        }
                      }
                    })
                  } else {
                    // If there is only one annotation, save the relationship in another one without target
                    let target = window.abwa.annotationManagement.annotationCreator.obtainTargetToCreateAnnotation({})
                    annotation.target = target
                    LanguageUtils.dispatchCustomEvent(Events.updateAnnotation, { annotation: annotation })
                    LanguageUtils.dispatchCustomEvent(Events.linkAnnotationUpdated, { annotation: annotation })
                  }
                }
              })
            } else {
              // The annotation has not linking purpose
              // Delete annotation
              window.abwa.annotationServerManager.client.deleteAnnotation(annotation.id, (err, result) => {
                if (err) {
                  // Unable to delete this annotation
                  console.error('Error while trying to delete annotation %s', annotation.id)
                } else {
                  if (!result.deleted) {
                    // Alert user error happened
                    Alerts.errorAlert({ text: chrome.i18n.getMessage('errorDeletingHypothesisAnnotation') })
                  } else {
                    // Send annotation deleted event
                    LanguageUtils.dispatchCustomEvent(Events.annotationDeleted, { annotation: annotation })
                  }
                }
              })
            }
          }
          // PVSCL:ELSECOND
          // Delete annotation
          window.abwa.annotationServerManager.client.deleteAnnotation(annotation.id, (err, result) => {
            if (err) {
              // Unable to delete this annotation
              console.error('Error while trying to delete annotation %s', annotation.id)
            } else {
              if (!result.deleted) {
                // Alert user error happened
                Alerts.errorAlert({ text: chrome.i18n.getMessage('errorDeletingHypothesisAnnotation') })
              } else {
                // Send annotation deleted event
                LanguageUtils.dispatchCustomEvent(Events.annotationDeleted, { annotation: annotation })
              }
            }
          })
          // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
import LinkingButton from '../../../annotationManagement/purposes/linking/LinkingButton'
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
    LinkingButton.createNewLinkButton()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
        items.manageRelationships = { name: 'Manage links' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
        items.manageRelationships = { name: 'Manage links' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
      items.manageRelationships = { name: 'Manage links' }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
          if (key === 'manageRelationships') {
            let theme = this.codebook.getCodeOrThemeFromId(themeId)
            if (LanguageUtils.isInstanceOf(theme, Theme)) {
              window.abwa.mapContentManager.manageRelationships(theme)
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
          let groupLinkingAnnotations = window.abwa.annotationManagement.annotationReader.groupLinkingAnnotations
          let linkingAnnotationToRemove = _.filter(groupLinkingAnnotations, (linkingAnnotation) => {
            let linkingBody = linkingAnnotation.body[0]
            return linkingBody.value.from.id === theme.id || linkingBody.value.to === theme.id
          })
          console.log(linkingAnnotationToRemove)
          let linkingsId = _.map(linkingAnnotationToRemove, (annotation) => { return annotation.id })
          if (_.every(linkingsId, _.isString)) {
            annotationsToDelete = annotationsToDelete.concat(linkingsId)
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
import Linking from '../annotationManagement/purposes/linking/Linking'
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      let contentAnnotations = _.filter(allAnnotations, (annotation) => {
        if (annotation.body.length > 0) {
          return !LanguageUtils.isInstanceOf(annotation.body[0], Linking)
        }
      })
      resolve(contentAnnotations)
      // PVSCL:ELSECOND
      resolve(allAnnotations)
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
import LinkingManagementForm from '../annotationManagement/purposes/linking/LinkingManagementForm'
import Alerts from '../utils/Alerts'
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)

export class Relationship {
  constructor (id = null, fromConcept = null, toConcept = null, linkingWord = '', annotations = []) {
    this.id = id
    this.fromConcept = fromConcept
    this.toConcept = toConcept
    this.linkingWord = linkingWord
    this.evidenceAnnotations = annotations
  }
}
// PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
    this.relationships = []
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)
    this.initLinkAnnotationCreatedEvent()
    this.initLinkAnnotationDeletedEvent()
    this.initLinkAnnotationUpdatedEvent()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking,LINE)

  initLinkAnnotationCreatedEvent () {
    this.events.linkAnnotationCreatedEvent = { element: document, event: Events.linkAnnotationCreated, handler: this.linkAnnotationCreatedEventHandler() }
    this.events.linkAnnotationCreatedEvent.element.addEventListener(this.events.linkAnnotationCreatedEvent.event, this.events.linkAnnotationCreatedEvent.handler, false)
  }

  initLinkAnnotationDeletedEvent () {
    this.events.linkAnnotationDeletedEvent = { element: document, event: Events.linkAnnotationDeleted, handler: this.linkAnnotationDeletedEventHandler() }
    this.events.linkAnnotationDeletedEvent.element.addEventListener(this.events.linkAnnotationDeletedEvent.event, this.events.linkAnnotationDeletedEvent.handler, false)
  }

  initLinkAnnotationUpdatedEvent () {
    this.events.linkAnnotationUpdatedEvent = { element: document, event: Events.linkAnnotationUpdated, handler: this.linkAnnotationUpdatedEventHandler() }
    this.events.linkAnnotationUpdatedEvent.element.addEventListener(this.events.linkAnnotationUpdatedEvent.event, this.events.linkAnnotationUpdatedEvent.handler, false)
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
        // Retrieve current annotatedThemes
        this.createRelationships(() => {
          LanguageUtils.dispatchCustomEvent(Events.relationshipsLoaded, {})
          console.debug('Updated annotations for assignment')
          // Callback
          if (_.isFunction(callback)) {
            callback()
          }
        })
        // PVSCL:ELSECOND
        if (_.isFunction(callback)) {
          callback()
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
          // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)

  createRelationships (callback) {
    this.relationships = []
    let linkingAnnotations = window.abwa.annotationManagement.annotationReader.groupLinkingAnnotations
    for (let i = 0; i < linkingAnnotations.length; i++) {
      let linkAnnotation = linkingAnnotations[i]
      let linkingObject = linkAnnotation.body[0]
      let from = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.from)
      let to = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.to)
      let linkingWord = linkingObject.value.linkingWord
      let relation = this.findRelationship(from, to, linkingWord)
      if (relation) {
        relation.evidenceAnnotations.push(linkAnnotation)
      } else {
        let newRelation = new Relationship(linkAnnotation.id, from, to, linkingWord, [])
        newRelation.evidenceAnnotations.push(linkAnnotation)
        this.relationships.push(newRelation)
      }
    }
    if (_.isFunction(callback)) {
      callback(null)
    }
  }

  findRelationship (from, to, linkingWord) {
    let relationship = _.find(this.relationships, (relation) => {
      return relation.fromConcept === from && relation.toConcept === to && relation.linkingWord === linkingWord
    })
    return relationship
  }

  findRelationshipById (id) {
    let relationship = _.find(this.relationships, (relation) => {
      return relation.id === id
    })
    return relationship
  }

  manageRelationships (concept) {
    this.getConceptRelationships(concept.id, (conceptRelationships) => {
      console.log(conceptRelationships)
      if (conceptRelationships.length === 0) {
        Alerts.errorAlert({ text: 'You do not have links from the ' + concept.name + ' concept.' })
      } else {
        LinkingManagementForm.showLinkingManagementForm(concept, conceptRelationships, () => {
          //
        })
      }
    })
  }

  getConceptRelationships (conceptId, callback) {
    let conceptRelationships = _.filter(this.relationships, (relation) => {
      return relation.fromConcept.id === conceptId
    })
    if (_.isFunction(callback)) {
      callback(conceptRelationships)
    }
  }

  linkAnnotationCreatedEventHandler () {
    return (event) => {
      let linkAnnotation = event.detail.annotation
      let linkingObject = linkAnnotation.body[0]
      let from = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.from)
      let to = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.to)
      let linkingWord = linkingObject.value.linkingWord
      let relation = this.findRelationship(from, to, linkingWord)
      if (relation) {
        relation.evidenceAnnotations.push(linkAnnotation)
      } else {
        let newRelation = new Relationship(linkAnnotation.id, from, to, linkingWord, [])
        newRelation.evidenceAnnotations.push(linkAnnotation)
        this.relationships.push(newRelation)
        LanguageUtils.dispatchCustomEvent(Events.relationshipAdded, { relation: newRelation })
      }
    }
  }

  linkAnnotationDeletedEventHandler () {
    return (event) => {
      let removedRelation = event.detail.relation
      _.remove(this.relationships, (relation) => {
        return relation === removedRelation
      })
      LanguageUtils.dispatchCustomEvent(Events.relationshipDeleted, { relation: removedRelation })
    }
  }

  linkAnnotationUpdatedEventHandler () {
    return (event) => {
      let linkAnnotation = event.detail.annotation
      let linkingObject = linkAnnotation.body[0]
      let from = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.from)
      let to = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(linkingObject.value.to)
      let linkingWord = linkingObject.value.linkingWord
      let relation = this.findRelationship(from, to, linkingWord)
      if (relation) {
        relation.evidenceAnnotations = []
        relation.evidenceAnnotations.push(linkAnnotation)
        LanguageUtils.dispatchCustomEvent(Events.relationshipUpdated, { relation: relation })
      } else {
        // No updated
      }
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


MapContentManager.js// PVSCL:IFCOND(Linking, LINE)
    let relationships = window.abwa.mapContentManager.relationships
    // Prepare linking phrases for doing conections
    let linkingPhrases = []
    for (let i = 0; i < relationships.length; i++) {
      let relation = relationships[i]
      let linkingPhrase = this.findLinkingPhrase(linkingPhrases, relation)
      if (linkingPhrase) {
        if (!linkingPhrase.fromConcepts.includes(relation.fromConcept.id)) {
          linkingPhrase.fromConcepts.push(relation.fromConcept.id)
        }
        if (!linkingPhrase.toConcepts.includes(relation.toConcept.id)) {
          linkingPhrase.toConcepts.push(relation.toConcept.id)
        }
        linkingPhrase.evidenceAnnotations = linkingPhrase.evidenceAnnotations.concat(relation.evidenceAnnotations)
      } else {
        let linkingPhraseToAdd = new LinkingPhrase(relation.linkingWord, relation.id)
        linkingPhraseToAdd.fromConcepts.push(relation.fromConcept.id)
        linkingPhraseToAdd.toConcepts.push(relation.toConcept.id)
        linkingPhraseToAdd.evidenceAnnotations = linkingPhraseToAdd.evidenceAnnotations.concat(relation.evidenceAnnotations)
        linkingPhrases.push(linkingPhraseToAdd)
      }
    }

    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)

    // linking phrase list
    let linkingPhraseList = xmlDoc.createElement('linking-phrase-list')
    map.appendChild(linkingPhraseList)

    // connection list
    let connectionList = xmlDoc.createElement('connection-list')
    map.appendChild(connectionList)
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)

    // linking appearance list
    let linkingAppearanceList = xmlDoc.createElement('linking-phrase-appearance-list')
    map.appendChild(linkingAppearanceList)

    // connection appearance list
    let connectionAppearanceList = xmlDoc.createElement('connection-appearance-list')
    map.appendChild(connectionAppearanceList)
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)

    // Add linking phrase
    let connectionID = 1
    for (let i = 0; i < linkingPhrases.length; i++) {
      // Linking phrase
      let linkingPhrase = linkingPhrases[i]
      let linkingElement = xmlDoc.createElement('linking-phrase')
      let id = document.createAttribute('id')
      let elementID = linkingPhrase.id
      id.value = elementID
      linkingElement.setAttributeNode(id)
      let label = document.createAttribute('label')
      label.value = linkingPhrase.linkingWord
      linkingElement.setAttributeNode(label)
      linkingPhraseList.appendChild(linkingElement)
      let linkingAppearance = xmlDoc.createElement('linking-phrase-appearance')
      id = document.createAttribute('id')
      id.value = linkingPhrase.id
      linkingAppearance.setAttributeNode(id)
      linkingAppearanceList.appendChild(linkingAppearance)
      if (linkingPhrase.evidenceAnnotations.length > 0) {
        for (let j = 0; j < linkingPhrase.evidenceAnnotations.length; j++) {
          let annotation = linkingPhrase.evidenceAnnotations[j]
          if (annotation.target) {
            if (annotation.target.length > 0) {
              let name
              let fromName = annotation.tags[0].replace('from:', '')
              let toName = annotation.tags[2].replace('to:', '')
              if (i === 0) {
                name = LanguageUtils.camelize(fromName) + '_To_' + LanguageUtils.camelize(toName)
              } else {
                name = LanguageUtils.camelize(fromName) + '_To_' + LanguageUtils.camelize(toName + i)
              }
              let url
              if (evidenceAnnotations === 'hypothesis') {
                url = new HypothesisURL({ elementID, name, annotation })
              } else if (evidenceAnnotations === 'tool') {
                url = new ToolURL({ elementID, name, annotation })
              }
              urlFiles.push(url)
            }
          }
        }
      }
      // Connection
      // From
      for (let i = 0; i < linkingPhrase.fromConcepts.length; i++) {
        let fromConceptID = linkingPhrase.fromConcepts[i]
        let connectionElement = xmlDoc.createElement('connection')
        id = document.createAttribute('id')
        id.value = connectionID.toString()
        connectionElement.setAttributeNode(id)
        let fromID = document.createAttribute('from-id')
        fromID.value = fromConceptID
        connectionElement.setAttributeNode(fromID)
        let toID = document.createAttribute('to-id')
        toID.value = linkingPhrase.id
        connectionElement.setAttributeNode(toID)
        connectionList.appendChild(connectionElement)
        let connectionAppearanceElement = xmlDoc.createElement('connection-appearance')
        id = document.createAttribute('id')
        id.value = connectionID.toString()
        connectionAppearanceElement.setAttributeNode(id)
        let fromPos = document.createAttribute('from-pos')
        fromPos.value = 'center'
        connectionAppearanceElement.setAttributeNode(fromPos)
        let toPos = document.createAttribute('to-pos')
        toPos.value = 'center'
        connectionAppearanceElement.setAttributeNode(toPos)
        let arrow = document.createAttribute('arrowhead')
        arrow.value = 'yes'
        connectionAppearanceElement.setAttributeNode(arrow)
        connectionAppearanceList.appendChild(connectionAppearanceElement)
        connectionID++
      }

      for (let i = 0; i < linkingPhrase.toConcepts.length; i++) {
        let toConceptID = linkingPhrase.toConcepts[i]
        let connectionElement = xmlDoc.createElement('connection')
        id = document.createAttribute('id')
        id.value = connectionID.toString()
        connectionElement.setAttributeNode(id)
        let fromID = document.createAttribute('from-id')
        fromID.value = linkingPhrase.id
        connectionElement.setAttributeNode(fromID)
        let toID = document.createAttribute('to-id')
        toID.value = toConceptID
        connectionElement.setAttributeNode(toID)
        connectionList.appendChild(connectionElement)
        let connectionAppearanceElement = xmlDoc.createElement('connection-appearance')
        id = document.createAttribute('id')
        id.value = connectionID.toString()
        connectionAppearanceElement.setAttributeNode(id)
        let fromPos = document.createAttribute('from-pos')
        fromPos.value = 'center'
        connectionAppearanceElement.setAttributeNode(fromPos)
        let toPos = document.createAttribute('to-pos')
        toPos.value = 'center'
        connectionAppearanceElement.setAttributeNode(toPos)
        let arrow = document.createAttribute('arrowhead')
        arrow.value = 'yes'
        connectionAppearanceElement.setAttributeNode(arrow)
        connectionAppearanceList.appendChild(connectionAppearanceElement)
        connectionID++
      }
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
                              let linkingPhraseList = cxlObject.getElementsByTagName('linking-phrase-list')[0]
                              let connectionList = cxlObject.getElementsByTagName('connection-list')[0]
                              if (linkingPhraseList) {
                                for (let i = 0; i < linkingPhraseList.childNodes.length; i++) {
                                  let linkingPhrase = linkingPhraseList.childNodes[i]
                                  let linkingPhraseName = linkingPhrase.getAttribute('label')
                                  let linkingPhraseId = linkingPhrase.getAttribute('id')
                                  let fromConcepts = _.filter(connectionList.childNodes, (connectionNode) => {
                                    return connectionNode.getAttribute('to-id') === linkingPhraseId
                                  })
                                  let toConcepts = _.filter(connectionList.childNodes, (connectionNode) => {
                                    return connectionNode.getAttribute('from-id') === linkingPhraseId
                                  })
                                  for (let j = 0; j < fromConcepts.length; j++) {
                                    let fromPreviousConceptId = fromConcepts[j].getAttribute('from-id')
                                    let fromName = this.getConceptNameFromCXL(conceptList, fromPreviousConceptId)
                                    for (let k = 0; k < toConcepts.length; k++) {
                                      let toPreviousConceptId = toConcepts[k].getAttribute('to-id')
                                      let toName = this.getConceptNameFromCXL(conceptList, toPreviousConceptId)
                                      // Tags information
                                      let tags = ['from' + ':' + fromName]
                                      tags.push('linkingWord:' + linkingPhraseName)
                                      tags.push('to:' + toName)
                                      let target = window.abwa.annotationManagement.annotationCreator.obtainTargetToCreateAnnotation({})
                                      // Body information
                                      let fromId = codebook.getThemeByName(fromName).id
                                      let toId = codebook.getThemeByName(toName).id
                                      if (fromId && toId && linkingPhraseName) {
                                        let body = []
                                        let value = {}
                                        value.from = fromId
                                        value.to = toId
                                        value.linkingWord = linkingPhraseName
                                        let linkingBody = new Linking({ value })
                                        body.push(linkingBody.serialize())
                                        let annotationToCreate = new Annotation({
                                          tags: tags,
                                          body: body,
                                          target: target,
                                          group: newGroup.id,
                                          permissions: { read: ['group:' + newGroup.id] }
                                        })
                                        linkingAnnotations.push(annotationToCreate.serialize())
                                      }
                                    }
                                  }
                                }
                              }
                              // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
  relationshipAdded: 'relationshipAdded',
  relationshipsLoaded: 'relationshipsLoaded',
  relationshipUpdated: 'relationshipUpdated',
  relationshipDeleted: 'relationshipDeleted',
  linkAnnotationCreated: 'linkAnnotationCreated',
  linkAnnotationDeleted: 'linkAnnotationDeleted',
  linkAnnotationUpdated: 'linkAnnotationUpdated',
  // PVSCL:ENDCOND/* PVSCL:IFCOND(Linking, LINE) */
@import './linkingForms';
/* PVSCL:ENDCOND */