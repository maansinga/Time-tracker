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
				model=@get 'model'
				idExists=!Em.isEmpty model.get 'id'
				
				unless idExists
					model.set 'startTime',new Date()

				tasksController=@get('controllers.tasks')
				store=@store

				model.save().then (model)->
					tasksController.reload()
		completeTask:->
				@get('model').toggleComplete()
		destroyTask:->
				tasksController=@get('controllers.tasks')
				@get('model').destroyRecord().then ->
					tasksController.reload()
