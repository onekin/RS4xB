// PVSCL:IFCOND(GoogleSheetConsumer,LINE)
import _ from 'lodash'
// PVSCL:ENDCOND/* PVSCL:IFCOND(GoogleSheetConsumer) */ else if (request.cmd === 'createSpreadsheet') {
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (_.isUndefined(token)) {
              sendResponse({ error: new Error('Unable to retrieve token, please check if you have synced your browser and your google account. If the application did not ask you for login, please contact developer.') })
            } else {
              this.googleSheetClient = new GoogleSheetClient(token)
              this.googleSheetClient.createSpreadsheet(request.data, (err, result) => {
                if (err) {
                  sendResponse({ error: err })
                } else {
                  sendResponse(result)
                }
              })
            }
          })
          return true
        } else if (request.cmd === 'updateSpreadsheet') {
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            this.googleSheetClient = new GoogleSheetClient(token)
            this.googleSheetClient.updateSheetCells(request.data, (err, result) => {
              if (err) {
                sendResponse({ error: err })
              } else {
                sendResponse(result)
              }
            })
          })
          return true
        }/* PVSCL:ENDCOND */import GoogleSheetClient from '../googleSheets/GoogleSheetClient'
// PVSCL:IFCOND(GoogleSheetConsumer,LINE)


class GoogleSheetsManager {
  constructor () {
    this.googleSheetClient = null
  }

  init () {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.scope === 'googleSheets') {
        if (request.cmd === 'getToken') {
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError })
            } else {
              sendResponse({ token: token })
            }
          })
          return true
        } else if (request.cmd === 'getTokenSilent') {
          chrome.identity.getAuthToken({ interactive: false }, function (token) {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError })
            } else {
              sendResponse({ token: token })
            }
          })
          return true
        }/* PVSCL:IFCOND(GoogleSheetProvider) */ else if (request.cmd === 'getSpreadsheet') {
/* PVSCL:IFCOND(GoogleSheetConsumer) */ else if (request.cmd === 'createSpreadsheet') {

      }
    })
  }
}

