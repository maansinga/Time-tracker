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
  LOG_TRANSITIONS_INTERNAL: true
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

App.TasksController = Em.ArrayController.extend({
  parentTask: null,
  newTask: null,
  tasks: (function() {
    if (Em.isEmpty(this.get('parentTask'))) {
      return this.store.find('task', {
        parent_id: null
      });
    } else {
      return this.get('parentTask.tasks');
    }
  }).property('parentTask', 'parentTask.tasks.length', 'newTask.id'),
  reload: function() {
    var parentTask;
    parentTask = this.get('parentTask');
    this.set('newTask', this.store.createRecord('task'));
    if (!Em.isEmpty(parentTask)) {
      console.log('iufhidsuhfidsufhidsufhsiduhfidsufhsidufh');
      this.set('parentTask', this.store.find('task', parentTask.get('id')));
      return this.get('newTask').set('parent_id', parentTask.get('id'));
    } else {
      return this.set('tasks', this.store.find('task', {
        parent_id: null
      }));
    }
  }
});
});

;require.register("controllers/tasks/task", function(exports, require, module) {
var App;

App = require('app');

App.TaskController = Em.ObjectController.extend({
  needs: ['tasks'],
  completeButtonMessage: (function() {
    if (this.get('model.completed')) {
      return 'Reopen';
    } else {
      return 'Complete';
    }
  }).property('model.completed'),
  actions: {
    saveTask: function() {
      var idExists, model, store, tasksController;
      model = this.get('model');
      idExists = !Em.isEmpty(model.get('id'));
      if (!idExists) {
        model.set('startTime', new Date());
      }
      tasksController = this.get('controllers.tasks');
      store = this.store;
      return model.save().then(function(model) {
        return tasksController.reload();
      });
    },
    completeTask: function() {
      return this.get('model').toggleComplete();
    },
    destroyTask: function() {
      var tasksController;
      tasksController = this.get('controllers.tasks');
      return this.get('model').destroyRecord().then(function() {
        return tasksController.reload();
      });
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
  parent: DS.belongsTo('task', {
    inverse: 'tasks'
  }),
  tasks: DS.hasMany('task', {
    async: true,
    inverse: 'parent'
  }),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  isCompleted: (function() {
    return this.get('completed');
  }).property('completed'),
  start: (function() {
    if (!Em.isEmpty(this.get('startTime'))) {
      return moment(this.get('startTime')).format('MMMM Do YYYY, h:mm:ss a');
    } else {
      return '-';
    }
  }).property('startTime'),
  end: (function() {
    if (!Em.isEmpty(this.get('endTime'))) {
      return moment(this.get('endTime')).format('MMMM Do YYYY, h:mm:ss a');
    } else {
      return '-';
    }
  }).property('endTime'),
  isNew: (function() {
    return Em.isEmpty(this.get('id'));
  }).property('id'),
  toggleComplete: function() {
    this.setProperties({
      completed: !this.get('completed'),
      endTime: new Date()
    });
    return this.save();
  }
});
});

;require.register("router", function(exports, require, module) {
var App;

App = require('app');

App.Router.map(function() {
  return this.resource('tasks', function() {
    return this.resource('task', {
      path: '/:id'
    });
  });
});
});

;require.register("routes", function(exports, require, module) {
require('routes/tasks');

require('routes/task');
});

;require.register("routes/task", function(exports, require, module) {
var App;

App = require('app');

App.TaskRoute = Em.Route.extend({
  deactivate: function() {
    this.controllerFor('tasks').set('parentTask', null);
    this.controllerFor('tasks').set('newTask.parent', null);
    return console.log('deactivating');
  },
  model: function(params) {
    return this.store.find('task', params['id']);
  },
  setupController: function(controller, model) {
    this.controllerFor('tasks').set('parentTask', model);
    return this.controllerFor('tasks').set('newTask.parent', model);
  }
});
});

;require.register("routes/tasks", function(exports, require, module) {
var App;

App = require('app');

App.TasksRoute = Em.Route.extend({
  setupController: function(controller, model) {
    controller.set('parentTask', null);
    if (Em.isEmpty(controller.get('newTask'))) {
      return controller.set('newTask', this.store.createRecord('task'));
    }
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


  data.buffer.push("<div id='background'></div>\n<h1 class='heading'>Timeline</h1>\n");
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
  var buffer = '', stack1, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n	");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("float-left")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || (depth0 && depth0['link-to'])),stack1 ? stack1.call(depth0, "tasks", options) : helperMissing.call(depth0, "link-to", "tasks", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("<br/><br/>\n	<h2>Parent task</h2>\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "task", "parentTask", options) : helperMissing.call(depth0, "render", "task", "parentTask", options))));
  data.buffer.push("\n	<h2>Sub tasks</h2>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("Tasks Home");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n	<h2>Main tasks</h2>\n");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "task.isNew", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "task", "task", options) : helperMissing.call(depth0, "render", "task", "task", options))));
  data.buffer.push("\n	");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controller.parentTask", {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "task", "in", "tasks", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n<br style='clear:left;'/>\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "task", "newTask", options) : helperMissing.call(depth0, "render", "task", "newTask", options))));
  return buffer;
  
});
});

;require.register("templates/tasks/_form", function(exports, require, module) {
module.exports = Ember.TEMPLATES['tasks/_form'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class='form'>\n	<div class=\"t-controls\">\n		");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'value': ("name"),
    'class': ("float-left"),
    'placeholder': ("Name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n		");
  hashContexts = {'value': depth0,'class': depth0,'placeholder': depth0};
  hashTypes = {'value': "ID",'class': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'value': ("description"),
    'class': ("float-left"),
    'placeholder': ("Description")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n		<button class='button float-right' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Cancel</button>\n		<button class='button float-right' ");
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
  data.buffer.push("\n			<div class='t-controls'>\n				<button class='button float-left' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">New Task</button>\n			</div>\n		");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n			\n			<div class='t-controls'>\n				<button class='float-left' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "complete", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "controller.completeButtonMessage", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</button>\n				");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("t-link-task float-left")
  },inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || (depth0 && depth0['link-to'])),stack1 ? stack1.call(depth0, "task", "", options) : helperMissing.call(depth0, "link-to", "task", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n				<span class='float-left'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "description", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n				<span class='float-left'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "parent.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n				\n				<button class='float-right' ");
  hashContexts = {'target': depth0};
  hashTypes = {'target': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{
    'target': ("view")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Edit</button>\n				<button class='float-right' ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroyTask", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Delete</button>\n				<span class='float-right'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "tasks.length", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n				<span class='float-right arrow-right'>--</span>\n				<span class='float-right'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "end", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n				<span class='float-right arrow-right'>></span>\n				<span class='float-right'>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "start", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n			</div>\n		");
  return buffer;
  }
function program5(depth0,data) {
  
  var hashTypes, hashContexts;
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  }

function program7(depth0,data) {
  
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
  stack2 = helpers.unless.call(depth0, "view.isEditing", {hash:{},inverse:self.program(7, program7, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
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