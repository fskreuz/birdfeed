const moment = require('moment')
const XmlEntities = require('html-entities').XmlEntities

const { encode } = new XmlEntities()
const whitespace = /[\r\n]/g
const multispace = /\s+/g
const relativePattern = /(\d?\d)([hm])/
const monthPattern = 'MMM D'
const yearPattern = 'D MMM YY'

exports.text = text => encode(text.trim().replace(whitespace, ' ').replace(multispace, ' '))

exports.url = url => (new URL(url)).toString()

exports.date = date => {
  const cleanDate = date.trim()

  const yearForm = moment.utc(cleanDate, yearPattern)
  if (yearForm.isValid()) return yearForm.toISOString()

  const monthForm = moment.utc(cleanDate, monthPattern)
  if (monthForm.isValid()) return monthForm.toISOString()

  const match = cleanDate.match(relativePattern)
  if (match) return moment().utc().subtract(match[1], match[2]).toISOString()

  return ''
}
