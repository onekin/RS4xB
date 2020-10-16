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
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
        // Remove tags which are not for the current assignment
        const cmid = window.abwa.targetManager.fileMetadata.cmid
        annotations = _.filter(annotations, (annotation) => {
          return this.hasATag(annotation, 'cmid:' + cmid)
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
            // We are using MoodleResource feature so need to push the cmid tag
            tags.push('cmid:' + theme.annotationGuide.cmid)
            // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
              tags.push('cmid:' + theme.annotationGuide.cmid)
              // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
            tags.push('cmid:' + theme.annotationGuide.cmid)
            // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
            tags.push('cmid:' + theme.annotationGuide.cmid)
            // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    this.cmid = window.abwa.codebookManager.codebookReader.codebook.cmid
    // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      let contentAnnotations = _.filter(allAnnotations, (annotation) => {
        if (annotation.body.length > 0) {
          return !LanguageUtils.isInstanceOf(annotation.body[0], Linking)
        }
      })
      resolve(contentAnnotations)
      // PVSCL:ELSECOND
      resolve(allAnnotations)
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    promise = new Promise((resolve, reject) => {
      if (window.abwa.groupSelector.currentGroup.id) {
        const call = {}
        // Set the annotation group where annotations should be searched from
        call.group = window.abwa.groupSelector.currentGroup.id
        call.tags = 'cmid:' + this.cmid
        call.wildcard_uri = window.abwa.codebookManager.codebookReader.codebook.moodleEndpoint + '*'
        window.abwa.annotationServerManager.client.searchAnnotations(call, (err, annotations) => {
          if (err) {
            reject(err)
          } else {
            resolve(annotations.map(annotation => Annotation.deserialize(annotation)))
          }
        })
      } else {
        resolve([])
      }
    })
    // PVSCL:ELSECOND
    promise = new Promise((resolve, reject) => {
      let allAnnotations = window.abwa.annotationManagement.annotationReader.allAnnotations
      // PVSCL:IFCOND(Linking, LINE)
      let contentAnnotations = _.filter(allAnnotations, (annotation) => {
        if (annotation.body.length > 0) {
          return !LanguageUtils.isInstanceOf(annotation.body[0], Linking)
        }
      })
      resolve(contentAnnotations)
      // PVSCL:ELSECOND
      resolve(allAnnotations)
      // PVSCL:ENDCOND    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    newTagList.push('cmid:' + this.cmid)
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
import RolesManager from './RolesManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
      .then(() => {
        return this.reloadRolesManager()
      }).then(() => {
        return this.reloadMoodleEstimationManager()
      }).then(() => {
        return this.reloadPreviousAssignments()
      })
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
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)

  reloadRolesManager () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyRolesManager()
      // Create a new content annotator for the current group
      window.abwa.rolesManager = new RolesManager()
      window.abwa.rolesManager.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  reloadMoodleEstimationManager () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyMoodleEstimationManager()
      // Create a new content annotator for the current group
      const MoodleEstimationManager = require('../moodle/MoodleEstimationManager').default
      window.abwa.moodleEstimationManager = new MoodleEstimationManager()
      window.abwa.moodleEstimationManager.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  // PVSCL:IFCOND(PreviousAssignments, LINE)

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
  // PVSCL:ENDCOND  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)

  destroyRolesManager () {
    // Destroy current augmentation operations
    if (window.abwa.rolesManager) {
      window.abwa.rolesManager.destroy()
    }
  }

  destroyMoodleEstimationManager () {
    if (window.abwa.moodleEstimationManager) {
      window.abwa.moodleEstimationManager.destroy()
    }
  }

  destroyPreviousAssignments () {
    // Destroy current augmentation operations
    if (window.abwa.previousAssignments) {
      window.abwa.previousAssignments.destroy()
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
      this.destroyRolesManager()
      this.destroyPreviousAssignments()
      this.destroyMoodleEstimationManager()
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource,LINE)
import MoodleUtils from '../moodle/MoodleUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'isAutoOpenFilesActivated' }, (isActivated) => {
      document.querySelector('#autoOpenCheckbox').checked = isActivated.activated
    })
    document.querySelector('#autoOpenCheckbox').addEventListener('change', () => {
      this.updateAutoOpenCheckbox()
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)

  updateAutoOpenCheckbox () {
    const isChecked = document.querySelector('#autoOpenCheckbox').checked
    chrome.runtime.sendMessage({
      scope: 'moodle',
      cmd: 'setAutoOpenFiles',
      data: { isActivated: isChecked }
    }, (response) => {
      console.debug('Api simulation is updated to: ' + response.activated)
    })
  }

  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
    this.fileMetadata = {}
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
      promise = this.retrievePromiseLoadMoodleMetadata()
      // PVSCL:ELSECOND
      promise = Promise.resolve()
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
        // Warn user document is not from moodle
        Alerts.errorAlert({
          text: 'Try to download the file again from moodle and if the error continues check <a href="https://github.com/haritzmedina/MarkAndGo/wiki/Most-common-errors-in-Mark&Go#file-is-not-from-moodle">this</a>. Error: ' + err.message,
          title: 'This file is not downloaded from moodle'
        })
        // PVSCL:ELSECOND
        Alerts.errorAlert({ text: 'Unexpected error: ' + err.message })
        // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)

  retrievePromiseLoadMoodleMetadata () {
    return new Promise((resolve, reject) => {
      let url
      if (window.location.pathname === '/content/pdfjs/web/viewer.html') {
        url = URLUtils.retrieveMainUrl(window.PDFViewerApplication.url)
      } else if (window.location.pathname === '/content/plainTextFileViewer/index.html') {
        url = URLUtils.retrieveMainUrl((new URL(window.location.href)).searchParams.get('file'))
      } else {
        url = URLUtils.retrieveMainUrl(window.location.href)
      }
      chrome.runtime.sendMessage({ scope: 'annotationFile', cmd: 'fileMetadata', data: { filepath: url } }, (fileMetadata) => {
        if (_.isEmpty(fileMetadata)) {
          this.url = URLUtils.retrieveMainUrl(window.location.href)
          // Metadata is not loaded
          reject(new Error('Metadata is not loaded'))
        } else {
          this.fileMetadata = fileMetadata.file
          this.url = fileMetadata.file.url
          // Calculate fingerprint for plain text files
          this.tryToLoadPlainTextFingerprint()
          this.fileMetadata.contextId = LanguageUtils.getStringBetween(this.fileMetadata.url, 'pluginfile.php/', '/assignsubmission_file')
          this.fileMetadata.itemId = LanguageUtils.getStringBetween(this.fileMetadata.url, 'submission_files/', '/')
          // Metadata is loaded
          resolve()
        }
      })
      return true
    })
  }
  // PVSCL:ENDCOND          // PVSCL:IFCOND(NOT (MoodleResource), LINE) // It is plain text file but it is already opened with custom plain text viewer
          const extension = window.location.href.split('.').pop().split(/#|\?/g)[0]
          result = 'xml,xsl,xslt,xquery,xsql,'.split(',').includes(extension)
          // PVSCL:ELSECOND // When is downloaded from moodle it must be always be opened with custom viewer to ensure CORS over moodle is not applied
          result = true
          // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleResource, LINE)
tags.producer = 'teacher'
tags.consumer = 'student'
// PVSCL:ENDCONDPVSCL:IFCOND(MoodleResource),
    {
      "matches": ["*://*/*course/view.php*"],
      "js": ["scripts/moodleResumption.js"],
      "run_at": "document_end"
    }PVSCL:ENDCONDPVSCL:IFCOND(MoodleResource),
    {
      "matches": ["*://*/*mod/assign/view.php*"],
      "js": ["scripts/moodleEstimation.js"],
      "run_at": "document_end"
    }PVSCL:ENDCOND