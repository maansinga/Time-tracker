App=require 'app'

App.Task=DS.Model.extend
	name: DS.attr 'string'
	description: DS.attr 'string'
	completed:DS.attr 'boolean'
	task: DS.belongsTo 'task'
	tasks: DS.hasMany 'task'
	#I need this for CSS
	isCompleted:(->
		@get 'completed'
	).property('completed')

	isNew:(-> Em.isEmpty @get 'id').property('id')

	toggleComplete:->
		console.log 'calling toggle complete'
		@set 'completed',!@get 'completed'
		@save()