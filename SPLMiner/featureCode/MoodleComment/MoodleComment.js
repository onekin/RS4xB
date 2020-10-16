// PVSCL:IFCOND(MoodleComment, LINE)
      .then(() => {
        return this.reloadMoodleComment()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleComment, LINE)

  reloadMoodleComment () {
    return new Promise((resolve, reject) => {
      // Destroy current content annotator
      this.destroyMoodleComment()
      // Create a new content annotator for the current group
      const MoodleComment = require('../annotationManagement/read/MoodleComment').default
      window.abwa.moodleComment = new MoodleComment()
      window.abwa.moodleComment.init((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleComment, LINE)

  destroyMoodleComment () {
    // Destroy current augmentation operations
    if (!_.isEmpty(window.abwa.moodleComment)) {
      window.abwa.moodleComment.destroy()
    }
  }
  // PVSCL:ENDCOND