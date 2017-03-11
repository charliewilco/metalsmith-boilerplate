const Handlebars = require('handlebars')
const MomentHandler = require('handlebars.moment')

module.exports = MomentHandler.registerHelpers(Handlebars)
