// PVSCL:IFCOND(PreviousAssignments,LINE)
    const previousAssignmentsUI = CommentingForm.getPreviousAssignmentsUI()
    // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments,LINE)
      generateFormObjects.previousAssignmentsUI = previousAssignmentsUI
      // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments,LINE)
  static getPreviousAssignmentsUI () {
    if (window.abwa.previousAssignments) {
      const previousAssignments = window.abwa.previousAssignments.retrievePreviousAssignments()
      return window.abwa.previousAssignments.createPreviousAssignmentsUI(previousAssignments)
    } else {
      return ''
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments,LINE)
    html += CommentingForm.getPreviousAssignmentsUI().outerHTML
    // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments,LINE)
      const previousAssignmentAppendElements = document.querySelectorAll('.previousAssignmentAppendButton')
      previousAssignmentAppendElements.forEach((previousAssignmentAppendElement) => {
        previousAssignmentAppendElement.addEventListener('click', () => {
          // Append url to comment
          const commentTextarea = document.querySelector('#comment')
          commentTextarea.value = commentTextarea.value + previousAssignmentAppendElement.dataset.studentUrl
        })
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments, LINE)
            const regex = /\b(?:https?:\/\/)?[^/:]+\/.*?mod\/assign\/view.php\?id=[0-9]+/g
            text = text.replace(regex, '')
            // PVSCL:ENDCONDimport _ from 'lodash'
import Config from '../../Config'
import Codebook from '../../codebook/model/Codebook'

const RETRIEVE_PREVIOUS_ASSIGNMENT_INTERVAL_IN_SECONDS = 60

class PreviousAssignments {
  constructor () {
    this.previousAssignments = []
    this.intervals = {}
  }

  init (callback) {
    console.debug('Initializing previousAssignments')
    // Load previous assignments
    this.reloadPreviousAssignments(() => {
      console.debug('Initialized previousAssignments')
      if (_.isFunction(callback)) {
        callback()
      }
      this.intervals.retrievePreviousAssignment = window.setInterval(() => {
        this.reloadPreviousAssignments()
      }, RETRIEVE_PREVIOUS_ASSIGNMENT_INTERVAL_IN_SECONDS * 1000)
    })
  }

  destroy () {
    if (this.intervals.retrievePreviousAssignment) {
      clearInterval(this.intervals.retrievePreviousAssignment)
    }
  }

  reloadPreviousAssignments (callback) {
    // Get student id
    const studentId = window.abwa.targetManager.fileMetadata.studentId
    window.abwa.annotationServerManager.client.searchAnnotations({
      tag: Config.namespace + ':guide',
      group: window.abwa.groupSelector.currentGroup.id
    }, (err, annotations) => {
      if (err) {
        // Nothing to do
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        const previousAssignments = []
        for (let i = 0; i < annotations.length; i++) {
          Codebook.fromAnnotation(annotations[i], (rubric) => {
            // If current assignment is previous assignment, don't add
            if (window.abwa.targetManager.fileMetadata.cmid !== rubric.cmid) {
              const previousAssignment = { name: rubric.assignmentName }
              const teacherUrl = rubric.getUrlToStudentAssignmentForTeacher(studentId)
              const studentUrl = rubric.getUrlToStudentAssignmentForStudent(studentId)
              // If it is unable to retrieve the URL, don't add
              if (!_.isNull(teacherUrl) && !_.isNull(studentUrl)) {
                previousAssignment.teacherUrl = teacherUrl
                previousAssignment.studentUrl = studentUrl
                previousAssignments.push(previousAssignment)
              }
            }
          })
        }
        this.previousAssignments = previousAssignments
        console.debug('Updated previous assignments')
        if (_.isFunction(callback)) {
          callback(err)
        }
      }
    })
  }

  retrievePreviousAssignments () {
    return window.abwa.previousAssignments.previousAssignments
  }

  createPreviousAssignmentsUI (previousAssignments) {
    const previousAssignmentsContainer = document.createElement('div')
    previousAssignmentsContainer.className = 'previousAssignmentsContainer'
    for (let i = 0; i < previousAssignments.length; i++) {
      const previousAssignment = previousAssignments[i]
      // Create previous assignment element container
      const previousAssignmentElement = document.createElement('span')
      previousAssignmentElement.className = 'previousAssignmentContainer'
      // Create previous assignment link
      const previousAssignmentLinkElement = document.createElement('a')
      if (window.abwa.rolesManager.role === Config.tags.producer) {
        previousAssignmentLinkElement.href = previousAssignment.teacherUrl
      } else {
        previousAssignmentLinkElement.href = previousAssignment.studentUrl
      }
      previousAssignmentLinkElement.target = '_blank'
      previousAssignmentLinkElement.innerText = previousAssignment.name
      previousAssignmentLinkElement.className = 'previousAssignmentLink'
      previousAssignmentElement.appendChild(previousAssignmentLinkElement)
      // Create previous assignment append img
      const previousAssignmentAppendElement = document.createElement('img')
      previousAssignmentAppendElement.src = chrome.extension.getURL('images/append.png')
      previousAssignmentAppendElement.title = 'Append the assignment URL'
      previousAssignmentAppendElement.className = 'previousAssignmentAppendButton'
      if (window.abwa.rolesManager.role === Config.tags.producer) {
        previousAssignmentAppendElement.dataset.studentUrl = previousAssignment.studentUrl
      } else {
        previousAssignmentAppendElement.dataset.studentUrl = previousAssignment.teacherUrl
      }
      previousAssignmentElement.appendChild(previousAssignmentAppendElement)
      previousAssignmentsContainer.appendChild(previousAssignmentElement)
    }
    return previousAssignmentsContainer
  }
}

export default PreviousAssignments
PreviousAssignments.js// PVSCL:IFCOND(PreviousAssignments, LINE)

  getUrlToStudentAssignmentForTeacher (studentId) {
    if (studentId && this.moodleEndpoint && this.cmid) {
      return this.moodleEndpoint + 'mod/assign/view.php?id=' + this.cmid + '&rownum=0&action=grader&userid=' + studentId
    } else {
      return null
    }
  }

  getUrlToStudentAssignmentForStudent (studentId) {
    if (studentId && this.moodleEndpoint && this.cmid) {
      return this.moodleEndpoint + 'mod/assign/view.php?id=' + this.cmid
    } else {
      return null
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments, LINE)
import PreviousAssignments from '../annotationManagement/purposes/PreviousAssignments'
// PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments, LINE)

  reloadPreviousAssignments () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyPreviousAssignments()
      // Create a new content annotator for the current group
      window.abwa.previousAssignments = new PreviousAssignments()
      window.abwa.previousAssignments.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(PreviousAssignments, LINE) */
@import './exam';
/* PVSCL:ENDCOND */