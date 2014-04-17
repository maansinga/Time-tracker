App=require 'app'

App.Router.map ->
	@resource 'tasks',->
		@resource 'task',{path: '/:id'}