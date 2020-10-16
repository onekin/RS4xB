// PVSCL:IFCOND(Update, LINE)
    this.initAnnotationUpdatedEventListener()
    // PVSCL:ENDCOND// PVSCL:IFCOND(Update OR Delete, LINE)
        // Create context menu event for highlighted elements
        this.createContextMenuForAnnotation(annotation)
        // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Update, LINE)
  initAnnotationUpdatedEventListener (callback) {
    this.events.annotationUpdatedEvent = { element: document, event: Events.annotationUpdated, handler: this.updatedAnnotationHandler() }
    this.events.annotationUpdatedEvent.element.addEventListener(this.events.annotationUpdatedEvent.event, this.events.annotationUpdatedEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  updatedAnnotationHandler () {
    return (event) => {
      // Get updated annotation
      const annotation = event.detail.annotation
      // Update all annotations
      const allIndex = _.findIndex(this.allAnnotations, (currentAnnotation) => {
        return annotation.id === currentAnnotation.id
      })
      this.allAnnotations.splice(allIndex, 1, annotation)
      // Dispatch annotations updated event
      LanguageUtils.dispatchCustomEvent(Events.updatedAllAnnotations, { annotations: this.allAnnotations })
      // PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND
      // Unhighlight and highlight annotation
      this.unHighlightAnnotation(annotation)
      this.highlightAnnotation(annotation)
    }
  }

  // PVSCL:ENDCOND