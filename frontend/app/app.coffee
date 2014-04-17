module.exports=App=window.App = Ember.Application.create
	LOG_TRANSITIONS:true
	LOG_TRANSITIONS_INTERNAL:true
App.ApplicationStore=DS.Store.extend
	adapter: 'DS.ActiveModelAdapter'

App.ApplicationAdapter = DS.ActiveModelAdapter;
