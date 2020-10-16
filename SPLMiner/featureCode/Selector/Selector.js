// PVSCL:IFCOND(Selector, LINE)
        if (document.getSelection().toString().length > 0) {
          target[0].selector = CreateAnnotation.getSelectorsOfSelectedTextContent()
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Selector, LINE)
        // If annotations have a selector, are highlightable in the target
        this.highlightAnnotations(unHiddenAnnotations)
        // PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
      // Annotation color is based on codebook color
      // Get annotated code id
      const bodyWithClassifyingPurpose = annotation.getBodyForPurpose('classifying')
      if (bodyWithClassifyingPurpose) {
        const codeOrTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(bodyWithClassifyingPurpose.value.id)
        if (codeOrTheme) {
          color = codeOrTheme.color
        } else {
          const ColorUtils = require('../../utils/ColorUtils').default
          color = ColorUtils.getDefaultColor()
        }
      } else {
        const ColorUtils = require('../../utils/ColorUtils').default
        color = ColorUtils.getDefaultColor()
      }
      // PVSCL:ELSECOND
      // Annotation color used is default in grey
      const ColorUtils = require('../../utils/ColorUtils').default
      color = ColorUtils.getDefaultColor()
      // PVSCL:ENDCOND// PVSCL:IFCOND(Linking, LINE)
      // Annotation color is based on codebook color
      // Get annotated code id
      let bodyWithLinkingPurpose = annotation.getBodyForPurpose('linking')
      if (bodyWithLinkingPurpose) {
        const ColorUtils = require('../../utils/ColorUtils').default
        color = ColorUtils.getDefaultColor()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Update OR Delete, LINE)
        // Create context menu event for highlighted elements
        this.createContextMenuForAnnotation(annotation)
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
            }/* PVSCL:ENDCOND *//* PVSCL:IFCOND(Commenting) */ else if (key === 'comment') {
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
            } /* PVSCL:ENDCOND */