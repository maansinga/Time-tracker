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
	startTime:DS.attr 'date'
	endTime:DS.attr 'date'

	#I need this for CSS
	isCompleted:(->
		@get 'completed'
	).property('completed')

	start:(->
		unless Em.isEmpty @get 'startTime'
			moment(@get 'startTime').format 'MMMM Do YYYY, h:mm:ss a'
		else
			'-'
	).property('startTime')

	end:(->
		unless Em.isEmpty @get 'endTime'
			moment(@get 'endTime').format 'MMMM Do YYYY, h:mm:ss a'
		else
			'-'
	).property('endTime')

	isNew:(-> Em.isEmpty @get 'id').property('id')

	toggleComplete:->
		@setProperties
			 completed:!@get 'completed'
			 endTime:new Date()
		@save()