// PVSCL:IFCOND(MoodleProvider or MoodleConsumer, LINE)
import URLUtils from '../utils/URLUtils'
// PVSCL:ENDCOND// PVSCL:IFCOND(MoodleConsumer or MoodleProvider, LINE)
    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'getMoodleCustomEndpoint' }, (endpoint) => {
      document.querySelector('#moodleEndpoint').value = endpoint.endpoint
    })

    chrome.runtime.sendMessage({ scope: 'moodle', cmd: 'isApiSimulationActivated' }, (isActivated) => {
      document.querySelector('#apiSimulationCheckbox').checked = isActivated.activated
    })
    document.querySelector('#apiSimulationCheckbox').addEventListener('change', () => {
      this.updateApiSimulationCheckbox()
    })
    document.querySelector('#moodleEndpoint').addEventListener('change', () => {
      this.updateMoodleEndpoint()
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(MoodleProvider or MoodleConsumer, LINE)

  updateApiSimulationCheckbox () {
    const isChecked = document.querySelector('#apiSimulationCheckbox').checked
    chrome.runtime.sendMessage({
      scope: 'moodle',
      cmd: 'setApiSimulationActivation',
      data: { isActivated: isChecked }
    }, (response) => {
      console.debug('Api simulation is updated to: ' + response.activated)
    })
  }

  updateMoodleEndpoint () {
    const value = document.querySelector('#moodleEndpoint').value
    let isValidUrl = URLUtils.isUrl(value)
    if (!isValidUrl) {
      isValidUrl = URLUtils.isUrl(value + '/')
      if (isValidUrl) {
        document.querySelector('#moodleEndpoint').value = value + '/'
      }
    }
    if (isValidUrl) {
      chrome.runtime.sendMessage({
        scope: 'moodle',
        cmd: 'setMoodleCustomEndpoint',
        data: { endpoint: value }
      }, ({ endpoint }) => {
        console.debug('Endpoint updated to ' + endpoint.endpoint)
      })
    } else {
      Alerts.errorAlert({ error: 'URL is malformed' }) // TODO i18n
    }
  }
  // PVSCL:ENDCOND