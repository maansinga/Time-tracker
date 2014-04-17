module.exports=App=window.App = Ember.Application.create()

App.ApplicationStore=DS.Store.extend
	adapter: 'DS.ActiveModelAdapter'

App.ApplicationAdapter = DS.ActiveModelAdapter;
