// PVSCL:IFCOND(SidebarNavigation, LINE)
import Events from '../Events'
import Classifying from './purposes/Classifying'
// PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
    this.lastVisitedAnnotation = null
    // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
    this.initNavigationToAnnotationByCodeEventListener()
    // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.currentAnnotations
      // PVSCL:ELSECOND
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.allAnnotations
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy, LINE)
              if (body.value.id === codeId || (body.value.theme && body.value.theme.id === codeId)) {
                return true
              }
              // PVSCL:ELSECOND
              return body.value.id === codeId
              // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
  initNavigationToAnnotationByCodeEventListener (callback) {
    // Get all annotations with code or theme
    this.events.navigateToAnnotationByCodeEvent = { element: document, event: Events.navigateToAnnotationByCode, handler: this.createNavigationToAnnotationByCodeEventListener() }
    this.events.navigateToAnnotationByCodeEvent.element.addEventListener(this.events.navigateToAnnotationByCodeEvent.event, this.events.navigateToAnnotationByCodeEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createNavigationToAnnotationByCodeEventListener () {
    return (event) => {
      const codeId = event.detail.codeId
      // Get all the annotations with that code id
      let navegableAnnotations
      // PVSCL:IFCOND(UserFilter, LINE)
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.currentAnnotations
      // PVSCL:ELSECOND
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.allAnnotations
      // PVSCL:ENDCOND      const annotations = navegableAnnotations.filter((annotation) => {
        // Take only those with selector
        if (annotation.target[0].selector && _.isArray(annotation.body)) {
          return annotation.body.find(body => {
            if (body.purpose === Classifying.purpose) {
              // PVSCL:IFCOND(Hierarchy, LINE)
              if (body.value.id === codeId || (body.value.theme && body.value.theme.id === codeId)) {
                return true
              }
              // PVSCL:ELSECOND
              return body.value.id === codeId
              // PVSCL:ENDCOND            }
          })
        }
      })
      if (annotations.length) {
        const index = _.findIndex(annotations, (a) => {
          if (this.lastVisitedAnnotation) {
            return this.lastVisitedAnnotation.id === a.id
          } else {
            return false
          }
        })
        if (index === -1 || index === annotations.length - 1) {
          this.lastVisitedAnnotation = annotations[0]
        } else {
          this.lastVisitedAnnotation = annotations[index + 1]
        }
        window.abwa.annotationManagement.goToAnnotation(this.lastVisitedAnnotation)
        window.abwa.sidebar.openSidebar()
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
            // Test if text is selected
            if (document.getSelection().toString().length > 0) {
              // If selected create annotation
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                tags: tags,
                theme: theme,
                codeId: id
              })
            } else {
              // Else navigate to annotation
              LanguageUtils.dispatchCustomEvent(Events.navigateToAnnotationByCode, {
                codeId: theme.id
              })
            }
            // PVSCL:ELSECOND
            // If selected create annotation
            LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
              purpose: 'classifying',
              tags: tags,
              theme: theme,
              codeId: id
            })
            // PVSCL:ENDCOND                codeId: code.id/* PVSCL:IFCOND(NOT (Multivalued)) */,
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
            // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
            // Test if text is selected
            if (document.getSelection().toString().length > 0) {
              // If selected create annotation
              LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                purpose: 'classifying',
                tags: tags,
                codeId: theme.id
              })
            } else {
              // Else navigate to annotation
              LanguageUtils.dispatchCustomEvent(Events.navigateToAnnotationByCode, {
                codeId: theme.id
              })
            }
            // PVSCL:ELSECOND
            LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
              purpose: 'classifying',
              tags: tags,
              codeId: theme.id
            })
            // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
      // TODO Implement page annotation and uncomment this:
      // items['pageAnnotation'] = {name: 'Page annotation'}
      // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
          if (key === 'pageAnnotation') {
            Alerts.infoAlert({ text: 'If sidebar navigation is active, it is not possible to make page level annotations yet.' })
            // TODO Page level annotations, take into account that tags are necessary here (take into account Moodle related case)
            /* let theme = this.codebook.getCodeOrThemeFromId(themeId)
            LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
              purpose: 'classifying',
              theme: theme,
              codeId: theme.id
            }) */
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
        // items['pageAnnotation'] = {name: 'Page annotation'}
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
            // PVSCL:ENDCOND// PVSCL:IFCOND(SidebarNavigation, LINE)
  navigateToAnnotationByCode: 'navigateToAnnotationByCode',
  // PVSCL:ENDCOND