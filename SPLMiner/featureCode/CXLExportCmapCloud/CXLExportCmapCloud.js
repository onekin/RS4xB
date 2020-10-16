// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
      <div id="cmapCloudConfigurationCard" class="card storageConfiguration">
        <a id="cmapCloudConfiguration"></a>
        <div class="card-header bg-dark text-white">Cmap Cloud configuration</div>
        <div class="card-body">
          <div class="form-group">
            <label id="cmapCloudUser" class="requiredFormInput">Username</label>
            <input type="text" class="form-control" id="cmapCloudUserValue" placeholder="Enter your CmapCloud account email">
          </div>
          <div class="form-group">
            <label id="cmapCloudPassword" class="requiredFormInput">Password</label>
            <input type="password" class="form-control" id="cmapCloudPasswordValue" placeholder="Enter your CmapCloud account password">
          </div>
          <div class="form-group">
            <label id="uidValue"></label>
          </div>
          <button id="checkCmapValues">Validate account</button>
          <label id="cmapCloudMessage"></label>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
      const cxlCloudImageUrl = chrome.extension.getURL('/images/cmapCloud.png')
      this.cxlCloudImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.cxlCloudImage.src = cxlCloudImageUrl
      this.cxlCloudImage.id = 'cxlCloudButton'
      this.cxlCloudImage.title = 'Export map to CmapCloud' // TODO i18n
      this.toolsetBody.appendChild(this.cxlCloudImage)
      // Add menu when clicking on the button
      this.CXLCloudButtonHandler()
      // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
        // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND        // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND        // PVSCL:ELSECOND
        items.export = { name: 'Export CXL' }
        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
        // PVSCL:IFCOND(EvidenceAnnotations, LINE)
        // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
        items.exportWithToolURL = { name: 'Export CXL with tool URLs' }
        // PVSCL:ENDCOND        // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
        items.exportWithHypothesisURL = { name: 'Export CXL with Hypothes.is URLs' }
        // PVSCL:ENDCOND        // PVSCL:ELSECOND
        items.export = { name: 'Export CXL' }
        // PVSCL:ENDCOND        // PVSCL:ENDCOND// PVSCL:IFCOND(CXLImport, LINE)
            if (key === 'import') {
              // AnnotationImporter.importReviewAnnotations()
            }
            // PVSCL:ENDCOND// PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations, LINE)
                  // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ELSECOND
                  if (key === 'export') {
                    CXLExporter.exportCXLFile('cmapCloud', data.userData)
                  }
                  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExport, LINE)
            chrome.runtime.sendMessage({ scope: 'cmapCloud', cmd: 'getUserData' }, (response) => {
              if (response.data) {
                let data = response.data
                if (data.userData.user && data.userData.password && data.userData.uid) {
                  // PVSCL:IFCOND(EvidenceAnnotations, LINE)
                  // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ELSECOND
                  if (key === 'export') {
                    CXLExporter.exportCXLFile('cmapCloud', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)

  CXLCloudButtonHandler () {
    // Create context menu for import export
    $.contextMenu({
      selector: '#cxlCloudButton',
      trigger: 'left',
      build: () => {
        // Create items for context menu
        let items = {}
        // PVSCL:IFCOND(CXLExport, LINE)
            chrome.runtime.sendMessage({ scope: 'cmapCloud', cmd: 'getUserData' }, (response) => {
              if (response.data) {
                let data = response.data
                if (data.userData.user && data.userData.password && data.userData.uid) {
                  // PVSCL:IFCOND(EvidenceAnnotations, LINE)
                  // PVSCL:IFCOND(ToolEvidenceAnnotations, LINE)
                  if (key === 'exportWithHypothesisURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'hypothesis', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:IFCOND(HypothesisEvidenceAnnotations, LINE)
                  if (key === 'exportWithToolURL') {
                    CXLExporter.exportCXLFile('cmapCloud', 'tool', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ELSECOND
                  if (key === 'export') {
                    CXLExporter.exportCXLFile('cmapCloud', data.userData)
                  }
                  // PVSCL:ENDCOND                  // PVSCL:ENDCOND                }
              } else {
                let callback = () => {
                  window.open(chrome.extension.getURL('pages/options.html#cmapCloudConfiguration'))
                }
                Alerts.infoAlert({ text: 'Please, provide us your Cmap Cloud login credentials in the configuration page of the Web extension.', title: 'We need your Cmap Cloud credentials', callback: callback() })
              }
            })
          },
          items: items
        }
      }
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(EvidenceAnnotations and CXLExportCmapCloud, LINE)
    // resource-group-list
    let resourceGroupList = xmlDoc.createElement('resource-group-list')
    map.appendChild(resourceGroupList)
    // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
    // TODO Restore form from credentials saved in storage
    let cmapCloudButton = document.querySelector('#checkCmapValues')
    chrome.runtime.sendMessage({ scope: 'cmapCloud', cmd: 'getUserData' }, (response) => {
      if (response.data) {
        let data = response.data
        if (data.userData.user && data.userData.password && data.userData.uid) {
          document.querySelector('#cmapCloudUserValue').value = data.userData.user
          document.querySelector('#cmapCloudPasswordValue').value = data.userData.password
          document.querySelector('#uidValue').innerHTML = 'User ID: ' + data.userData.uid
          $('#cmapCloudUserValue').prop('readonly', true)
          $('#cmapCloudPasswordValue').prop('readonly', true)
          cmapCloudButton.innerHTML = 'Change user credentials'
        }
      }
    })
    // Button listener
    cmapCloudButton.addEventListener('click', () => {
      if (cmapCloudButton.innerHTML === 'Change user credentials') {
        $('#cmapCloudUserValue').prop('readonly', false)
        $('#cmapCloudPasswordValue').prop('readonly', false)
        document.querySelector('#checkCmapValues').innerHTML = 'Validate account'
      } else if (cmapCloudButton.innerHTML === 'Validate account') {
        let userInputToValidate = document.querySelector('#cmapCloudUserValue').value
        let passwordInputToValidate = document.querySelector('#cmapCloudPasswordValue').value
        this.checkCmapCloudValues(userInputToValidate, passwordInputToValidate)
      }
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
  checkCmapCloudValues (user, password) {
    document.querySelector('#uidValue').className = 'textMessage'
    document.querySelector('#uidValue').innerHTML = 'Validating given credentials ... wait a moment please.'
    chrome.runtime.sendMessage({
      scope: 'cmapCloud',
      cmd: 'getUserUid',
      data: { user: user, password: password }
    }, (response) => {
      if (response.userData) {
        if (response.userData.uid) {
          document.querySelector('#uidValue').innerHTML = 'User ID: ' + response.userData.uid
          $('#cmapCloudUserValue').prop('readonly', true)
          $('#cmapCloudPasswordValue').prop('readonly', true)
          document.querySelector('#checkCmapValues').innerHTML = 'Change user credentials'
        }
        // validated
      } else if (response.err) {
        // Not validated
        document.querySelector('#uidValue').className = 'errorMessage'
        document.querySelector('#uidValue').innerHTML = 'Unable to retrieve the user id for the given credentials.'
      }
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
import CmapCloudBackgroundManager from './background/CmapCloudBackgroundManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(CXLExportCmapCloud, LINE)
    // Initialize cmapCloud manager
    this.cmapCloudManager = new CmapCloudBackgroundManager()
    this.cmapCloudManager.init()

    // PVSCL:ENDCOND