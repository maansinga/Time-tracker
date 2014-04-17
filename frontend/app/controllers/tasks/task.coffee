App=require 'app'

App.TaskController=Em.ObjectController.extend
	needs:['tasks']
	actions:
		saveTask:->
				idExists=Em.isEmpty @get 'model.id'
				tasksController=@get('controllers.tasks')
				store=@store
				@get('model').save().then (model)->
					if idExists
						tasksController.set 'newTask',store.createRecord 'task'
		completeTask:->
				@get('model').toggleComplete()
		destroyTask:->
				@get('model').destroyRecord()
