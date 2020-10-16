// PVSCL:IFCOND(SuggestedLiterature, LINE)
import SuggestingLiterature from './SuggestingLiterature'
require('components-jqueryui')
// PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature, LINE)
      preConfirmData.literature = Array.from($('#literatureList li span')).map((e) => { return $(e).attr('title') })
      // PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature,LINE)
    const suggestedLiteratureHtml = (annotation) => {
      const litBody = annotation.getBodyForPurpose(SuggestingLiterature.purpose)
      if (litBody && _.isArray(litBody.value)) {
        const lit = litBody.value
        let html = ''
        lit.forEach((paper) => {
          html += '<li><a class="removeReference"></a><span title="' + paper + '">' + paper + '</span></li>'
        })
        return html
      } else {
        return ''
      }
    }
    html += '<input placeholder="Suggest literature from DBLP" id="swal-input1" class="swal2-input"><ul id="literatureList">' + suggestedLiteratureHtml(annotation) + '</ul>'
    // PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature, LINE)
      // Add the option to delete a suggestedLiterature from the comment
      $('.removeReference').on('click', function () {
        $(this).closest('li').remove()
      })
      // Autocomplete the suggestedLiteratures
      $('#swal-input1').autocomplete({
        source: function (request, response) {
          $.ajax({
            url: 'http://dblp.org/search/publ/api',
            data: {
              q: request.term,
              format: 'json',
              h: 5
            },
            success: function (data) {
              response(data.result.hits.hit.map((e) => { return { label: e.info.title + ' (' + e.info.year + ')', value: e.info.title + ' (' + e.info.year + ')', info: e.info } }))
            }
          })
        },
        minLength: 3,
        delay: 500,
        select: function (event, ui) {
          let content = ''
          if (ui.item.info.authors !== null && Array.isArray(ui.item.info.authors.author)) {
            if (_.isObject(ui.item.info.authors.author[0])) {
              content += ui.item.info.authors.author.map(a => a.text).join(', ') + ': '
            } else {
              content += ui.item.info.authors.author.join(', ') + ': '
            }
          } else if (ui.item.info.authors !== null) {
            content += ui.item.info.authors.author + ': '
          }
          if (ui.item.info.title !== null) {
            content += ui.item.info.title
          }
          if (ui.item.info.year !== null) {
            content += ' (' + ui.item.info.year + ')'
          }
          const a = document.createElement('a')
          a.className = 'removeReference'
          a.addEventListener('click', function (e) {
            $(e.target).closest('li').remove()
          })
          const li = document.createElement('li')
          $(li).append(a, '<span title="' + content + '">' + content + '</span>')
          $('#literatureList').append(li)
          setTimeout(function () {
            $('#swal-input1').val('')
          }, 10)
        },
        appendTo: '.swal2-container',
        create: function () {
          $('.ui-autocomplete').css('max-width', $('.swal2-textarea').width())
        }
      })
      // PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature,LINE)
          const litBody = annotation.getBodyForPurpose(SuggestingLiterature.purpose)
          if (litBody) {
            litBody.value = preConfirmData.literature || []
          } else {
            annotation.body.push(new SuggestingLiterature({ value: preConfirmData.literature }))
          }
          // PVSCL:ENDCONDimport Body from './Body'

class SuggestingLiterature extends Body {
  constructor ({ purpose = SuggestingLiterature.purpose, value = [] }) {
    super(purpose)
    this.value = value
  }

  populate (value) {
    super.populate(value)
  }

  serialize () {
    return super.serialize()
  }

  tooltip () {
    return 'Suggested literature: \n ' + this.value.join('\n ')
  }
}

SuggestingLiterature.purpose = 'suggestingLiterature'

export default SuggestingLiterature
SuggestingLiterature.js// PVSCL:IFCOND(SuggestedLiterature, LINE)
import SuggestingLiterature from './purposes/SuggestingLiterature'
// PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature,LINE)
      suggestedLiterature: [],
      // PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature, LINE)
        if (body.purpose === SuggestingLiterature.purpose) {
          return new SuggestingLiterature({ value: body.value })
        }
        // PVSCL:ENDCOND// PVSCL:IFCOND(SuggestedLiterature, LINE)
        const SuggestingLiterature = require('../annotationManagement/purposes/SuggestingLiterature')
        let suggestedLiteratureBody = annotations[a].getBodyForPurpose(SuggestingLiterature.purpose)
        let suggestedLiterature = suggestedLiteratureBody ? suggestedLiteratureBody.value : []
        // PVSCL:ENDCOND/* PVSCL:IFCOND(SuggestedLiterature) */,
          suggestedLiterature/* PVSCL:ENDCOND */