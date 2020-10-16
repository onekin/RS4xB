/* PVSCL:IFCOND(GoogleSheetProvider) */ else if (request.cmd === 'getSpreadsheet') {
          chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError })
            } else {
              const data = JSON.parse(request.data)
              if (data.spreadsheetId) {
                // Create client
                this.googleSheetClient = new GoogleSheetClient(token)
                this.googleSheetClient.getSpreadsheet(data.spreadsheetId, (err, spreadsheet) => {
                  if (err) {
                    sendResponse({ error: err })
                  } else {
                    sendResponse({ spreadsheet: JSON.stringify(spreadsheet) })
                  }
                })
              } else {
                sendResponse({ error: new Error('Spreadsheet id not found') })
              }
            }
          })
          return true
        } else if (request.cmd === 'batchUpdate') {
          chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
              sendResponse({ error: chrome.runtime.lastError })
            } else {
              const data = JSON.parse(request.data)
              if (data.data) {
                this.googleSheetClient = new GoogleSheetClient(token)
                this.googleSheetClient.batchUpdate(data.data, (err) => {
                  if (err) {
                    sendResponse({ error: err })
                  } else {
                    sendResponse({ result: 'done' })
                  }
                })
              }
            }
          })
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
GoogleSheetsManager.js/* PVSCL:IFCOND(GoogleSheetProvider) */,
    spreadsheetId = null,
    sheetId = null/* PVSCL:ENDCOND */// PVSCL:IFCOND(GoogleSheetProvider,LINE)
    this.spreadsheetId = spreadsheetId
    this.sheetId = sheetId
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider,LINE)
    textObject = {
      spreadsheetId: this.spreadsheetId,
      sheetId: this.sheetId
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider or MoodleProvider, LINE)
      // Configuration for gsheet provider or moodle provider is saved in text attribute
      // TODO Maybe this is not the best place to store this configuration, it wa done in this way to be visible in Hypothes.is client, but probably it should be defined in the body of the annotation
      const config = jsYaml.load(annotation.text)
      // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider, LINE)
      annotationGuideOpts.spreadsheetId = config.spreadsheetId
      annotationGuideOpts.sheetId = config.sheetId
      // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
          theme.multivalued = numberOfColumns > 1
          // PVSCL:ENDCOND// PVSCL:IFCOND(Hierarchy,LINE)
          // Find codes
          if (sheet.data[0].rowData[1] && sheet.data[0].rowData[1].values) {
            // Get cells for codes
            const values = _.slice(sheet.data[0].rowData[1].values, 1, lastIndex)
            // For each cell
            for (let i = 0; i < themesArray.length; i++) {
              // Retrieve its facet
              const currentThemeName = themesArray[i]
              // If theme of current row is text and is a facet and is not already set the possible codes
              const currentTheme = _.find(themes, (facet) => { return facet.name === currentThemeName })
              if (_.isString(currentThemeName) && currentTheme && currentTheme.codes.length === 0) {
                // If cell has data validation "ONE_OF_LIST"
                if (_.isObject(values[i]) && _.isObject(values[i].dataValidation) && values[i].dataValidation.condition.type === 'ONE_OF_LIST') {
                  currentTheme.inductive = false
                  currentTheme.codes = _.map(values[i].dataValidation.condition.values, (value) => { return new Code({ name: value.userEnteredValue, theme: currentTheme }) })
                } else { // If cell has not data validation
                  currentTheme.inductive = true
                }
              }
            }
          }
          // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider,LINE)

  static fromGoogleSheet ({ spreadsheetId, sheetId, spreadsheet, sheetName }) {
    const codebook = new Codebook({ spreadsheetId, sheetId, name: sheetName })
    codebook.themes = Codebook.getThemesAndCodesGSheet(spreadsheet, codebook)
    return codebook
  }

  static getThemesAndCodesGSheet (spreadsheet, annotationGuide) {
    // Find current sheet
    const sheet = _.find(spreadsheet.sheets, (sheet) => { return sheet.properties.sheetId === annotationGuide.sheetId })
    // Check if exists object
    if (sheet && sheet.data && sheet.data[0] && sheet.data[0].rowData && sheet.data[0].rowData[0] && sheet.data[0].rowData[0].values) {
      // Retrieve index of "Author" column
      let lastIndex = _.findIndex(sheet.data[0].rowData[0].values, (cell) => {
        if (cell && cell.formattedValue) {
          return cell.formattedValue === ''
        } else {
          return false
        }
      })
      if (lastIndex === -1) {
        lastIndex = sheet.data[0].rowData[0].values.length
      }
      // If index of author exists
      if (lastIndex > 0) {
        // Retrieve themes. Retrieve elements between 2 column and author column, maps "formattedValue"
        const themesArray = _.map(_.slice(sheet.data[0].rowData[0].values, 1, lastIndex), 'formattedValue')
        const themes = _.map(_.countBy(themesArray), (numberOfColumns, name) => {
          const theme = new Theme({ name: name, annotationGuide })
          // PVSCL:IFCOND(Hierarchy,LINE)
          // Find codes
          if (sheet.data[0].rowData[1] && sheet.data[0].rowData[1].values) {
            // Get cells for codes
            const values = _.slice(sheet.data[0].rowData[1].values, 1, lastIndex)
            // For each cell
            for (let i = 0; i < themesArray.length; i++) {
              // Retrieve its facet
              const currentThemeName = themesArray[i]
              // If theme of current row is text and is a facet and is not already set the possible codes
              const currentTheme = _.find(themes, (facet) => { return facet.name === currentThemeName })
              if (_.isString(currentThemeName) && currentTheme && currentTheme.codes.length === 0) {
                // If cell has data validation "ONE_OF_LIST"
                if (_.isObject(values[i]) && _.isObject(values[i].dataValidation) && values[i].dataValidation.condition.type === 'ONE_OF_LIST') {
                  currentTheme.inductive = false
                  currentTheme.codes = _.map(values[i].dataValidation.condition.values, (value) => { return new Code({ name: value.userEnteredValue, theme: currentTheme }) })
                } else { // If cell has not data validation
                  currentTheme.inductive = true
                }
              }
            }
          }
          // PVSCL:ENDCOND          return themes
        } else {
          return new Error('The spreadsheet hasn\'t the correct structure, you have not defined any facet.')
        }
      } else {
        return new Error('The spreadsheet\'s first row is empty.')
      }
    } else {
      return new Error('The spreadsheet hasn\'t the correct structure. The ROW #1 must contain the themes for your codebook.')
    }
  }
  // PVSCL:ENDCOND/* PVSCL:IFCOND(GoogleSheetProvider and Hierarchy) */,
    multivalued,
    inductive/* PVSCL:ENDCOND */// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    this.multivalued = multivalued
    this.inductive = inductive
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    if (this.multivalued) {
      tags.push(Config.namespace + ':' + Config.tags.statics.multivalued)
    }
    if (this.inductive) {
      tags.push(Config.namespace + ':' + Config.tags.statics.inductive)
    }
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
    const multivaluedTag = _.find(annotation.tags, (tag) => {
      return tag.includes(Config.namespace + ':multivalued')
    })
    const inductiveTag = _.find(annotation.tags, (tag) => {
      return tag.includes(Config.namespace + ':inductive')
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider and Hierarchy,LINE)
      // multivalued and inductive
      const multivalued = _.isString(multivaluedTag)
      const inductive = _.isString(inductiveTag)
      // PVSCL:ENDCOND/* PVSCL:IFCOND(GoogleSheetProvider and Hierarchy) */,
          multivalued,
          inductive/* PVSCL:ENDCOND */import _ from 'lodash'
import Codebook from '../../../model/Codebook'
import Alerts from '../../../../utils/Alerts'
import URLUtils from '../../../../utils/URLUtils'
import Config from '../../../../Config'

class GSheetParser {
  static parseCurrentSheet (callback) {
    const spreadsheetId = GSheetParser.retrieveSpreadsheetId()
    const sheetId = GSheetParser.retrieveSheetId()
    GSheetParser.retrieveCurrentToken((err, token) => {
      if (err) {
        callback(err)
      } else {
        GSheetParser.getSpreadsheet(spreadsheetId, token, (err, spreadsheet) => {
          if (err) {
            callback(err)
          } else {
            let sheetName
            // Retrieve spreadsheet title
            // PVSCL:IFCOND(Manual,LINE)

            // PVSCL:IFCOND(ApplicationBased,LINE)

            const codebook = Codebook.fromGoogleSheet({ spreadsheetId, sheetId, spreadsheet, sheetName })
            if (_.isError(codebook)) {
              callback(err)
            } else {
              if (_.isFunction(callback)) {
                callback(null, codebook)
              }
            }
          }
        })
      }
    })
  }

  static retrieveCurrentToken (callback) {
    chrome.runtime.sendMessage({ scope: 'googleSheets', cmd: 'getToken' }, (result) => {
      if (_.isFunction(callback)) {
        if (result.token) {
          callback(null, result.token)
        } else {
          callback(result.error)
        }
      }
    })
  }

  static getSpreadsheet (spreadsheetId, token, callback) {
    chrome.runtime.sendMessage({
      scope: 'googleSheets',
      cmd: 'getSpreadsheet',
      data: JSON.stringify({
        spreadsheetId: spreadsheetId
      })
    }, (response) => {
      if (response.error) {
        Alerts.errorAlert({
          text: 'You don\'t have permission to access the spreadsheet! Are you using the same Google account for the spreadsheet and for Google Chrome?<br/>If you don\'t know how to solve this problem: Please create on top right: "Share -> Get shareable link", and give edit permission.' // TODO i18n
        })
        callback(new Error('Unable to retrieve spreadsheet data. Permission denied.'))
      } else {
        try {
          const spreadsheet = JSON.parse(response.spreadsheet)
          callback(null, spreadsheet)
        } catch (e) {
          callback(e)
        }
      }
    })
  }

  static retrieveSpreadsheetId () {
    // Get current google sheet id
    this.spreadsheetId = window.location.href.match(/[-\w]{25,}/)[0]
    return window.location.href.match(/[-\w]{25,}/)[0]
  }

  static retrieveSheetId () {
    const hashParams = URLUtils.extractHashParamsFromUrl(window.location.href, '=')
    return parseInt(hashParams.gid)
  }
}

export default GSheetParser
GSheetParser.jsimport _ from 'lodash'
import GoogleSheetsClientManager from '../../../../googleSheets/GoogleSheetsClientManager'
import GSheetParser from './GSheetParser'
import GroupInitializer from './GroupInitializer'
import Alerts from '../../../../utils/Alerts'
import swal from 'sweetalert2'
// PVSCL:IFCOND(Hypothesis, LINE)

// PVSCL:IFCOND(BrowserStorage, LINE)


class GoogleSheetContentScriptManager {
  init (callback) {
    window.googleSheetProvider.googleSheetClientManager = new GoogleSheetsClientManager()
    this.loadAnnotationServer(() => {
      this.initLoginProcess((err, tokens) => {
        if (err) {
          swal('Oops!',
            'Unable to configure current spreadsheet. Failed login to services.', // TODO i18n
            'error') // Notify error to user
          if (_.isFunction(callback)) {
            callback()
          }
        } else {
          // Show tool is configuring prompt
          this.showToolIsConfiguring()
          // console.debug('Correctly logged in to hypothesis: %s', tokens.hypothesis)
          console.debug('Correctly logged in to gSheet: %s', tokens.gSheet)
          this.initGoogleSheetParsing(() => {
            // Execute callback without errors
            if (_.isFunction(callback)) {
              callback()
            }
          })
        }
      })
    })
  }

  showToolIsConfiguring () {
    swal({
      position: 'top-end',
      title: 'Configuring the tool, please be patient', // TODO i18n
      text: 'If the tool takes too much time, please reload the page and try again.',
      showConfirmButton: false,
      onOpen: () => {
        swal.showLoading()
      }
    })
  }

  initLoginProcess (callback) {
    window.googleSheetProvider.annotationServerManager.logIn((err) => {
      if (err) {
        callback(err)
      } else {
        window.googleSheetProvider.googleSheetClientManager.logInGoogleSheets((err, gSheetToken) => {
          if (err) {
            callback(err)
          } else {
            callback(null, {
              gSheet: gSheetToken
            })
          }
        })
      }
    })
  }

  loadAnnotationServer (callback) {
    // PVSCL:IFCOND(AnnotationServer->pv:SelectedChildren('ps:annotationServer')->pv:Size()=1, LINE)

  }

  initGoogleSheetParsing (callback) {
    GSheetParser.parseCurrentSheet((err, codebook) => {
      if (err) {
        console.error(err)
        Alerts.errorAlert({ text: err.message })
      } else {
        window.googleSheetProvider.GroupInitializer = new GroupInitializer()
        window.googleSheetProvider.GroupInitializer.init(codebook, (err) => {
          if (err) {
            if (_.isFunction(callback)) {
              callback(err)
            }
          } else {
            if (_.isFunction(callback)) {
              callback()
            }
          }
        })
      }
    })
  }
}

export default GoogleSheetContentScriptManager
GSheetProvider.jsimport _ from 'lodash'
import swal from 'sweetalert2'
import Alerts from '../../../../utils/Alerts'
import ChromeStorage from '../../../../utils/ChromeStorage'
import Codebook from '../../../model/Codebook'
// PVSCL:IFCOND(ApplicationBased, LINE)

const selectedGroupNamespace = 'hypothesis.currentGroup'

class GroupInitializer {
  init (annotationGuide, callback) {
    this.annotationGuide = annotationGuide
    this.initializeGroup((err) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }

  initializeGroup (callback) {
    // Get if current hypothesis group exists
    window.googleSheetProvider.annotationServerManager.client.getListOfGroups({}, (err, groups) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        const group = _.find(groups, (group) => {
          let isGroupNameEqual
          // PVSCL:IFCOND(ApplicationBased, LINE)

          // PVSCL:IFCOND(Manual, LINE)

          return isGroupNameEqual
        })
        // Create the group if not exists
        if (_.isEmpty(group)) {
          this.createGroup((err) => {
            if (err) {
              swal('Oops!', // TODO i18n
                'There was a problem while creating the group. Please reload the page and try it again. <br/>' +
                'If the error continues, please contact administrator.',
                'error') // Show to the user the error
              if (_.isFunction(callback)) {
                callback(err)
              }
            } else {
              this.createFacetsAndCodes((err) => {
                if (err) {
                  swal('Oops!', // TODO i18n
                    'There was a problem while creating buttons for the sidebar. Please reload the page and try it again. <br/>' +
                    'If the error continues, please contact the administrator.',
                    'error') // Show to the user the error
                  // Remove created hypothesis group
                  this.removeGroup()
                  if (_.isFunction(callback)) {
                    callback(err)
                  }
                } else {
                  // Save as current group the generated one
                  ChromeStorage.setData(selectedGroupNamespace, { data: JSON.stringify(this.annotationGuide.annotationServer.group) }, ChromeStorage.local)
                  // Get group url
                  const selectedAnnotationServerManager = window.googleSheetProvider.annotationServerManager
                  const groupUrl = selectedAnnotationServerManager.constructSearchUrl({ group: this.annotationGuide.annotationServer.getGroupId() })
                  Alerts.successAlert({
                    title: 'Correctly configured', // TODO i18n
                    text: chrome.i18n.getMessage('VisitTheCreatedGroup') + ' <a href="' + groupUrl + '" target="_blank">here</a>.'
                  })
                  if (_.isFunction(callback)) {
                    callback()
                  }
                }
              })
            }
          })
        } else {
          const selectedAnnotationServerManager = window.googleSheetProvider.annotationServerManager
          const groupUrl = selectedAnnotationServerManager.constructSearchUrl({ group: group.id })
          swal('The group ' + group.name + ' already exists', // TODO i18n
            chrome.i18n.getMessage('VisitTheCreatedGroup') + ' <a href="' + groupUrl + '" target="_blank">here</a>.',
            'info')
          if (_.isFunction(callback)) {
            callback()
          }
          // TODO Update Hypothesis group
        }
      }
    })
  }

  createGroup (callback) {
    window.googleSheetProvider.annotationServerManager.client.createNewGroup({ name: this.annotationGuide.name }, (err, group) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        console.debug('Created group in hypothesis: ')
        console.debug(group)
        Codebook.setAnnotationServer(group, (annotationServer) => {
          this.annotationGuide.annotationServer = annotationServer
          if (_.isFunction(callback)) {
            callback()
          }
        })
      }
    })
  }

  createFacetsAndCodes (callback) {
    const annotations = this.annotationGuide.toAnnotations()
    console.debug('Generated dimensions and categories annotations: ')
    console.debug(annotations)
    window.googleSheetProvider.annotationServerManager.client.createNewAnnotations(annotations, (err) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }

  removeGroup (callback) {
    if (this.annotationGuide.annotationServer) {
      window.googleSheetProvider.annotationServerManager.client.removeAMemberFromAGroup(this.annotationGuide.annotationServer.getGroupId(), 'me', (err) => {
        if (_.isFunction(callback)) {
          callback(err)
        } else {
          callback()
        }
      })
    }
  }
}

