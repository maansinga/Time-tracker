(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
var App;

module.exports = App = window.App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_VIEW_LOOKUPS: true
});

App.ApplicationStore = DS.Store.extend({
  adapter: 'DS.ActiveModelAdapter'
});

App.ApplicationAdapter = DS.ActiveModelAdapter;
});

;require.register("components", function(exports, require, module) {

});

;require.register("controllers", function(exports, require, module) {
require('controllers/tasks');

require('controllers/tasks/task');
});

;require.register("controllers/tasks", function(exports, require, module) {
var App;

App = require('app');

App.TasksController = Em.ArrayController.extend();
});

;require.register("controllers/tasks/task", function(exports, require, module) {
var App;

App = require('app');

App.TaskController = Em.ObjectController.extend({
  needs: ['tasks'],
  actions: {
    saveTask: function() {
      var idExists, store, tasksController;
      idExists = Em.isEmpty(this.get('model.id'));
      tasksController = this.get('controllers.tasks');
      store = this.store;
      return this.get('model').save().then(function(model) {
        if (idExists) {
          return tasksController.set('newTask', store.createRecord('task'));
        }
      });
    },
    completeTask: function() {
      return this.get('model').toggleComplete();
    },
    destroyTask: function() {
      return this.get('model').destroyRecord();
    }
  }
});
});

;require.register("initialize", function(exports, require, module) {
var App;

App = require('app');

require('models');

require('router');

require('routes');

require('controllers');

require('views');

require('templates');
});

;require.register("models", function(exports, require, module) {
require('models/task');
});

;require.register("models/task", function(exports, require, module) {
var App;

App = require('app');

App.Task = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  completed: DS.attr('boolean'),
  task: DS.belongsTo('task'),
  tasks: DS.hasMany('task'),
  isCompleted: (function() {
    return this.get('completed');
  }).property('completed'),
  isNew: (function() {
    return Em.isEmpty(this.get('id'));
  }).property('id'),
  toggleComplete: function() {
    console.log('calling toggle complete');
    this.set('completed', !this.get('completed'));
    return this.save();
  }
});
});

;require.register("router", function(exports, require, module) {
var App;

App = require('app');

App.Router.map(function() {
  return this.resource('tasks', function() {
    return this.route('task', {
      path: 'tasks/:id'
    });
  });
});
});

;require.register("routes", function(exports, require, module) {
require('routes/tasks');
});

;require.register("routes/tasks", function(exports, require, module) {
var App;

App = require('app');

App.TasksRoute = Em.Route.extend({
  model: function() {
    return this.store.find('task');
  },
  setupController: function(controller, model) {
    return controller.setProperties({
      model: model,
      newTask: this.store.createRecord('task')
    });
  }
});
});

;require.register("templates", function(exports, require, module) {
require('templates/application');

require('templates/tasks');

require('templates/tasks/task');

require('templates/tasks/_form');
});

;require.register("templates/application", function(exports, require, module) {
module.exports = Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1 class='heading'>Timeline</h1>\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  return buffer;
  
});
});

;require.register("templates/tasks", function(exports, require, module) {
module.exports = Ember.TEMPLATES['tasks'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "task", "", options) : helperMissing.call(depth0, "render", "task", "", options))));
  data.buffer.push("\n");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});
});

;require.register("templates/tasks/_form", function(exports, require, module) {
module.exports = Ember.TEMPLATES['tasks/_form'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class='form'>\n	<div class=\"full-width\">\n		<label>Name</label>");
  hashContexts = {'value': depth0,'class': depth0};
  hashTypes = {'value': "ID",'class': "STRING"};
  options = {hash:{
    'value': ("name"),
    'class': ("labeled")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	</div>\n	<div class=\"full-width\">\n		<label>Description</label>");
  hashContexts = {'value': depth0,'class': depth0};
  hashTypes = {'value': "ID",'class': "STRING"};
  options = {hash:{
    'value': ("description"),
    'class': ("labeled")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	</div>\n	<div class=\"t-controls\">\n		<button class='button tiny' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Cancel</button>\n		<button class='button tiny success' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Save</button>\n	</div>\n</div>");
  return buffer;
  
});
});

;require.register("templates/tasks/task", function(exports, require, module) {
module.exports = Ember.TEMPLATES['tasks/task'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isNew", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n			<label>New Task</label>\n			<p></p>\n			<div class='t-controls'>\n				<button class='button tiny' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">New</button>\n			</div>\n		");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n			<div class=\"full-width\"><label>Name</label><h5 class='labeled'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5></div>\n			<div class=\"full-width\"><label>Description</label><p class='labeled'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p></div>\n			<div class='t-controls'>\n				<button class='button tiny' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Edit</button>\n				<button class='button tiny' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "complete", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n					");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isCompleted", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</button>\n				<button class='button tiny alert' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroyTask", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Delete</button>\n			</div>\n		");
  return buffer;
  }
function program5(depth0,data) {
  
  
  data.buffer.push("\n						Incomplete\n					");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n						Complete\n					");
  }

function program9(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || (depth0 && depth0.partial)),stack1 ? stack1.call(depth0, "tasks/form", options) : helperMissing.call(depth0, "partial", "tasks/form", options))));
  data.buffer.push("\n	");
  return buffer;
  }

  data.buffer.push("<div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': (":task isCompleted:completed:not-completed")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || (depth0 && depth0['bind-attr'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n\n	");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.unless.call(depth0, "view.isEditing", {hash:{},inverse:self.program(9, program9, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</div>");
  return buffer;
  
});
});

;require.register("views", function(exports, require, module) {
require('views/task');
});

;require.register("views/task", function(exports, require, module) {
var App;

App = require('app');

App.TaskView = Em.View.extend({
  templateName: 'tasks/task',
  isEditing: false,
  actions: {
    edit: function() {
      if (this.get('isEditing')) {
        this.get('controller').send('saveTask');
      }
      return this.set('isEditing', !this.get('isEditing'));
    },
    cancel: function() {
      return this.set('isEditing', !this.get('isEditing'));
    },
    complete: function() {
      return this.get('controller').send('completeTask');
    }
  }
});
});

;
//# sourceMappingURL=app.js.map