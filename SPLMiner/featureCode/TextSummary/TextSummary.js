// PVSCL:IFCOND(TextSummary, LINE)
import TextSummary from '../annotationManagement/read/TextSummary'
// PVSCL:ENDCOND// PVSCL:IFCOND(TextSummary, LINE)
      // Set TextSummary image
      const textSummaryImageUrl = chrome.extension.getURL('/images/generator.png')
      this.textSummaryImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.textSummaryImage.src = textSummaryImageUrl
      this.textSummaryImage.title = 'Generate review report' // TODO i18n
      this.toolsetBody.appendChild(this.textSummaryImage)
      this.textSummaryImage.addEventListener('click', () => {
        this.textSummaryButtonHandler()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(TextSummary, LINE)
  textSummaryButtonHandler () {
    TextSummary.generateReview()
  }

  // PVSCL:ENDCOND