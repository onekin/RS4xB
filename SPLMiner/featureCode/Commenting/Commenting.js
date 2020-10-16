import Body from './Body'

class Commenting extends Body {
  constructor ({ purpose = Commenting.purpose, value }) {
    super(purpose)
    this.value = value
  }

  populate (text) {
    super.populate(text)
  }

  serialize () {
    return super.serialize()
  }

  tooltip () {
    return 'Comment: ' + this.value
  }
}

Commenting.purpose = 'commenting'

export default Commenting
Commenting.js// PVSCL:IFCOND(Commenting, LINE)
import Commenting from './Commenting'
// PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
    const replyCommentBody = reply.body.find(body => body.purpose === 'commenting')
    let textComment = 'No comment'
    if (replyCommentBody) {
      textComment = replyCommentBody.value
    }
    htmlText += '<span class="' + textSpanClassName + '">' + textComment + '</span>'
    // PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
import CommentingForm from '../purposes/CommentingForm'
import Alerts from '../../utils/Alerts'
// PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
            items.comment = { name: 'Comment' }
            // PVSCL:ENDCOND/* PVSCL:IFCOND(Commenting) */ else if (key === 'comment') {
              // Open commenting form
              CommentingForm.showCommentingForm(annotation, (err, annotation) => {
                if (err) {
                  Alerts.errorAlert({ text: 'Unexpected error when commenting. Please reload webpage and try again. Error: ' + err.message })
                } else {
                  LanguageUtils.dispatchCustomEvent(Events.updateAnnotation, {
                    annotation: annotation
                  })
                }
              })
            } /* PVSCL:ENDCOND */// PVSCL:IFCOND(Commenting, LINE)
import Commenting from './purposes/Commenting'
// PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
    // Hypothes.is supports comments, but they are not stored in body, they use text
    const commentingBody = this.getBodyForPurpose(Commenting.purpose)
    if (commentingBody) {
      data.text = commentingBody.value
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
        if (body.purpose === Commenting.purpose) {
          return new Commenting({ value: body.value })
        }
        // PVSCL:ENDCOND