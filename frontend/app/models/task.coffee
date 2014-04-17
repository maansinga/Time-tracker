App=require 'app'

App.Task=DS.Model.extend
	name: DS.attr 'string'
	description: DS.attr 'string'
	completed:DS.attr 'boolean'
	parent: DS.belongsTo 'task',
		inverse: 'tasks'
	tasks: DS.hasMany 'task',
		async:true
		inverse:'parent'

	#I need this for CSS
	isCompleted:(->
		@get 'completed'
	).property('completed')

	isNew:(-> Em.isEmpty @get 'id').property('id')

	toggleComplete:->
		@set 'completed',!@get 'completed'
		@save()