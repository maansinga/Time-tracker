App=require 'app'

App.Task=DS.Model.extend
	name: DS.attr 'string'
	description: DS.attr 'string'