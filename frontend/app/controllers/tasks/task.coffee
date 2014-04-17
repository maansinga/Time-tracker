App=require 'app'

App.TaskController=Em.ObjectController.extend
	needs:['tasks']
	completeButtonMessage:(->
			if @get 'model.completed'
				'Reopen'
			else
				'Complete'
	).property('model.completed')

	actions:
		saveTask:->
				idExists=Em.isEmpty @get 'model.id'
				tasksController=@get('controllers.tasks')
				store=@store
				@get('model').save().then (model)->
					if idExists
						tasksController.reload()
		completeTask:->
				@get('model').toggleComplete()
		destroyTask:->
				tasksController=@get('controllers.tasks')
				@get('model').destroyRecord().then ->
					tasksController.reload()
