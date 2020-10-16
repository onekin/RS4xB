// PVSCL:IFCOND(Canvas, LINE)
import Canvas from '../annotationManagement/read/Canvas'
// PVSCL:ENDCOND// PVSCL:IFCOND(Canvas, LINE)
      // Set Canvas image
      const canvasImageUrl = chrome.extension.getURL('/images/overview.png')
      this.canvasImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.canvasImage.src = canvasImageUrl
      this.canvasImage.title = 'Generate canvas' // TODO i18n
      this.toolsetBody.appendChild(this.canvasImage)
      this.canvasImage.addEventListener('click', () => {
        this.canvasButtonHandler()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Canvas, LINE)
  canvasButtonHandler () {
    Canvas.generateCanvas()
  }

  // PVSCL:ENDCOND