export default GroupInitializer
GroupInitializer.jsimport axios from 'axios'
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
GoogleSheetsClientManager.js// PVSCL:IFCOND(GoogleSheetProvider, LINE)
tags.statics = {
  multivalued: 'multivalued',
  inductive: 'inductive',
  validated: 'validated',
  spreadsheet: 'spreadsheet'
}
// PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider or GoogleSheetConsumer, LINE)
import GoogleSheetsManager from './background/GoogleSheetsManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider or GoogleSheetConsumer, LINE)
    // Initialize google sheets manager
    this.googleSheetsManager = new GoogleSheetsManager()
    this.googleSheetsManager.init()

    // PVSCL:ENDCONDimport GSheetProvider from './codebook/operations/create/googleSheetsProvider/GSheetProvider'
import _ from 'lodash'

window.addEventListener('load', () => {
  console.debug('Loaded sheet content script')
  // When page is loaded, popup button should be always deactivated
  chrome.runtime.sendMessage({ scope: 'extension', cmd: 'deactivatePopup' }, (result) => {
    console.log('Deactivated popup')
  })
  // When popup button is clicked
  chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
    if (_.isEmpty(window.googleSheetProvider)) {
      if (msg.action === 'initContentScript') {
        window.googleSheetProvider = {}
        window.googleSheetProvider.contentScriptManager = new GSheetProvider()
        window.googleSheetProvider.contentScriptManager.init(() => {
          // Disable the button of popup
          chrome.runtime.sendMessage({ scope: 'extension', cmd: 'deactivatePopup' }, (result) => {
            console.log('Deactivated popup')
          })
          window.googleSheetProvider = null
        })
      }
    }
  })
})
googleSheetsContentScript.jsPVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCOND      // PVSCL:IFCOND(Manual and Hypothesis and NOT (MoodleProvider),LINE)
      "exclude_matches": ["https://hypothes.is/login"],
      // PVSCL:ENDCOND// PVSCL:IFCOND(GoogleSheetProvider,LINE)
      "exclude_matches": ["https://docs.google.com/spreadsheets/d/*", "https://docs.google.com/spreadsheets/u/0/d/*"PVSCL:IFCOND(Manual and Hypothesis),  "https://hypothes.is/login"PVSCL:ENDCOND],      // PVSCL:ELSECOND
      // PVSCL:IFCOND(Manual and Hypothesis and NOT (MoodleProvider),LINE)
      "exclude_matches": ["https://hypothes.is/login"],
      // PVSCL:ENDCOND      //PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider),
    {
      "matches": ["https://docs.google.com/spreadsheets/d/*", "https://docs.google.com/spreadsheets/u/0/d/*"],
      "js": ["scripts/googleSheetsContentScript.js"],
      "run_at": "document_end"
    }PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider OR GoogleSheetConsumer)
    "identity",PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider, LINE)
    "client_id": "PVSCL:EVAL(GoogleSheetProvider->pv:Attribute('clientId'))",
    PVSCL:ELSEIFCOND(GoogleSheetConsumer)
    "client_id": "PVSCL:EVAL(GoogleSheetConsumer->pv:Attribute('clientId'))",
    PVSCL:ENDCONDPVSCL:IFCOND(GoogleSheetProvider, LINE)
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