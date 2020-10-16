// PVSCL:IFCOND(Replying, LINE)
      // If annotation is replying another annotation, add to reply annotation list
      if (annotation.references.length > 0) {
        this.replyAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      // If annotation is linking annotation, add to linking annotation list
      if (annotation.body.purpose === 'linking') {
        this.linkingAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Enable in user filter the user who has annotated and returns if it was disabled
      this.userFilter.addFilteredUser(annotation.creator)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Create, LINE)
  initAnnotationCreatedEventListener (callback) {
    this.events.annotationCreatedEvent = { element: document, event: Events.annotationCreated, handler: this.createdAnnotationHandler() }
    this.events.annotationCreatedEvent.element.addEventListener(this.events.annotationCreatedEvent.event, this.events.annotationCreatedEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createdAnnotationHandler () {
    return (event) => {
      const annotation = event.detail.annotation
      // Add to all annotations list
      this.allAnnotations.push(annotation)
      // PVSCL:IFCOND(Replying, LINE)
      // If annotation is replying another annotation, add to reply annotation list
      if (annotation.references.length > 0) {
        this.replyAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND      // PVSCL:IFCOND(Linking, LINE)
      // If annotation is linking annotation, add to linking annotation list
      if (annotation.body.purpose === 'linking') {
        this.linkingAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND      // Dispatch annotations updated event
      LanguageUtils.dispatchCustomEvent(Events.updatedAllAnnotations, { annotations: this.allAnnotations })
      // PVSCL:IFCOND(UserFilter, LINE)
      // Enable in user filter the user who has annotated and returns if it was disabled
      this.userFilter.addFilteredUser(annotation.creator)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND      // Highlight annotation
      this.highlightAnnotation(annotation)
    }
  }

  // PVSCL:ENDCOND