// PVSCL:IFCOND(Categorize, LINE)
      preConfirmData.categorizeData = document.querySelector('#categorizeDropdown').value
      // PVSCL:ENDCOND// PVSCL:IFCOND(Categorize, LINE)
    const select = document.createElement('select')
    select.id = 'categorizeDropdown'
    const option = document.createElement('option')
    // Empty option
    option.text = ''
    option.value = ''
    select.add(option)
    Config.assessmentCategories.forEach(category => {
      const option = document.createElement('option')
      option.text = category.name
      option.value = category.name
      select.add(option)
    })
    html += select.outerHTML
    // PVSCL:ENDCOND// PVSCL:IFCOND(Categorize, LINE)
      // Get if annotation has a previous category
      const assessingBody = annotation.getBodyForPurpose(Assessing.purpose)
      // Change value to previously selected one
      if (assessingBody) {
        document.querySelector('#categorizeDropdown').value = assessingBody.value
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Categorize, LINE)
        let assessingBody = annotations[a].getBodyForPurpose(Assessing.purpose)
        let level
        if (assessingBody) {
          level = assessingBody.value
        }
        // PVSCL:ENDCOND/* PVSCL:IFCOND(Categorize) */,
          level/* PVSCL:ENDCOND */