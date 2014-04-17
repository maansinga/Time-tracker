App=require 'app'

App.TasksRoute=Em.Route.extend
	setupController:(controller,model)->
		controller.set 'parentTask',null
		if Em.isEmpty controller.get 'newTask'
			controller.set 'newTask',@store.createRecord('task')