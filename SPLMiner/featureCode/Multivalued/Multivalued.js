// PVSCL:IFCOND(NOT(Multivalued),LINE)
            // First, ask for the currently annotated code
            const currentlyAnnotatedCode = window.abwa.annotatedContentManager.searchAnnotatedCodeForGivenThemeId(themeId)
            // If there is already a code annotation for this theme, we have to let the tags of the code, to annotate with the current code
            if (currentlyAnnotatedCode) {
              tags = [Config.namespace + ':' + Config.tags.grouped.relation + ':' + theme.name, Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + currentlyAnnotatedCode.code.name]
              id = currentlyAnnotatedCode.code.id
              // else, we annotate with the theme
            } else {
              tags = [Config.namespace + ':' + Config.tags.grouped.group + ':' + theme.name]
              id = themeId
            }
            // PVSCL:ELSECOND
            tags = [Config.namespace + ':' + Config.tags.grouped.group + ':' + theme.name]
            id = themeId
            // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
              tags.push('cmid:' + theme.annotationGuide.cmid)
              // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
            tags.push('cmid:' + theme.annotationGuide.cmid)
            // PVSCL:ENDCOND                codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
                lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */                codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
                lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */              codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
              lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */              codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
              lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */// PVSCL:IFCOND(SidebarNavigation, LINE)
            // Test if text is selected
            if (document.getSelection().toString().length > 0) {
              // If selected create annotation
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                tags: tags,
                codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
              lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */            })
            // PVSCL:ENDCOND// PVSCL:IFCOND(NOT(Multivalued),LINE)
            // The rest of the annotations must be classified with this code too
            // Get the annotatedTheme object of the code selected
            const annotatedTheme = window.abwa.annotatedContentManager.getAnnotatedThemeOrCodeFromThemeOrCodeId(code.theme.id)
            // retrive the annotatedTheme object of the code selected
            const currentlyAnnotatedCode = window.abwa.annotatedContentManager.searchAnnotatedCodeForGivenThemeId(code.theme.id)
            // We have to throw the event of codeToAll when:
            // There are still theme annotations or there are annotations of other codes done
            if ((annotatedTheme.hasAnnotations() || (currentlyAnnotatedCode && currentlyAnnotatedCode.code.id !== codeId))) {
              if (currentlyAnnotatedCode) {
                // For the case, we are annotating with a code that is not the currently annotated code
                // In the last case we do not have to throw codeToAll event, we will do the codeToAll after the annotation is created
                if (currentlyAnnotatedCode.code.id !== codeId) {
                  LanguageUtils.dispatchCustomEvent(Events.codeToAll, {
                    codeId: code.id,
                    currentlyAnnotatedCode: currentlyAnnotatedCode
                  })
                }
              } else {
                // In the case that we have annotated with themes until now and there isn't a code annotation yet
                LanguageUtils.dispatchCustomEvent(Events.codeToAll, {
                  codeId: code.id,
                  currentlyAnnotatedCode: currentlyAnnotatedCode
                })
              }
            }
            // Create new annotation if text selected
            if (document.getSelection().toString().length > 0) {
              // Create new annotation
              const tags = [Config.namespace + ':' + Config.tags.grouped.relation + ':' + code.theme.name, Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + code.name]
              // PVSCL:IFCOND(MoodleResource,LINE)
            tags.push('cmid:' + theme.annotationGuide.cmid)
            // PVSCL:ENDCOND            // PVSCL:IFCOND(SidebarNavigation, LINE)
            // Test if text is selected
            if (document.getSelection().toString().length > 0) {
              // If selected create annotation
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                tags: tags,
                codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
              lastAnnotatedCode: currentlyAnnotatedCode/* PVSCL:ENDCOND */            })
            // PVSCL:ENDCOND            // PVSCL:ENDCOND// PVSCL:IFCOND(NOT(Multivalued), LINE) // It is only used by SingleCode
