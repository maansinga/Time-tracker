fs   = require 'fs'
path = require 'path'

exports.config =
  paths:
    'public': "../backend/public"
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': (path) -> isDevelopmentVendorFile path
      order:
        before: [
          'vendor/javascripts/jquery-1.10.2.js'
          'vendor/javascripts/handlebars-1.1.2.js'
          'vendor/javascripts/ember-1.5.0.js'
          'vendor/javascripts/ember-data.js'
          ]
    stylesheets:
      defaultExtension: 'scss'
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
    templates:
      precompile: true
      root: 'templates'
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js' : /^app/
  conventions:
    ignored: (filePath) ->
      if filePath.indexOf(path.join 'app', 'templates') == 0
        return false
      else
        return startsWith path.basename(filePath), '_'

startsWith = (string, substring) -> string.lastIndexOf(substring, 0) == 0

developmentVendorJavascripts = [
  'jquery-1.10.2.js'
  'handlebars-1.1.2.js'
  'ember-1.5.0.js'
  'ember-data.js'
]

productionVendorJavascripts = [
 'jquery-1.10.2.js'
  'handlebars-1.1.2.js'
  'ember-1.5.0.js'
  'ember-data.js'
]

isDevelopmentVendorFile = (filePath) ->
  return false unless startsWith(filePath, 'vendor/')
  return developmentVendorJavascripts.indexOf(path.basename(filePath)) > -1

exports.isProductionVendorFile = (filePath) ->
  return false unless startsWith(filePath, 'vendor/')
  return productionVendorJavascripts.indexOf(path.basename(filePath)) > -1
