App=require 'app'

App.TaskRoute=Em.Route.extend
	deactivate:->
		@controllerFor('tasks').set 'parentTask',null
		@controllerFor('tasks').set 'newTask.parent',null
		console.log 'deactivating'
	model:(params)->
		@store.find 'task',params['id']
	setupController:(controller,model)->
		@controllerFor('tasks').set 'parentTask',model
		@controllerFor('tasks').set 'newTask.parent',model
