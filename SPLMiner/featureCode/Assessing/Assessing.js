// PVSCL:IFCOND(Assessing, LINE)

    // PVSCL:ENDCOND// PVSCL:IFCOND(Assessing, LINE)
import Assessing from './Assessing'
// PVSCL:ENDCOND// PVSCL:IFCOND(Assessing, LINE)
          // Assessment category support
          const assessmentBody = annotation.getBodyForPurpose(Assessing.purpose)
          if (assessmentBody) {
            assessmentBody.value = preConfirmData.categorizeData
          } else {
            annotation.body.push(new Assessing({ value: preConfirmData.categorizeData }))
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(Assessing, LINE)
import Assessing from './purposes/Assessing'
// PVSCL:ENDCOND// PVSCL:IFCOND(Assessing, LINE)
        if (body.purpose === Assessing.purpose) {
          return new Assessing({ value: body.value })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(Assessing, LINE)
import Assessing from '../annotationManagement/purposes/Assessing'
// PVSCL:ENDCOND