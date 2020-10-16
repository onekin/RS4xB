// PVSCL:IFCOND(CodebookTypology->pv:Attribute('name')->pv:ToLowerCase()->pv:Size()>1, LINE)
  group: 'PVSCL:EVAL(CodebookTypology->pv:Attribute('name')->pv:ToLowerCase())'
// PVSCL:ELSECOND
  group: 'theme'
// PVSCL:ENDCOND