// PVSCL:IFCOND(MoodleProvider OR Autocomplete, LINE)
import LanguageUtils from '../../utils/LanguageUtils'
import Theme from '../../codebook/model/Theme'
// PVSCL:ENDCOND// PVSCL:IFCOND(Autocomplete,LINE)
import Awesomplete from 'awesomplete'
import Annotation from '../Annotation'
// PVSCL:ENDCOND// PVSCL:IFCOND(Autocomplete,LINE)
      const themeOrCode = CommentingForm.getCodeOrThemeForAnnotation(annotation)
      if (themeOrCode) {
        generateFormObjects.themeOrCode = themeOrCode
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Autocomplete,LINE)
      // Load datalist with previously used texts
      const themeOrCode = CommentingForm.getCodeOrThemeForAnnotation(annotation)
      CommentingForm.retrievePreviouslyUsedComments(themeOrCode).then((previousComments) => {
        const awesomeplete = new Awesomplete(document.querySelector('#comment'), {
          list: previousComments,
          minChars: 0
        })
        // On double click on comment, open the awesomeplete
        document.querySelector('#comment').addEventListener('dblclick', () => {
          awesomeplete.evaluate()
          awesomeplete.open()
        })
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(PreviousAssignments, LINE)
            const regex = /\b(?:https?:\/\/)?[^/:]+\/.*?mod\/assign\/view.php\?id=[0-9]+/g
            text = text.replace(regex, '')
            // PVSCL:ENDCOND// PVSCL:IFCOND(Autocomplete,LINE)
  static retrievePreviouslyUsedComments (themeOrCode) {
    let tag = ''
    if (themeOrCode) {
      if (LanguageUtils.isInstanceOf(themeOrCode, Theme)) {
        tag = Config.namespace + ':' + Config.tags.grouped.group + ':' + themeOrCode.name
      } else {
        tag = Config.namespace + ':' + Config.tags.grouped.subgroup + ':' + themeOrCode.name
      }
    }
    return new Promise((resolve, reject) => {
      window.abwa.annotationServerManager.client.searchAnnotations({
        tag: tag
      }, (err, annotationsRetrieved) => {
        if (err) {
          reject(err)
        } else {
          // Remove those which are from the classification scheme
          const annotationsRetrievedFiltered = annotationsRetrieved.filter(a => a.motivation !== 'codebookDevelopment')
          // Deserialize annotations
          let annotations = annotationsRetrievedFiltered.map(a => Annotation.deserialize(a))
          // Filter by purpose classifying
          annotations = _.filter(annotations, (annotation) => {
            return annotation.getBodyForPurpose('classifying') && annotation.getBodyForPurpose('commenting')
          })
          // Get texts from annotations and send them in callback
          resolve(_.uniq(_.reject(_.map(annotations, (annotation) => {
            // Remove other students moodle urls
            let text = annotation.getBodyForPurpose('commenting').value
            // PVSCL:IFCOND(PreviousAssignments, LINE)
            const regex = /\b(?:https?:\/\/)?[^/:]+\/.*?mod\/assign\/view.php\?id=[0-9]+/g
            text = text.replace(regex, '')
            // PVSCL:ENDCOND            if (text.replace(/ /g, '') !== '') {
              return text
            }
          }), _.isEmpty)))
        }
      })
      return true
    })
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(Autocomplete, LINE) */
@import '../../node_modules/awesomplete/awesomplete';
/* PVSCL:ENDCOND *//* PVSCL:IFCOND(Autocomplete, LINE) */

.swal2-actions {
  z-index: 0 !important;
}

#comment {
  width: 100%;
}

.awesomplete {
  width: 100%;
}
/* PVSCL:ENDCOND *//* PVSCL:IFCOND(Autocomplete, LINE) */
.awesomplete {
  width: 100%;
}
/* PVSCL:ENDCOND */