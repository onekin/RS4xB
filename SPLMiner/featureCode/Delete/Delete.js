// PVSCL:IFCOND(Replying, LINE)
      // Remove annotations that reply to this one (if user is the same)
      _.remove(this.allAnnotations, (currentAnnotation) => {
        return _.includes(currentAnnotation.references, (refId) => {
          return annotation.id === refId
        })
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
        // Remove annotations that reply to this one (if user is the same)
        _.remove(this.allAnnotations, (currentAnnotation) => {
          return _.includes(currentAnnotation.references, (refId) => {
            return annotation.id === refId
          })
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
        _.remove(this.groupLinkingAnnotations, (currentAnnotation) => {
          return currentAnnotation.id === annotation.id
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Delete, LINE)
  initAnnotationDeletedEventListener (callback) {
    this.events.annotationDeletedEvent = { element: document, event: Events.annotationDeleted, handler: this.deletedAnnotationHandler() }
    this.events.annotationDeletedEvent.element.addEventListener(this.events.annotationDeletedEvent.event, this.events.annotationDeletedEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  initAnnotationsDeletedEventListener (callback) {
    this.events.annotationsDeletedEvent = { element: document, event: Events.annotationsDeleted, handler: this.deletedAnnotationsHandler() }
    this.events.annotationsDeletedEvent.element.addEventListener(this.events.annotationsDeletedEvent.event, this.events.annotationsDeletedEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  deletedAnnotationHandler () {
    return (event) => {
      const annotation = event.detail.annotation
      // Remove annotation from allAnnotations
      _.remove(this.allAnnotations, (currentAnnotation) => {
        return currentAnnotation.id === annotation.id
      })
      // PVSCL:IFCOND(Replying, LINE)
        // Remove annotations that reply to this one (if user is the same)
        _.remove(this.allAnnotations, (currentAnnotation) => {
          return _.includes(currentAnnotation.references, (refId) => {
            return annotation.id === refId
          })
        })
        // PVSCL:ENDCOND        // PVSCL:IFCOND(Linking, LINE)
        _.remove(this.groupLinkingAnnotations, (currentAnnotation) => {
          return currentAnnotation.id === annotation.id
        })
        // PVSCL:ENDCOND        this.unHighlightAnnotation(annotation)
      }
      // Dispatch annotations updated event
      LanguageUtils.dispatchCustomEvent(Events.updatedAllAnnotations, { annotations: this.allAnnotations })
      // PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Update OR Delete, LINE)
        // Create context menu event for highlighted elements
        this.createContextMenuForAnnotation(annotation)
        // PVSCL:ENDCOND