// PVSCL:IFCOND(ExportCodebook or Export, LINE)

  toObjects (name) {
    const object = {
      name: name,
      definition: []
    }
    // For each criteria create the object
    for (let i = 0; i < this.themes.length; i++) {
      const theme = this.themes[i]
      if (LanguageUtils.isInstanceOf(theme, Theme)) {
        object.definition.push(theme.toObjects())
      }
    }
    return object
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Export, LINE)
import AnnotationExporter from '../importExport/AnnotationExporter'
// PVSCL:ENDCOND