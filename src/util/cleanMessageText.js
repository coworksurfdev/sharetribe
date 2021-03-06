import _ from 'lodash'

export const cleanMessageText = (message) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const urlRegex = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'igm')
  const secondURLRegex = new RegExp('^(https?|chrome):\\/\\/[^\\s$.?#].[^\\s]*$', 'igm')
  const thirdURLRegex = new RegExp('((http|ftp|https):\\/\\/)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'igm')

  const phoneNumberRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  const hiddenMessage = '[HIDDEN]'
  return _.chain(message || '')
  .replace(emailRegex, hiddenMessage)
  .replace(urlRegex, hiddenMessage)
  .replace(secondURLRegex, hiddenMessage)
  .replace(thirdURLRegex, hiddenMessage)
  .replace(phoneNumberRegex, hiddenMessage)
  .value()
}
