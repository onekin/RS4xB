// PVSCL:IFCOND(UserFilter, LINE)
import UserFilter from './UserFilter'
// PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      this.initUserFilter()
      this.initUserFilterChangeEvent()
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
    // Destroy user filter
    if (this.userFilter) {
      this.userFilter.destroy()
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      annotationsToHighlight = this.currentAnnotations
      // PVSCL:ELSECOND
      annotationsToHighlight = this.allAnnotations
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Enable in user filter the user who has annotated and returns if it was disabled
      this.userFilter.addFilteredUser(annotation.creator)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
        this.currentAnnotations = this.retrieveCurrentAnnotations()
        // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
        // Current annotations will be
        this.currentAnnotations = this.retrieveCurrentAnnotations()
        LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { annotations: this.currentAnnotations })
        unHiddenAnnotations = this.currentAnnotations
        // PVSCL:ELSECOND
        unHiddenAnnotations = this.allAnnotations
        // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
    if (this.userFilter) {
      currentAnnotations = this.retrieveAnnotationsForUsers(this.userFilter.filteredUsers)
    } else {
      currentAnnotations = this.allAnnotations
    }
    // PVSCL:ELSECOND
    currentAnnotations = this.allAnnotations
    // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      this.highlightAnnotations(this.currentAnnotations, callback)
      // PVSCL:ELSECOND
      this.highlightAnnotations(this.allAnnotations)
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)

  initUserFilter () {
    // Create augmentation operations for the current group
    this.userFilter = new UserFilter()
    this.userFilter.init()
  }

  initUserFilterChangeEvent (callback) {
    this.events.userFilterChangeEvent = { element: document, event: Events.userFilterChange, handler: this.createUserFilterChangeEventHandler() }
    this.events.userFilterChangeEvent.element.addEventListener(this.events.userFilterChangeEvent.event, this.events.userFilterChangeEvent.handler, false)
    if (_.isFunction(callback)) {
      callback()
    }
  }

  createUserFilterChangeEventHandler () {
    return (event) => {
      // Retrieve filtered users list from event
      const filteredUsers = event.detail.filteredUsers
      // Retrieve annotations for filtered users
      this.currentAnnotations = this.retrieveAnnotationsForUsers(filteredUsers)
      this.redrawAnnotations()
      // Updated current annotations due to changes in the filtered users
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
    }
  }

  /**
   * Retrieve from all annotations for the current document, those who user is one of the list in users
   * @param users
   * @returns {Array}
   */
  retrieveAnnotationsForUsers (users) {
    return _.filter(this.allAnnotations, (annotation) => {
      return _.find(users, (user) => {
        return annotation.creator === user
      })
    })
  }

  // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      // Retrieve current annotations
      this.currentAnnotations = this.retrieveCurrentAnnotations()
      LanguageUtils.dispatchCustomEvent(Events.updatedCurrentAnnotations, { currentAnnotations: this.currentAnnotations })
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.currentAnnotations
      // PVSCL:ELSECOND
      navegableAnnotations = window.abwa.annotationManagement.annotationReader.allAnnotations
      // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
  userFilterChange: 'userFilterChange',
  // PVSCL:ENDCOND// PVSCL:IFCOND(UserFilter, LINE)
  updatedCurrentAnnotations: 'updatedCurrentAnnotations',
  // PVSCL:ENDCOND