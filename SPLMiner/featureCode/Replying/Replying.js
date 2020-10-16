// PVSCL:IFCOND(Replying, LINE)
    if (!_.isEmpty(annotation.references)) {
      // Retrieve annotation that has the classification body
      const repliedAnnotationId = annotation.references[0]
      const repliedAnnotation = window.abwa.annotationManagement.annotationReader.allAnnotations.find(a => a.id === repliedAnnotationId)
      themeOrCode = CommentingForm.getCodeOrThemeForAnnotation(repliedAnnotation)
    } else {
      themeOrCode = CommentingForm.getCodeOrThemeForAnnotation(annotation)
    }
    // PVSCL:ELSECOND
    themeOrCode = CommentingForm.getCodeOrThemeForAnnotation(annotation)
    // PVSCL:ENDCONDimport AnnotationUtils from '../../utils/AnnotationUtils'
import Config from '../../Config'
import moment from 'moment'
import _ from 'lodash'

class ReplyAnnotation {
  /**
   * Returns if annotation is replied by any annotation in replies
   * @param annotation
   * @param allReplies
   */
  static hasReplies (annotation, allReplies) {
    try {
      return ReplyAnnotation.getReplies(annotation, allReplies).length > 0
    } catch (e) {
      return false
    }
  }

  /**
   * Returns all the reply annotations that reply "annotation"
   * @param annotation
   * @param allReplies
   * @returns {Array}
   */
  static getReplies (annotation, allReplies) {
    let replies = _.filter(allReplies, (replyAnnotation) => {
      return AnnotationUtils.isReplyOf(annotation, replyAnnotation)
    })
    replies = _.orderBy(replies, 'updated')
    return replies
  }

  static createRepliesData (annotation, replyAnnotations = []) {
    let htmlText = ''
    // Add feedback comment text
    htmlText += ReplyAnnotation.createReplyLog(annotation)
    htmlText += '<hr/>'
    // Get replies for this annotation
    const replies = ReplyAnnotation.getReplies(annotation, replyAnnotations)
    // What and who
    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i]
      htmlText += this.createReplyLog(reply)
      if (replies.length - 1 > i) {
        htmlText += '<hr/>'
      }
    }
    return { htmlText: htmlText, replies: replies }
  }

  static createReplyLog (reply) {
    let htmlText = ''
    let userSpanClassName = 'reply_user'
    let textSpanClassName = 'reply_text'
    const dateSpanClassName = 'reply_date'
    // PVSCL:IFCOND( Validate, LINE )

    // Add user name
    if (reply.creator === window.abwa.groupSelector.getCreatorData()) {
      htmlText += '<span class="' + userSpanClassName + '">You: </span>'
    } else {
      const username = reply.creator.replace(window.abwa.annotationServerManager.annotationServerMetadata.userUrl, '')
      htmlText += '<span class="' + userSpanClassName + '">' + username + ': </span>'
    }
    // PVSCL:IFCOND(Commenting, LINE)

    if (reply.modified) {
      htmlText += '<span title="' + moment(reply.modified).format('MMMM Do YYYY, h:mm:ss a') + '" class="' + dateSpanClassName + '">' + moment(reply.modified).fromNow() + '</span>'
    }

    return htmlText
  }
}

export default ReplyAnnotation
ReplyAnnotation.js// PVSCL:IFCOND(Replying, LINE)
import ReplyAnnotation from '../purposes/ReplyAnnotation'
// PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
      // If annotation is replying another annotation, add to reply annotation list
      if (annotation.references.length > 0) {
        this.replyAnnotations.push(annotation)
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
      // Remove annotations that reply to this one (if user is the same)
      _.remove(this.allAnnotations, (currentAnnotation) => {
        return _.includes(currentAnnotation.references, (refId) => {
          return annotation.id === refId
        })
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
        // Remove annotations that reply to this one (if user is the same)
        _.remove(this.allAnnotations, (currentAnnotation) => {
          return _.includes(currentAnnotation.references, (refId) => {
            return annotation.id === refId
          })
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
        this.replyAnnotations = _.filter(this.allAnnotations, (annotation) => {
          return annotation.references && annotation.references.length > 0
        })
        // PVSCL:ENDCOND// PVSCL:IFCOND(Commenting, LINE)
            items.comment = { name: 'Comment' }
            // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
          if (ReplyAnnotation.hasReplies(annotation, this.replyAnnotations)) {
            items.reply = { name: 'Reply' }
          } else {
            // PVSCL:IFCOND(Commenting, LINE)
            items.comment = { name: 'Comment' }
            // PVSCL:ENDCOND          }
          // PVSCL:ELSEIFCOND(Commenting, LINE)
          items.comment = { name: 'Comment' }
          // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
          items.reply = { name: 'Reply' }
          // PVSCL:ENDCOND/* PVSCL:IFCOND(Replying) */ else if (key === 'reply') {
              // Update your last reply if exists, otherwise create a new reply
              const replies = ReplyAnnotation.getReplies(annotation, this.replyAnnotations)
              // Get last reply and check if it is current user's annotation or not
              const lastReply = _.last(replies)
              if (lastReply && lastReply.creator === window.abwa.groupSelector.getCreatorData()) {
                // Annotation to be updated is the reply
                const replyData = ReplyAnnotation.createRepliesData(annotation, this.replyAnnotations)
                const repliesHtml = replyData.htmlText
                CommentingForm.showCommentingForm(lastReply, (err, replyAnnotation) => {
                  if (err) {
                    // Show error
                    Alerts.errorAlert({ text: 'Unexpected error when updating reply. Please reload webpage and try again. Error: ' + err.message })
                  } else {
                    LanguageUtils.dispatchCustomEvent(Events.updateAnnotation, {
                      annotation: replyAnnotation
                    })
                  }
                }, repliesHtml)
              } else {
                // Annotation to be created is new and replies the previous one
                // Create target for new reply annotation
                const target = [{ source: annotation.target[0].source }]
                const replyAnnotation = new Annotation({ target: target, references: [annotation.id] })
                const replyData = ReplyAnnotation.createRepliesData(annotation, this.replyAnnotations)
                const repliesHtml = replyData.htmlText
                CommentingForm.showCommentingForm(replyAnnotation, (err, replyAnnotation) => {
                  if (err) {
                    // Show error
                    Alerts.errorAlert({ text: 'Unexpected error when updating reply. Please reload webpage and try again. Error: ' + err.message })
                  } else {
                    LanguageUtils.dispatchCustomEvent(Events.createAnnotation, {
                      purpose: 'replying',
                      replyingAnnotation: replyAnnotation,
                      repliedAnnotation: annotation
                    })
                  }
                }, repliesHtml)
              }
            }/* PVSCL:ENDCOND */