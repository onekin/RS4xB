// PVSCL:IFCOND(BrowserStorage,LINE)
      <div id="browserstorageConfigurationCard" class="card annotationServerConfiguration">
        <div class="card-header bg-dark text-white">Browser storage</div>
        <div class="card-body">
          <div class="form-check">
            <button id="viewAnnotationsButton">View annotations</button>
            <button id="restoreDatabaseButton">Restore database</button>
            <button id="backupDatabaseButton">Backup database</button>
            <button id="deleteDatabaseButton">Delete database</button>
          </div>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
import BrowserStorage from '../../annotationServer/browserStorage/BrowserStorage'
import BrowserStorageManager from '../../annotationServer/browserStorage/BrowserStorageManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
import BrowserStorage from '../../annotationServer/browserStorage/BrowserStorage'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
    annotationAnnotationServer = new BrowserStorage({ group: group })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
import BrowserStorageManager from '../../../../annotationServer/browserStorage/BrowserStorageManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.googleSheetProvider.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
import BrowserStorageManager from '../../../../annotationServer/browserStorage/BrowserStorageManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.AnnotationServerClientManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
import BrowserStorageManager from '../annotationServer/browserStorage/BrowserStorageManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.abwa.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
      if (annotationServer === 'browserstorage') {
        // Browser storage
        window.abwa.annotationServerManager = new BrowserStorageManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
              const BrowserStorageManager = require('../annotationServer/browserStorage/BrowserStorageManager').default
              if (_.isEmpty(this.currentGroup) && !_.isEmpty(window.abwa.groupSelector.groups) && LanguageUtils.isInstanceOf(window.abwa.annotationServerManager, BrowserStorageManager)) {
                this.currentGroup = _.first(window.abwa.groupSelector.groups)
              }
              // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
import FileUtils from '../utils/FileUtils'
import BrowserStorageManager from '../annotationServer/browserStorage/BrowserStorageManager'
import FileSaver from 'file-saver'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
    // Browser annotationServer view annotations
    document.querySelector('#viewAnnotationsButton').addEventListener('click', () => {
      window.open(chrome.extension.getURL('content/browserStorage/browserStorageSearch.html#'))
    })
    // Browser annotationServer restore
    document.querySelector('#restoreDatabaseButton').addEventListener('click', () => {
      Alerts.inputTextAlert({
        title: 'Upload your database backup file',
        html: 'Danger zone! <br/>This operation will override current browser annotation server database, deleting all the annotations for all your documents. Please make a backup first.',
        type: Alerts.alertType.warning,
        input: 'file',
        callback: (err, file) => {
          if (err) {
            window.alert('An unexpected error happened when trying to load the alert.')
          } else {
            // Read json file
            FileUtils.readJSONFile(file, (err, jsonObject) => {
              if (err) {
                Alerts.errorAlert({ text: 'Unable to read json file: ' + err.message })
              } else {
                this.restoreDatabase(jsonObject, (err) => {
                  if (err) {
                    Alerts.errorAlert({ text: 'Something went wrong when trying to restore the database' })
                  } else {
                    Alerts.successAlert({ text: 'Database restored.' })
                  }
                })
              }
            })
          }
        }
      })
    })
    // Browser storage backup
    document.querySelector('#backupDatabaseButton').addEventListener('click', () => {
      this.backupDatabase()
    })
    // Browser storage delete
    document.querySelector('#deleteDatabaseButton').addEventListener('click', () => {
      Alerts.confirmAlert({
        title: 'Deleting your database',
        alertType: Alerts.alertType.warning,
        text: 'Danger zone! <br/>This operation will override current browser storage database, deleting all the annotations for all your documents. Please make a backup first.',
        callback: () => {
          this.deleteDatabase((err) => {
            if (err) {
              Alerts.errorAlert({ text: 'Error deleting the database, please try it again or contact developer.' })
            } else {
              Alerts.successAlert({ text: 'Browser storage successfully deleted' })
            }
          })
        }
      })
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
  restoreDatabase (jsonObject, callback) {
    window.options.browserStorage = new BrowserStorageManager()
    window.options.browserStorage.init(() => {
      window.options.browserStorage.saveDatabase(jsonObject, callback)
    })
  }

  backupDatabase () {
    window.options.browserStorage = new BrowserStorageManager()
    window.options.browserStorage.init(() => {
      const stringifyObject = JSON.stringify(window.options.browserStorage.annotationsDatabase, null, 2)
      // Download the file
      const blob = new window.Blob([stringifyObject], {
        type: 'text/plain;charset=utf-8'
      })
      const dateString = (new Date()).toISOString()
      FileSaver.saveAs(blob, 'Local-databaseBackup' + dateString + '.json')
    })
  }

  deleteDatabase (callback) {
    window.options.browserStorage = new BrowserStorageManager()
    window.options.browserStorage.init(() => {
      window.options.browserStorage.cleanDatabase(callback)
    })
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    this.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
import BrowserStorageManager from './annotationServer/browserStorage/BrowserStorageManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage, LINE)
    window.scienceDirect.annotationServerManager = new BrowserStorageManager()
    // PVSCL:ENDCOND// PVSCL:IFCOND(BrowserStorage,LINE)
        // Browser storage
        window.scienceDirect.annotationServerManager = new BrowserStorageManager()
        // PVSCL:ENDCOND