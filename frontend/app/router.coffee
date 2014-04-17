App=require 'app'

App.Router.map ->
	@resource 'tasks',->
		@route 'task',{path: 'tasks/:id'}