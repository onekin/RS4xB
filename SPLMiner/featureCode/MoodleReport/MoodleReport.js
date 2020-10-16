/* PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource) */,
    moodleEndpoint = null,
    assignmentName = null,
    assignmentId = null,
    courseId = null,
    cmid = null/* PVSCL:ENDCOND */// PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource,LINE)
    const cmidTag = 'cmid:' + this.cmid
    tags.push(cmidTag)
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or MoodleReport or MoodleResource,LINE)
    textObject = {
      moodleEndpoint: this.moodleEndpoint,
      assignmentId: this.assignmentId,
      assignmentName: this.assignmentName,
      courseId: this.courseId,
      cmid: this.cmid
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport,LINE)
        const moodleCriteriaId = config.id
        // PVSCL:ENDCOND/* PVSCL:IFCOND(MoodleReport) */,
          moodleCriteriaId/* PVSCL:ENDCOND */// PVSCL:IFCOND(MoodleReport, LINE) // This one is only related to moodle as is the only feature that requires to take into account the annotated content manager when annotations are updated
    this.events.annotationUpdatedEvent = { element: document, event: Events.annotationUpdated, handler: this.createAnnotationUpdatedEventHandler() }
    this.events.annotationUpdatedEvent.element.addEventListener(this.events.annotationUpdatedEvent.event, this.events.annotationUpdatedEvent.handler, false)
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)
  createAnnotationUpdatedEventHandler () {
    return (event) => {
      // Retrieve annotation from event
      const annotation = event.detail.annotation
      // Get classification code
      const classifyingBody = annotation.getBodyForPurpose(Classifying.purpose)
      if (classifyingBody) {
        const codeId = classifyingBody.value.id
        const annotatedThemeOrCode = this.getAnnotatedThemeOrCodeFromThemeOrCodeId(codeId)
        // Retrieve criteria name for annotation
        if (annotatedThemeOrCode && annotatedThemeOrCode.annotations.length > 0) {
          const index = _.findIndex(annotatedThemeOrCode.annotations, (annotationMark) => annotationMark.id === annotation.id)
          if (index > -1) {
            annotatedThemeOrCode.annotations[index] = annotation
          }
          // Dispatch updated content manager event
          LanguageUtils.dispatchCustomEvent(Events.annotatedContentManagerUpdated, { annotatedThemes: this.annotatedThemes })
        }
      }
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)
      .then(() => {
        return this.reloadMoodleReport()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)

  reloadMoodleReport () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyMoodleReport()
      // Create a new content annotator for the current group
      const MoodleReport = require('../annotationManagement/read/MoodleReport').default
      window.abwa.moodleReport = new MoodleReport()
      window.abwa.moodleReport.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)

  destroyMoodleReport () {
    // Destroy current augmentation operations
    if (!_.isEmpty(window.abwa.moodleReport)) {
      window.abwa.moodleReport.destroy()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)
import BackToWorkspace from '../moodle/BackToWorkspace'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleReport, LINE)
      // Set back to moodle icon
      const moodleImageUrl = chrome.extension.getURL('/images/moodle.svg')
      this.moodleImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.moodleImage.src = moodleImageUrl
      this.moodleImage.title = 'Back to moodle' // TODO i18n
      BackToWorkspace.createWorkspaceLink((link) => {
        this.moodleLink = link
        this.moodleLink.appendChild(this.moodleImage)
        this.toolsetBody.appendChild(this.moodleLink)
      })
      // PVSCL:ENDCONDimport CryptoUtils from '../utils/CryptoUtils'

class MoodleUtils {
  static createURLForAnnotation ({ annotation, studentId, courseId, cmid }) {
    return annotation.target[0].source.url + '#studentId:' + studentId + '&mag:' + annotation.id + '&courseId:' + courseId + '&cmid:' + cmid
  }

  static getHashedGroup ({ studentId, moodleEndpoint, courseId }) {
    const groupName = moodleEndpoint + courseId + '-' + studentId
    // We create a hash using the course ID and the student ID to anonymize the Hypothes.is group
    return 'MG' + CryptoUtils.hash(groupName).substring(0, 23)
  }
}

export default MoodleUtils
MoodleUtils.js