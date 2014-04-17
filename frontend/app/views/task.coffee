App=require 'app'

App.TaskView=Em.View.extend
	templateName:'tasks/task'
	isEditing:false

	actions:
		edit:->
			if @get 'isEditing'
				@get('controller').send 'saveTask'
			@set 'isEditing',!@get 'isEditing'
		cancel:->
			@set 'isEditing',!@get 'isEditing'

		complete:->
			@get('controller').send 'completeTask'