export default GoogleSheetsManager
GoogleSheetsManager.js// PVSCL:IFCOND(GoogleSheetConsumer, LINE)
import GoogleSheetGenerator from '../annotationManagement/read/GoogleSheetGenerator'
// PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetConsumer, LINE)
      // Set Spreadsheet generation image
      const googleSheetImageUrl = chrome.extension.getURL('/images/googleSheet.svg')
      this.googleSheetImage = $(toolsetButtonTemplate.content.firstElementChild).clone().get(0)
      this.googleSheetImage.src = googleSheetImageUrl
      this.googleSheetImage.title = 'Generate a spreadsheet with classified content' // TODO i18n
      this.toolsetBody.appendChild(this.googleSheetImage)
      this.googleSheetImage.addEventListener('click', () => {
        GoogleSheetGenerator.generate()
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetConsumer, LINE)

  createSpreadsheet (data, callback) {
    $.ajax({
      method: 'POST',
      url: this.baseURI,
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': '*/*',
        'Access-Control-Allow-Origin': '*'
      },
      data: JSON.stringify(data)
    }).done((result) => {
      callback(null, result)
    }).fail(() => {
      callback(new Error('Unable to create a spreadsheet'))
    })
  }

  /**
   * Given data to update spreadsheet, it updates in google sheets using it's API
   * @param data Contains data.spreadsheetId, sheetId, rows, rowIndex and columnIndex
   * @param callback
   */
  updateSheetCells (data = {}, callback) {
    const spreadsheetId = data.spreadsheetId
    const sheetId = data.sheetId || 0
    const rows = data.rows
    const rowIndex = data.rowIndex
    const columnIndex = data.columnIndex
    if (spreadsheetId && _.isEmpty(sheetId) && _.isArray(rows) && _.isNumber(rowIndex) && _.isNumber(columnIndex)) {
      const settings = {
        async: true,
        crossDomain: true,
        url: this.baseURI + '/' + spreadsheetId + ':batchUpdate',
        data: JSON.stringify({
          requests: [
            {
              updateCells: {
                rows: rows,
                fields: '*',
                start: {
                  sheetId: sheetId,
                  rowIndex: rowIndex,
                  columnIndex: columnIndex
                }
              }
            }
          ]
        }),
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
      // Call using axios
      axios(settings).then((response) => {
        if (_.isFunction(callback)) {
          callback(null, response.data)
        }
      })
    } else {
      callback(new Error('To update spreadsheet it is required '))
    }
  }
  // PVSCL:ENDCONDimport axios from 'axios'
import _ from 'lodash'

let $
if (typeof window === 'undefined') {
  $ = require('jquery')(global.window)
} else {
  $ = require('jquery')
}

class GoogleSheetClient {
  constructor (token) {
    if (token) {
      this.token = token
    }
    this.baseURI = 'https://sheets.googleapis.com/v4/spreadsheets'
  }
  // PVSCL:IFCOND(GoogleSheetConsumer, LINE)


  getSpreadsheet (spreadsheetId, callback) {
    $.ajax({
      async: true,
      crossDomain: true,
      method: 'GET',
      url: this.baseURI + '/' + spreadsheetId,
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      },
      data: {
        includeGridData: true
      }
    }).done((result) => {
      callback(null, result)
    }).fail(() => {
      callback(new Error('Unable to retrieve gsheet'))
    })
  }

  getSheet (sheetData, callback) {
    this.getSpreadsheet(sheetData.spreadsheetId, (err, result) => {
      if (err) {
        callback(err)
      } else {
        // Retrieve sheet by id if defined
        const sheet = _.find(result.sheets, (sheet) => { return sheet.properties.sheetId === parseInt(sheetData.sheetId) })
        if (_.isFunction(callback)) {
          callback(null, sheet)
        }
      }
    })
  }

  getHyperlinkFromCell (cell) {
    // Try to get by hyperlink property
    if (cell.hyperlink) {
      return cell.hyperlink
    } else {
      if (!_.isEmpty(cell.userEnteredValue) && !_.isEmpty(cell.userEnteredValue.formulaValue)) {
        const value = cell.userEnteredValue.formulaValue
        const hyperlinkMatch = value.match(/=hyperlink\("([^"]+)"/i)
        if (!_.isEmpty(hyperlinkMatch) && hyperlinkMatch.length > 1) {
          return hyperlinkMatch[1].replace(/(^\w+:|^)\/\//, '')
        }
      }
    }
  }

  batchUpdate (data, callback) {
    $.ajax({
      async: true,
      crossDomain: true,
      method: 'POST',
      url: 'https://sheets.googleapis.com/v4/spreadsheets/' + data.spreadsheetId + ':batchUpdate',
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        requests: data.requests
      })
    }).done(() => {
      // TODO Manage responses
      if (_.isFunction(callback)) {
        callback(null)
      }
    }).fail((xhr, textStatus) => {
      if (_.isFunction(callback)) {
        callback(new Error('Error in batch update, error: ' + textStatus))
      }
    })
  }

  updateCell (data, callback) {
    const requests = []
    requests.push(this.createRequestUpdateCell(data))
    const batchUpdateData = {
      spreadsheetId: data.spreadsheetId,
      requests: requests
    }
    this.batchUpdate(batchUpdateData, (err) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        if (_.isFunction(callback)) {
          callback(null)
        }
      }
    })
  }

  /**
   *
   * @param {{sheetId: number, row: number, column: number, backgroundColor: *, link: string, value: string, numberOfColumns: number, numberOfRows: number}} data
   * @returns {{repeatCell: {range: {sheetId: *|null, startRowIndex: number, endRowIndex: number, startColumnIndex, endColumnIndex: *}, cell: {userEnteredFormat: {backgroundColor}, userEnteredValue: {formulaValue: string}}, fields: string}}}
   */
  createRequestUpdateCell (data) {
    data.numberOfColumns = _.isNumber(data.numberOfColumns) ? data.numberOfColumns : 1
    data.numberOfRows = _.isNumber(data.numberOfRows) ? data.numberOfRows : 1
    let userEnteredValue = null
    if (_.isString(data.link)) {
      let formulaValue = '=HYPERLINK("' + data.link + '"; "' + data.value.replace(/"/g, '""') + '")'
      if (!_.isNaN(_.toNumber(data.value))) { // If is a number, change
        formulaValue = '=HYPERLINK("' + data.link + '"; ' + _.toNumber(data.value) + ')'
      }
      userEnteredValue = { formulaValue: formulaValue }
    } else {
      userEnteredValue = { stringValue: data.value }
    }
    return {
      repeatCell: {
        range: {
          sheetId: data.sheetId,
          startRowIndex: data.row,
          endRowIndex: data.row + data.numberOfRows,
          startColumnIndex: data.column,
          endColumnIndex: data.column + data.numberOfColumns
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: data.backgroundColor
          },
          userEnteredValue: userEnteredValue
        },
        fields: 'userEnteredFormat(backgroundColor), userEnteredValue(formulaValue)'
      }
    }
  }

  createRequestUpdateCells (data) {
    return {
      updateCells: {
        rows: {
          values: data.cells
        },
        fields: '*',
        range: data.range
      }
    }
  }

  /**
   * Create a request for google sheet to copy a cell from source to destination.
   * @param {{sheetId: number, sourceRow: number, pasteType: string, sourceColumn: number, sourceNumberOfRows: number, sourceNumberOfColumns: number, destinationNumberOfRows: number, destinationNumberOfColumns: number, destinationRow: number, destinationColumn: number}} data
   * @returns {{copyPaste: {source: {sheetId: number|*|null, startRowIndex: *, endRowIndex: *, startColumnIndex: *, endColumnIndex: *}, destination: {sheetId: number|*|null, startRowIndex: *, endRowIndex: *, startColumnIndex: *, endColumnIndex: *}, pasteType: string, pasteOrientation: string}}}
   */
  createRequestCopyCell (data) {
    // TODO Check required params are defined
    data.sourceNumberOfColumns = _.isNumber(data.sourceNumberOfColumns) ? data.sourceNumberOfColumns : 1
    data.sourceNumberOfRows = _.isNumber(data.sourceNumberOfRows) ? data.sourceNumberOfRows : 1
    data.destinationNumberOfColumns = _.isNumber(data.destinationNumberOfColumns) ? data.destinationNumberOfColumns : 1
    data.destinationNumberOfRows = _.isNumber(data.destinationNumberOfRows) ? data.destinationNumberOfRows : 1
    data.pasteType = _.isString(data.pasteType) ? data.pasteType : 'PASTE_NORMAL'
    return {
      copyPaste: {
        source: {
          sheetId: data.sheetId,
          startRowIndex: data.sourceRow,
          endRowIndex: data.sourceRow + data.sourceNumberOfRows,
          startColumnIndex: data.sourceColumn,
          endColumnIndex: data.sourceColumn + data.sourceNumberOfColumns
        },
        destination: {
          sheetId: data.sheetId,
          startRowIndex: data.destinationRow,
          endRowIndex: data.destinationRow + data.destinationNumberOfRows,
          startColumnIndex: data.destinationColumn,
          endColumnIndex: data.destinationColumn + data.destinationNumberOfColumns
        },
        pasteType: data.pasteType,
        pasteOrientation: 'NORMAL'
      }
    }
  }

  /**
   *
   * @param {{sheetId: *, length: number}} data
   * @returns {{appendDimension: {sheetId: *|null, dimension: string, length}}}
   */
  createRequestAppendEmptyColumn (data) {
    return {
      appendDimension: {
        sheetId: data.sheetId,
        dimension: 'COLUMNS',
        length: data.length
      }
    }
  }

  createRequestInsertEmptyColumn (data) {
    data.numberOfColumns = _.isNumber(data.numberOfColumns) ? data.numberOfColumns : 0
    return {
      insertDimension: {
        range: {
          sheetId: data.sheetId,
          dimension: 'COLUMNS',
          startIndex: data.startIndex,
          endIndex: data.startIndex + data.numberOfColumns
        },
        inheritFromBefore: false
      }
    }
  }
}

