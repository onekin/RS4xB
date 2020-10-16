// PVSCL:IFCOND(DeleteAll, LINE)
    // Event listener deleted all annotations
    this.initAllAnnotationsDeletedEventListener()
    // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(DeleteAll, LINE)

  initAllAnnotationsDeletedEventListener (callback) {
    this.events.allAnnotationsDeletecEvent = { element: document, event: Events.deletedAllAnnotations, handler: this.allAnnotationsDeletedEventListener() }
    this.events.allAnnotationsDeletecEvent.element.addEventListener(this.events.allAnnotationsDeletecEvent.event, this.events.allAnnotationsDeletecEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  allAnnotationsDeletedEventListener () {
    return (event) => {
      const annotations = event.detail.annotations
      // Remove deleted annotations from allAnnotations
      _.pullAllWith(this.allAnnotations, annotations, (a, b) => { return a.id === b.id })
      // Dispatch annotations updated event
      LanguageUtils.dispatchCustomEvent(Events.updatedAllAnnotations, { annotations: this.allAnnotations })
      // PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND      // Unhighlight deleted annotations
      this.redrawAnnotations()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(DeleteAll, LINE)
      // Set DeleteAll image
      const deleteGroupImageUrl = chrome.extension.getURL('/images/deleteAnnotations.png')
      this.deleteGroupImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.deleteGroupImage.src = deleteGroupImageUrl
      this.deleteGroupImage.title = 'Delete all annotations in document' // TODO i18n
      this.toolsetBody.appendChild(this.deleteGroupImage)
      this.deleteGroupImage.addEventListener('click', () => {
        this.deleteAllButtonHandler()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(DeleteAll, LINE)
  deleteAllButtonHandler () {
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

  // PVSCL:ENDCOND// PVSCL:IFCOND(DeleteAll, LINE)
  deleteAllAnnotations: 'deleteAllAnnotations',
  deletedAllAnnotations: 'deletedAllAnnotations',
  // PVSCL:ENDCOND