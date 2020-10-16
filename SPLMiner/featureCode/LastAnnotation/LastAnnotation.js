// PVSCL:IFCOND(LastAnnotation, LINE)
import Resume from '../annotationManagement/read/Resume'
// PVSCL:ENDCOND// PVSCL:IFCOND(LastAnnotation, LINE)
      // Set GoToLast image
      const goToLastImageUrl = chrome.extension.getURL('/images/resume.png')
      this.goToLastImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.goToLastImage.src = goToLastImageUrl
      this.goToLastImage.title = 'Go to last annotation' // TODO i18n
      this.toolsetBody.appendChild(this.goToLastImage)
      this.goToLastImage.addEventListener('click', () => {
        this.goToLastButtonHandler()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(LastAnnotation, LINE)
  goToLastButtonHandler () {
    Resume.resume()
  }
  // PVSCL:ENDCOND