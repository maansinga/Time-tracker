App=require 'app'

App.TasksController=Em.ArrayController.extend
	parentTask:null
	newTask:null

	tasks:(->
		if(Em.isEmpty(@get('parentTask')))
			@store.find 'task',{parent_id:null}
		else
			@get 'parentTask.tasks'
	).property('parentTask','parentTask.tasks.length','newTask.id')

	reload:->
		parentTask=@get('parentTask')
		@set 'newTask',@store.createRecord 'task'
		unless Em.isEmpty parentTask
			console.log 'iufhidsuhfidsufhidsufhsiduhfidsufhsidufh'
			@set 'parentTask',@store.find 'task',parentTask.get 'id'
			@get('newTask').set 'parent_id',parentTask.get 'id'
		else
			@set 'tasks',@store.find 'task',{parent_id:null}