export default GoogleSheetClient
GoogleSheetClient.jsimport _ from 'lodash'
import GoogleSheetClient from './GoogleSheetClient'
import Alerts from '../utils/Alerts'

const reloadIntervalInSeconds = 10 // Reload the google sheet client every 10 seconds

class GoogleSheetsClientManager {
  constructor () {
    this.googleSheetClient = null
  }

  init (callback) {
    this.loadGSheetClient(() => {
      // Start reloading of client
      this.reloadInterval = setInterval(() => {
        this.reloadGSheetClient()
      }, reloadIntervalInSeconds * 1000)
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }

  loadGSheetClient (callback) {
    this.logInGoogleSheets((err, token) => {
      if (err) {
        this.googleSheetClient = null
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        this.googleSheetClient = new GoogleSheetClient(token)
        if (_.isFunction(callback)) {
          callback(null)
        }
      }
    })
  }

  reloadGSheetClient () {
    this.logInSilentGoogleSheets((err, token) => {
      if (err) {
        this.googleSheetClient = null
      } else {
        this.googleSheetClient = new GoogleSheetClient(token)
      }
    })
  }

  logInSilentGoogleSheets (callback) {
    // Promise if user has not given permissions in google sheets
    chrome.runtime.sendMessage({ scope: 'googleSheets', cmd: 'getTokenSilent' }, (result) => {
      if (result.token) {
        if (_.isFunction(callback)) {
          callback(null, result.token)
        }
      }
    })
  }

  /**
   * Login in google sheets and ask user if not logged in
   * @param callback - The callback for the response to log in google sheets
   */
  logInGoogleSheets (callback) {
    // Promise if user has not given permissions in google sheets
    chrome.runtime.sendMessage({ scope: 'googleSheets', cmd: 'getTokenSilent' }, (result) => {
      if (result.token) {
        if (_.isFunction(callback)) {
          callback(null, result.token)
        }
      } else {
        this.askUserToLogInGoogleSheets((err, token) => {
          if (err) {
            callback(err)
          } else {
            callback(null, token)
          }
        })
      }
    })
  }

  /**
   * Ask user to log in google sheets
   * @param callback
   */
  askUserToLogInGoogleSheets (callback) {
    Alerts.confirmAlert({
      title: 'Google sheets login required',
      text: chrome.i18n.getMessage('GoogleSheetLoginRequired'),
      callback: (err, result) => {
        if (err) {
          callback(new Error('Unable to create message to ask for login'))
        } else {
          if (result) {
            chrome.runtime.sendMessage({ scope: 'googleSheets', cmd: 'getToken' }, (result) => {
              if (result.error) {
                if (_.isFunction(callback)) {
                  callback(result.error)
                }
              } else {
                if (_.isFunction(callback)) {
                  callback(null, result.token)
                }
              }
            })
          } else {
            callback(new Error('User don\'t want to log in google sheets'))
          }
        }
      }
    })
  }
}

export default GoogleSheetsClientManager
GoogleSheetsClientManager.js// PVSCL:IFCOND(GoogleSheetProvider or GoogleSheetConsumer, LINE)
import GoogleSheetsManager from './background/GoogleSheetsManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider or GoogleSheetConsumer, LINE)
    // Initialize google sheets manager
    this.googleSheetsManager = new GoogleSheetsManager()
    this.googleSheetsManager.init()

    // PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider OR GoogleSheetConsumer)
    "identity",PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider, LINE)
    "client_id": "PVSCL:EVAL(GoogleSheetProvider->pv:Attribute('clientId'))",
    PVSCL:ELSEIFCOND(GoogleSheetConsumer)
    "client_id": "PVSCL:EVAL(GoogleSheetConsumer->pv:Attribute('clientId'))",
    PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider or GoogleSheetConsumer, LINE)
  "oauth2": {
  	PVSCL:IFCOND(GoogleSheetProvider, LINE)
    "client_id": "PVSCL:EVAL(GoogleSheetProvider->pv:Attribute('clientId'))",
    PVSCL:ELSEIFCOND(GoogleSheetConsumer)
    "client_id": "PVSCL:EVAL(GoogleSheetConsumer->pv:Attribute('clientId'))",
    PVSCL:ENDCOND    "scopes": [
      "https://www.googleapis.com/auth/spreadsheets"
    ]
  },
  PVSCL:ENDCOND