// PVSCL:IFCOND(Classifying, LINE)
import Classifying from '../purposes/Classifying'
// PVSCL:ENDCOND/* PVSCL:IFCOND(Classifying) */  codeId /* PVSCL:ENDCOND */// PVSCL:IFCOND(Classifying, LINE)
    if (codeId) {
      const codeOrTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(codeId)
      tags = tags.concat(codeOrTheme.getTags())
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
    // Get body for classifying
    if (detail.purpose === 'classifying') {
      if (detail.codeId) {
        const codeOrTheme = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(detail.codeId)
        const classifyingBody = new Classifying({ code: codeOrTheme })
        body.push(classifyingBody.serialize())
      }
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Replying, LINE)
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
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider,LINE)
    if (themeOrCode && LanguageUtils.isInstanceOf(themeOrCode, Theme)) {
      title = themeOrCode.name
    } else {
      title = themeOrCode.theme.name + ': ' + themeOrCode.name + ' - ' + themeOrCode.description
    }
    // PVSCL:ELSECOND
    if (themeOrCode) {
      title = themeOrCode.name
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
    // Get the title for form (if it is a classifying annotation, annotation code or theme
    // Get body for classifying
    let themeOrCode
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
    // PVSCL:ENDCOND    // PVSCL:IFCOND(MoodleProvider,LINE)
    if (themeOrCode && LanguageUtils.isInstanceOf(themeOrCode, Theme)) {
      title = themeOrCode.name
    } else {
      title = themeOrCode.theme.name + ': ' + themeOrCode.name + ' - ' + themeOrCode.description
    }
    // PVSCL:ELSECOND
    if (themeOrCode) {
      title = themeOrCode.name
    }
    // PVSCL:ENDCOND    // PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
  static getCodeOrThemeForAnnotation (annotation) {
    const classifyingBody = annotation.getBodyForPurpose('classifying')
    let themeOrCode
    if (classifyingBody) {
      themeOrCode = window.abwa.codebookManager.codebookReader.codebook.getCodeOrThemeFromId(classifyingBody.value.id)
    }
    return themeOrCode
  }
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
      // PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
import Classifying from './purposes/Classifying'
// PVSCL:ENDCOND// PVSCL:IFCOND(Classifying, LINE)
        if (body.purpose === Classifying.purpose) {
          // To remove the purpose from the annotation body
          const tempBody = JSON.parse(JSON.stringify(body))
          delete tempBody.purpose
          // Create new element of type Classifying
          return new Classifying({ code: tempBody.value })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(NOT(Classifying), LINE)
import NoCodebook from './noCodebook/NoCodebook'
// PVSCL:ENDCOND