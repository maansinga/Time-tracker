module.exports=App=window.App = Ember.Application.create
	LOG_TRANSITIONS:true
	LOG_VIEW_LOOKUPS: true
App.ApplicationStore=DS.Store.extend
	adapter: 'DS.ActiveModelAdapter'

App.ApplicationAdapter = DS.ActiveModelAdapter;
