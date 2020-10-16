import html2canvas from 'html2canvas'
import FileSaver from 'file-saver'
import JsPDF from 'jspdf'
import Alerts from '../../utils/Alerts'
import _ from 'lodash'
import PDF from '../../target/formats/PDF'

window.html2canvas = html2canvas

class Screenshots {
  static takeScreenshot (callback) {
    let promise = null
    if (window.abwa.targetManager.documentFormat === PDF) {
      // Current viewer status
      const currentScale = window.PDFViewerApplication.pdfViewer.currentScale
      window.PDFViewerApplication.pdfViewer.currentScale = 1
      const currentPage = window.PDFViewerApplication.page
      // Go to first page
      window.PDFViewerApplication.page = 1

      Alerts.loadingAlert({
        title: 'Please hold on',
        text: 'We are creating the annotated PDF document (<span></span> of ' + window.PDFViewerApplication.pagesCount + ')',
        timerIntervalHandler: (swal) => {
          swal.getContent().querySelector('span').textContent = window.PDFViewerApplication.page
        }
      })
      // Create pdf file
      const pdf = new JsPDF('p', 'cm', 'a4', true)
      // Redraw annotations
      window.abwa.annotationManagement.annotationReader.redrawAnnotations()
      // Append rubric
      const criteriaElement = document.querySelector('#buttonContainer')
      if (criteriaElement) {
        html2canvas(criteriaElement).then((rubric) => {
          const offsetWidth = criteriaElement.offsetWidth
          const offsetHeight = criteriaElement.offsetHeight
          pdf.addImage(rubric.toDataURL(), 'png', 0, 0, 29 * offsetWidth / offsetHeight, 29)
        })
      }
      // Create promises array
      const promisesData = [...Array(window.PDFViewerApplication.pagesCount).keys()].map((index) => { return { i: index } })
      // Page screenshot promise
      const takePDFPageScreenshot = (d) => {
        return new Promise((resolve, reject) => {
          // Go to page
          window.PDFViewerApplication.page = d.i + 1
          // Redraw annotations
          window.abwa.annotationManagement.annotationReader.redrawAnnotations()
          setTimeout(() => {
            html2canvas(document.querySelector('.page[data-page-number="' + (d.i + 1) + '"]'), { scale: 1 }).then((canvas) => {
              resolve()
              if (!(d.i === 0 && !_.isElement(criteriaElement))) {
                pdf.addPage()
              }
              pdf.addImage(canvas.toDataURL(), 'png', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), '', 'FAST')
            })
          }, 750)
        })
      }
      // Wait a little bit to draw annotations in first page
      setTimeout(() => {
        // Reduce promise chain
        const promiseChain = promisesData.reduce(
          (chain, d) => chain.then(() => {
            return takePDFPageScreenshot(d)
          }), Promise.resolve([])
        )
        // To execute after promise chain is finished
        promiseChain.then((canvases) => {
          // Restore previous page and zoom
          window.PDFViewerApplication.pdfViewer.currentScale = currentScale
          window.PDFViewerApplication.page = currentPage
          Alerts.closeAlert()
          pdf.save('activity.pdf')
          // Callback
          if (_.isFunction(callback)) {
            callback()
          }
        })
      }, 3000)
    } else {
      promise = new Promise((resolve) => {
        html2canvas(document.body).then((canvas) => {
          resolve(canvas)
        })
      })
    }
    promise.then((canvas) => {
      canvas.toBlob((blob) => {
        FileSaver.saveAs(blob, 'exam.png')
      })
    })
  }
}

export default Screenshots
Screenshots.js// PVSCL:IFCOND(AnnotatedPDF, LINE)
import Screenshots from '../annotationManagement/read/Screenshots'
// PVSCL:ENDCOND// PVSCL:IFCOND(AnnotatedPDF, LINE)
      // Set screenshot image
      const screenshotImageUrl = chrome.extension.getURL('/images/screenshot.png')
      this.screenshotImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.screenshotImage.src = screenshotImageUrl
      this.screenshotImage.title = 'Take a screenshot of the current document' // TODO i18n
      this.toolsetBody.appendChild(this.screenshotImage)
      this.screenshotImage.addEventListener('click', () => {
        this.screenshotButtonHandler()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(AnnotatedPDF, LINE)
  screenshotButtonHandler () {
    Screenshots.takeScreenshot()
  }

  // PVSCL:ENDCOND