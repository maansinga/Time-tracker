App=require 'app'

App.TasksRoute=Em.Route.extend
	model:->
		@store.find 'task'
	setupController:(controller,model)->
		controller.setProperties
			model:model
			newTask:@store.createRecord('task')