import Config from '../Config'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    newTagList.push('cmid:' + this.cmid)
    // PVSCL:ENDCOND// PVSCL:IFCOND(NOT(Multivalued), LINE)

  codeToAll (code, lastAnnotatedCode) {
    // Update annotatedThemes
    const annotatedTheme = this.getAnnotatedThemeOrCodeFromThemeOrCodeId(code.theme.id)
    const annotatedCode = this.getAnnotatedThemeOrCodeFromThemeOrCodeId(code.id)
    // 'exam:cmid:' + this.cmid
    const newTagList = [
      Config.namespace + ':' + Config.tags.grouped.relation + ':' + code.theme.name,
      Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + code.name
    ]
    // PVSCL:IFCOND(MoodleResource, LINE)
    newTagList.push('cmid:' + this.cmid)
    // PVSCL:ENDCOND    if (annotatedTheme.hasAnnotations()) {
      const themeAnnotations = annotatedTheme.annotations
      // Update all annotations with new tags
      _.forEach(themeAnnotations, (themeAnnotation) => {
        themeAnnotation.tags = newTagList
        const bodyClassifying = themeAnnotation.getBodyForPurpose(Classifying.purpose)
        bodyClassifying.value = code.toObject()
        annotatedCode.annotations.push(themeAnnotation)
      })
      this.updateAnnotationsInAnnotationServer(themeAnnotations, () => {
        annotatedTheme.annotations = []
        window.abwa.annotationManagement.annotationReader.updateAllAnnotations()
        this.reloadTagsChosen()
        // Dispatch updated content manager event
        LanguageUtils.dispatchCustomEvent(Events.annotatedContentManagerUpdated, { annotatedThemes: this.annotatedThemes })
        // Dispatch all coded event
        LanguageUtils.dispatchCustomEvent(Events.allCoded, { annotatedThemes: this.annotatedThemes })
      })
    }
    if (lastAnnotatedCode && (lastAnnotatedCode.code.id !== code.id)) {
      const lastAnnotatedCodeAnnotations = lastAnnotatedCode.annotations
      // Update all annotations with new tags
      _.forEach(lastAnnotatedCodeAnnotations, (lastAnnotatedCodeAnnotation) => {
        lastAnnotatedCodeAnnotation.tags = newTagList
        const bodyClassifying = lastAnnotatedCodeAnnotation.getBodyForPurpose(Classifying.purpose)
        bodyClassifying.value = code.toObject()
        annotatedCode.annotations.push(lastAnnotatedCodeAnnotation)
      })
      this.updateAnnotationsInAnnotationServer(lastAnnotatedCodeAnnotations, () => {
        lastAnnotatedCode.annotations = []
        window.abwa.annotationManagement.annotationReader.updateAllAnnotations()
        this.reloadTagsChosen()
        // Dispatch updated content manager event
        LanguageUtils.dispatchCustomEvent(Events.annotatedContentManagerUpdated, { annotatedThemes: this.annotatedThemes })
        // Dispatch all coded event
        LanguageUtils.dispatchCustomEvent(Events.allCoded, { annotatedThemes: this.annotatedThemes })
      })
    }
  }

  updateAnnotationsInAnnotationServer (annotations, callback) {
    const promises = []
    for (let i = 0; i < annotations.length; i++) {
      const annotation = annotations[i]
      promises.push(new Promise((resolve, reject) => {
        window.abwa.annotationServerManager.client.updateAnnotation(annotation.id, annotation.serialize(), (err, annotation) => {
          if (err) {
            reject(new Error('Unable to update annotation ' + annotation.id))
          } else {
            resolve(Annotation.deserialize(annotation))
          }
        })
      }))
    }
    let resultAnnotations = []
    Promise.all(promises).then((result) => {
      // All annotations updated
      resultAnnotations = result
    }).finally((result) => {
      if (_.isFunction(callback)) {
        callback(null, resultAnnotations)
      }
    })
  }

  searchAnnotatedCodeForGivenThemeId (themeId) {
    const annotatedTheme = this.getAnnotatedThemeOrCodeFromThemeOrCodeId(themeId)
    const annotatedCode = _.find(annotatedTheme.annotatedCodes, (annoCode) => {
      return annoCode.hasAnnotations()
    })
    return annotatedCode
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(NOT(Multivalued), LINE)
    // Event for tag manager reloaded
    this.events.codeToAllEvent = { element: document, event: Events.codeToAll, handler: this.createCodeToAllEventHandler() }
    this.events.codeToAllEvent.element.addEventListener(this.events.codeToAllEvent.event, this.events.codeToAllEvent.handler, false)
    // PVSCL:ENDCOND  // PVSCL:IFCOND(NOT (Multivalued), LINE)
  codeToAll: 'codeToAll',
  allCoded: 'allCoded',
  // PVSCL:ENDCOND