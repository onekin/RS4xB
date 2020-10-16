// PVSCL:IFCOND(SentimentAnalysis,LINE)
import axios from 'axios'
import qs from 'qs'
// PVSCL:ENDCOND// PVSCL:IFCOND(SentimentAnalysis, LINE)
      if (preConfirmData.comment !== null && preConfirmData.comment !== '') {
        CommentingForm.isOffensive(preConfirmData.comment)
          .then((isOffensive) => {
            if (isOffensive) {
              // The comment is negative or offensive
              Alerts.confirmAlert({
                text: 'The message may be ofensive. Please modify it.',
                showCancelButton: true,
                cancelButtonText: 'Modify comment',
                confirmButtonText: 'Save as it is',
                reverseButtons: true,
                callback: callback,
                cancelCallback: () => {
                  showForm(preConfirmData)
                }
              })
            }
          })
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(SentimentAnalysis, LINE)
  /**
   * Giving a text check if is negative or not
   * @param text
   * @returns {Promise<void>}
   */
  static async isOffensive (text) {
    const settings = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: 'http://text-processing.com/api/sentiment/',
      data: qs.stringify({ text: text })
    }
    axios(settings).then((response) => {
      return response.data && response.data.label === 'neg' && response.data.probability.neg > 0.55
    })
  }
  // PVSCL:ENDCOND