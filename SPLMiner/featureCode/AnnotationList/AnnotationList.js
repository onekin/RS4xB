// PVSCL:IFCOND(AnnotationList, LINE)
import AnnotationList from '../annotationManagement/read/AnnotationList'
// PVSCL:ENDCOND// PVSCL:IFCOND(AnnotationList, LINE)
      // Set annotation list image
      const annotationListImageUrl = chrome.extension.getURL('/images/annotationList.png')
      this.annotationListImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.annotationListImage.src = annotationListImageUrl
      this.annotationListImage.title = 'Go to annotation list' // TODO i18n
      this.toolsetBody.appendChild(this.annotationListImage)
      this.annotationListImage.addEventListener('click', () => {
        AnnotationList.openAnnotationList()
      })
      // PVSCL:ENDCOND