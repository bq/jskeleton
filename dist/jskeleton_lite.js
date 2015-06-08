(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone',
            'backbone.marionette'
        ], function($, _, Backbone, Marionette) {
            return factory.call(root, root, $, _, Backbone, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

        Backbone.$ = $;

        var Marionette = require('backbone.marionette'),
            JSkeleton = factory(root, $, _, Backbone, Marionette);

        module.exports = JSkeleton;
    } else if (root !== undefined) {
        root.JSkeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';

    /* jshint unused: false */

    var JSkeleton = root.JSkeleton || {};

    'use strict';
    
    /*globals JSkeleton, Backbone, _ */
    /* jshint unused: false */
    
    JSkeleton.Model = Backbone.Model.extend({
    
    
    });
    'use strict';
    
    /*globals JSkeleton, Backbone, _ */
    /* jshint unused: false */
    
    JSkeleton.Collection = Backbone.Collection.extend({
    
        _prepareModel: function(attrs, options) {
    
            if (this._isModel(attrs)) {
                if (!attrs.collection) attrs.collection = this;
                JSkeleton.modelStore.add(attrs);
                return attrs;
            }
            options = options ? _.clone(options) : {};
            options.collection = this;
    
            var model = new this.model(attrs, options);
            if (!model.validationError) {
                // Add new model to modelStore or update it
                JSkeleton.modelStore.add(model);
                return model;
            }
            this.trigger('invalid', this, model.validationError, options);
            return false;
        },
    
        _isModel: function(model) {
            return model instanceof Backbone.Model;
        }
    });
    'use strict';
    /*globals JSkeleton, Backbone, Marionette _ */
    /* jshint unused: false */
    
    //## JSkeleton.ModelStore
    JSkeleton.ModelStore = Marionette.Object.extend({
    
        initialize: function() {
            this.storage = new Backbone.Collection();
        },
    
        // Add or Update model
        add: function(model) {
            if (!(model instanceof Backbone.Model)) {
                throw new Error("model added must be exist and must be an instance of Backbone.Model");
            }
    
            // If Class organization exist
            if (this.classExist(model)) {
                _.each(this.storage.models, function(itemModel) {
                    if (itemModel.get('Class') === model.constructor) {
                        // if model instance exist, set attributes
                        if (itemModel.get('instances').get(model.id)) {
                            itemModel.get('instances').get(model.id).set(model.attributes);
                        } else {
                            // else, add to collection instance
                            itemModel.get('instances').add(model);
                        }
                    }
                });
            } else {
                // If Class not exist, create new group and insert the first instance model
                var modelsGroup = new Backbone.Model({
                    instances: new Backbone.Collection(model)
                }).set({
                    'Class': model.constructor
                });
                this.storage.add(modelsGroup);
            }
            return this;
        },
    
        // get model by Id and model Class
        get: function(modelId, classConstructor) {
            if (!classConstructor || typeof classConstructor !== 'function') {
                throw new Error("classConstructor must be exist");
            }
            if (!modelId) {
                throw new Error("modelId must be exist");
            }
    
            var instance = undefined;
            _.each(this.storage.models, function(itemModel) {
                if (itemModel.get('Class') === classConstructor) {
                    instance = itemModel.get('instances').get(modelId);
                    return;
                }
            });
            return instance;
        },
    
        // remove model from store
        remove: function(model) {
            if (!(model instanceof Backbone.Model)) {
                throw new Error("model added must be exist and must be an instance of Backbone.Model");
            }
            _.each(this.storage.models, function(itemModel) {
                // Todo if instance model exist, update it!
                if (itemModel.get('Class') === model.constructor) {
    
                    // if model exist, update it
                    if (itemModel.get('instances').get(model.id)) {
                        itemModel.get('instances').remove(model);
                    }
                }
            });
        },
    
        // Get all models by model Class
        getAll: function(classConstructor) {
            if (!classConstructor || typeof classConstructor !== 'function') {
                throw new Error("classConstructor must be exist");
            }
    
            var _instances = undefined;
            _.each(this.storage.models, function(itemModel) {
                if (itemModel.get('Class') === classConstructor) {
                    _instances = itemModel.get('instances').models;
                    return;
                }
            });
            return _instances;
        },
    
        // Check if Class Exist by model instance or model Class
        classExist: function(param) {
            if (typeof param !== 'function' && !(param instanceof Backbone.Model)) {
                throw new Error("param must be exist and must be a function or a instance model");
            }
    
            var exist = false;
            if (this.storage.models.length > 0) {
    
                _.each(this.storage.models, function(itemModel) {
                    // instance model
                    if (param instanceof Backbone.Model) {
                        if (itemModel.get('Class') === param.constructor) {
                            exist = true;
                            return;
                        }
                    } else if (typeof param === 'function') {
                        if (itemModel.get('Class') === param) {
                            exist = true;
                            return;
                        }
                    }
                });
            }
            return exist;
        },
    
        // Check if model exist into a Class organization by modelId and model Class
        modelExist: function(modelId, classConstructor) {
            var exist = false;
            if (this.storage.models.length > 0) {
    
                _.each(this.storage.models, function(itemModel) {
                    if (itemModel.get('Class') === classConstructor) {
                        if (itemModel.get('instances') && itemModel.get('instances').get(modelId)) {
                            exist = true;
                            return;
                        }
                    }
                });
            }
            return exist;
        }
    });
    
    
    JSkeleton.modelStore = new JSkeleton.ModelStore();
    'use strict';
    
    /*globals JSkeleton, Backbone, Marionette, _ */
    
    /* jshint unused: false */
    
    //## JSkeleton.Region
    JSkeleton.Region = Marionette.Region.extend({
    
        // Displays a backbone view instance inside of the region.
        // Handles calling the `render` method for you. Reads content
        // directly from the `el` attribute. Also calls an optional
        // `onShow` and `onDestroy` method on your view, just after showing
        // or just before destroying the view, respectively.
        // The `preventDestroy` option can be used to prevent a view from
        // the old view being destroyed on show.
        // The `forceShow` option can be used to force a view to be
        // re-rendered if it's already shown in the region.
        show: function(view, options) {
    
            if (!this._ensureElement()) {
                return;
            }
    
            this._ensureViewIsIntact(view);
    
            var showOptions = options || {};
            var isDifferentView = view !== this.currentView;
            var preventDestroy = !!showOptions.preventDestroy;
            var forceShow = !!showOptions.forceShow;
            var renderOptions = showOptions.renderOptions || {};
    
            // We are only changing the view if there is a current view to change to begin with
            var isChangingView = !!this.currentView;
    
            // Only destroy the current view if we don't want to `preventDestroy` and if
            // the view given in the first argument is different than `currentView`
            var _shouldDestroyView = isDifferentView && !preventDestroy;
    
            // Only show the view given in the first argument if it is different than
            // the current view or if we want to re-show the view. Note that if
            // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
            var _shouldShowView = isDifferentView || forceShow;
    
            if (isChangingView) {
                this.triggerMethod('before:swapOut', this.currentView, this, options);
            }
    
            if (this.currentView) {
                delete this.currentView._parent;
            }
    
            if (_shouldDestroyView) {
                this.empty();
    
                // A `destroy` event is attached to the clean up manually removed views.
                // We need to detach this event when a new view is going to be shown as it
                // is no longer relevant.
            } else if (isChangingView && _shouldShowView) {
                this.currentView.off('destroy', this.empty, this);
            }
    
            if (_shouldShowView) {
    
                // We need to listen for if a view is destroyed
                // in a way other than through the region.
                // If this happens we need to remove the reference
                // to the currentView since once a view has been destroyed
                // we can not reuse it.
                view.once('destroy', this.empty, this);
    
                view.render(renderOptions);
    
                view._parent = this;
    
                if (isChangingView) {
                    this.triggerMethod('before:swap', view, this, options);
                }
    
                this.triggerMethod('before:show', view, this, options);
                Marionette.triggerMethodOn(view, 'before:show', view, this, options);
    
                if (isChangingView) {
                    this.triggerMethod('swapOut', this.currentView, this, options);
                }
    
                // An array of views that we're about to display
                var attachedRegion = Marionette.isNodeAttached(this.el);
    
                // The views that we're about to attach to the document
                // It's important that we prevent _getNestedViews from being executed unnecessarily
                // as it's a potentially-slow method
                var displayedViews = [];
    
                var triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach;
                var triggerAttach = showOptions.triggerAttach || this.triggerAttach;
    
                if (attachedRegion && triggerBeforeAttach) {
                    displayedViews = this._displayedViews(view);
                    this._triggerAttach(displayedViews, 'before:');
                }
    
                this.attachHtml(view);
                this.currentView = view;
    
                if (attachedRegion && triggerAttach) {
                    displayedViews = this._displayedViews(view);
                    this._triggerAttach(displayedViews);
                }
    
                if (isChangingView) {
                    this.triggerMethod('swap', view, this, options);
                }
    
                this.triggerMethod('show', view, this, options);
                Marionette.triggerMethodOn(view, 'show', view, this, options);
    
                return this;
            }
    
            return this;
        }
    });
    
    Marionette.RegionManager.prototype.addRegion = function(name, definition) {
        var region;
    
        if (definition instanceof JSkeleton.Region) {
            region = definition;
        } else {
            region = Marionette.Region.buildRegion(definition, JSkeleton.Region);
        }
    
        this.triggerMethod('before:add:region', name, region);
    
        region._parent = this;
    
        this._store(name, region);
    
        this.triggerMethod('add:region', name, region);
    
        return region;
    };
    'use strict';
    /*globals JSkeleton, Backbone _ */
    /* jshint unused: false */
    
    //## JSkeleton.store
    JSkeleton.store = function(classConstructor, attributes) {
        if (!classConstructor || typeof classConstructor !== 'function') {
            throw new Error("classConstructor must be exist");
        }
    
        if (attributes) {
            // Find idAttribute into object attributes
            var key = undefined;
            _.each(attributes, function(value, _key) {
                if (_key === classConstructor.prototype.idAttribute) {
                    key = _key;
                    return;
                }
            });
    
            // If idAttribute exist into model attributes, find that model and get it from store
            if (key) {
                var objectId = _.pick(attributes, classConstructor.prototype.idAttribute),
                    modelId = objectId[classConstructor.prototype.idAttribute];
    
                // Check if model exist into store
                if (JSkeleton.modelStore.modelExist(modelId, classConstructor)) {
                    var model = JSkeleton.modelStore.get(modelId, classConstructor);
                    if (model) {
                        model.set(attributes);
                    }
                    return model;
                }
            }
        }
    
        // Create model instance
        var model = new classConstructor(attributes);
        JSkeleton.modelStore.add(model);
        return model;
    };
    'use strict';
    
    /*globals JSkeleton, Backbone, _ */
    
    /* jshint unused: false */
    
    var paramsNames = /:\w(\_|\w|\d)*/g;
    
    //optionalParam = /\((.*?)\)/g,
    //namedParam = /(\(\?)?:\w+/g,
    //splatParam = /\*\w+/;
    //escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    
    //## Router
    JSkeleton.Router = Backbone.Router.extend({
        routes: {},
    
        initialize: function() {
            this.listenTo(this, 'route', function() {
                var route = arguments[0];
                if (arguments[1] && arguments[1].length) {
                    route += ':' + arguments[1].join(':');
                }
            });
        },
    
        route: function(routeString, options, callback) {
            options = options || {};
    
            //register route with the jskeleton implementation for view-controller and app-workflow
            if (options.viewControllerHandler === true) {
                var routeRegex,
                    handlerName = options.handlerName && typeof options.handlerName === 'string' ? options.handlerName : this._getHandlerNameFromRoute(routeString),
                    argsNames = this._getRouteParamsNames(routeString),
                    name = options.name;
    
                if (!_.isRegExp(routeString)) {
                    routeRegex = this._routeToRegExp(routeString);
                }
    
                if (!callback) {
                    callback = this[name];
                }
    
                var router = this;
    
                Backbone.history.route(routeRegex, function(fragment) {
                    var args = router._extractParametersAsObject(routeRegex, fragment, argsNames);
                    if (router.execute(callback, args, handlerName) !== false) {
                        router.trigger.apply(router, ['route:' + name].concat(args));
                        router.trigger('route', name, args);
                        Backbone.history.trigger('route', router, name, args);
                    }
                });
    
            } else {
                //register a route with the original Backbone.Router.route implementation
                Backbone.Router.prototype.route.apply(this, arguments);
            }
    
            return this;
        },
    
        //method to replace a route string with the specified params
        _replaceRouteString: function(routeString, params) {
            var self = this,
                splatPattern;
    
            _.each(params, function(value, key) {
                routeString = routeString.replace(/:(\w)+/, function(x) {
                    //remove : character
                    x = x.substr(1, x.length - 1);
                    return params[x] ? JSkeleton.Utils.replaceSpecialChars(String(params[x])) : '';
                });
    
                // find splats
                splatPattern = new RegExp("\\*" + key);
                routeString = routeString.replace(splatPattern, value);
            });
    
            //replace uncomplete conditionals ex. (:id) and coinditional parenthesis ()
            return routeString.replace(/\(([^\):])*:([^\):])*\)/g, '').replace(/\(|\)/g, '');
        },
    
        //Cast url string to a default camel case name (commonly to call view-controller method)
        //ex: '/show/details -> onShowDetails'
        _getHandlerNameFromRoute: function(routeString) {
            var endPosParams = routeString.indexOf(':') === -1 ? routeString.length : routeString.indexOf(':'),
                endPosOptionals = routeString.indexOf('(/') === -1 ? routeString.length : routeString.indexOf('(/'),
                endPosSplats = routeString.indexOf('*') === -1 ? routeString.length : routeString.indexOf('*');
    
            var replacedString = routeString.substr(0, Math.min(endPosParams, endPosOptionals, endPosSplats)).replace(/\/(\w|\d)?/g, function(x) {
                    return x.replace(/\//g, '').toUpperCase();
                }),
                handlerName = 'on' + replacedString.charAt(0).toUpperCase() + replacedString.slice(1);
    
            return handlerName;
        },
    
        //Execute a route handler with the provided parameters.
        //Override Backbone.Router.exectue method to provide the
        //view controller handlerName based on routeString.
        execute: function(callback, args, handlerName) {
            if (callback) {
                callback.call(this, args, handlerName);
            }
        },
    
        //Execute a route handler with the provided parameters.
        //return parameters as object
        _extractParametersAsObject: function(route, fragment, argsNames) {
            var params = route.exec(fragment).slice(1),
                paramsObject = {};
    
            _.each(params, function(param, i) {
                if (i === params.length - 1) {
                    param = param || null;
                } else {
                    param = param ? decodeURIComponent(param) : null;
                }
    
                if (argsNames[i] !== undefined) {
                    paramsObject[argsNames[i]] = param;
                }
            });
    
            return paramsObject;
        },
    
        //Extracts route params names as array.
        _getRouteParamsNames: function(routeString) {
            var name = paramsNames.exec(routeString),
                names = [];
    
            while (name !== null) {
                names.push(name[0].replace(':', ''));
                name = paramsNames.exec(routeString);
            }
    
            return names;
        },
    
        //Add application routes to the Backbone.Router.
        //Could be an object with multiple routes, and with a default view controller for these routes.
        addApplicationRoutes: function(routes) {
            routes = routes || {};
    
            var defaultViewController,
                self = this;
    
            if (routes.viewController) {
                defaultViewController = routes.viewController;
            }
    
            _.each(routes, function(routeObject, routeString) {
                if (typeof routeString === 'string' && routeString !== 'viewController') {
    
                    if (!routeObject.viewControllerClass && defaultViewController) {
                        routeObject.viewController = defaultViewController;
                    }
    
                    //Add the route listener to the Backbone.Router
                    self.route(routeString, {
                        viewControllerHandler: true,
                        triggerEvent: routeObject.triggerEvent
                        // handlerName: routeObject.handlerName
                    }, function(params) {
                        //set the default view controller if it exists and if the route object doesn't have one
                        self._processRoute(routeString, _.extend(routeObject, {
                            navigate: false
                        }), params);
                    });
    
                    if (routeObject.eventListener) {
                        JSkeleton.globalChannel.on(routeObject.eventListener, function(args) {
                            self._processRoute(routeString, routeObject, args);
                        });
                    }
                }
            });
    
        },
    
        //Update the url with the specified parameters.
        //If triggerNavigate option is set to true, the route callback will be fired adding an entry to the history.
        _navigateTo: function(routeString, routeOptions, params) {
    
            var triggerValue = routeOptions.triggerNavigate === true ? true : false,
                processedRoute = this._replaceRouteString(routeString, params);
    
            this.router.navigate(processedRoute, {
                trigger: triggerValue
            });
    
        },
        //
        _processRoute: function(routeString, routeObject, params) {
            this.trigger('navigate', {
                routeString: routeString,
                routeObject: routeObject,
                params: params
            });
        },
        init: function() {
            JSkeleton.Router.start();
        }
    }, {
        // Router initialization.
        // Bypass all anchor links except those with data-bypass attribute
        // Starts router history. All routes should be already added
        start: function() {
            // Trigger the initial route and enable HTML5 History API support, set the
            // root folder to '/' by default.  Change in app.js.
            if (!Backbone.History.started) {
                Backbone.history.start();
            }
    
            // log.debug('router.location.hash', window.location.hash.replace('#/', '/'));
            // Backbone.history.navigate(window.location.hash.replace('#/', '/'), true);
        },
        // Get singleton instance bject
        getSingleton: function() {
    
            var instance = null;
    
            function getInstance() {
                if (!instance) {
                    instance = new JSkeleton.Router();
                }
                return instance;
            }
    
            JSkeleton.router = getInstance();
            return JSkeleton.router;
        }
    });
    'use strict';
    /*globals Marionette, JSkeleton, _ */
    /* jshint unused: false */
    
    /**
     * Reusable component as a Service
     */
    JSkeleton.Service = Marionette.Object.extend({
        constructor: function(opts) {
            var options = opts || {},
                // Todo serviceOptions ?
                serviceOptions = ['model', 'collection', 'events'];
    
            _.extend(this, _.pick(options, serviceOptions));
    
            this.options = _.extend({}, this.options, this.defaults, options);
    
            if (_.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        }
    
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, JSkeleton, _, Backbone */
    
    /* jshint unused: false */
    
    //## Application
    //  Application class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
    //  It initializes `regions, events, routes, channels and child applications`.
    //  It has a global channel to communicate with others apps and a private channel to communicate with it's components,
    //  A JSkeleton webapp can contain many JSkeleton.Applications.
    //  A `JSkeleton.Application` can define multiple child applications (`JSkeleton.ChildApplication`).
    JSkeleton.Application = Marionette.Application.extend({
        //Default el dom reference if no `el` it's specified
        defaultEl: 'body',
        waitBeforeStartHooks: true,
        startWithParent: true,
        filterStack: [],
        middlewareStack: [],
        constructor: function(options) {
    
            options = options || {};
    
            this.parentApplication = options.parentApplication;
    
            this._childApplications = {};
    
            if (!this.parentApplication) {
                this.el = options.el || this.el || this.defaultEl;
            }
    
            this._region = options.region;
    
            this.di = new JSkeleton.Di({
                globalDi: JSkeleton.di
            });
    
            //add routeFilters middlewares to app workflow
            if (this.routeFilters) {
                this._use('routeFilters', this.routeFilters);
            }
    
            //add middlewares to app workflow
            if (this.middlewares) {
                this._use('middlewares', this.middlewares);
            }
    
            // if (this.middlewares) {
            this._beforeStartHooks = _.clone(this.beforeStartHooks);
            // }
    
            //generate application id
            this.aid = this._getAppId();
    
            this.router = new JSkeleton.Router();
    
            //application scope to share common data inside the application
            this.scope = {};
    
            Marionette.Application.prototype.constructor.apply(this, arguments);
    
            this._addApplicationDependencies();
    
            return this;
    
        },
        //Method to start the application, start the `ChildApplications` and start listening routes/events.
        //This method will wait until the beforeStartHooks defined in the application will be completed (with a promise).
        //If an option waitBeforeStartHooks it's set to false, the application won't wait hooks before start.
        start: function(options) {
    
            // this.renderInitialState();s
    
            //Wait for all the JSkeleton.extensions
            if (this.waitBeforeStartHooks && !this.parentApplication) {
    
                this.triggerMethod('before:extension:start', options);
    
                var self = this;
    
                this._waitBeforeStartHooks().then(function() {
    
                    self.triggerMethod('extension:start', options);
    
                    self._startApplication(options);
                });
    
            } else {
                this._startApplication(options);
            }
    
        },
    
        //Method to start listening the `Backbone.Router`
        //Only a `JSkeleton.Application' can start a `JSkeleton.Router` instance.
        //The JSkeleton.Router is created by the `JSkeleton.Application` objects and injected to the `JSkeleton.ChildApplication`.
        startRouter: function() {
            // if (!this.parentApplication) {
            JSkeleton.Router.start();
            // }
        },
    
        _startApplication: function(options) {
    
            //trigger before:start event and call to onBeforeStart method if it's defined in the application object
            this.triggerMethod('before:start', options);
    
            // Create a layout for the application if a viewController its defined
            this._createApplicationLayout();
    
            //initialize and start child applications defined in the application object
            this._initChildApplications(options);
    
            this._started = true;
    
            this._initCallbacks.run(options, this);
    
            //Add routes listeners to the JSkeleton.router
            this._initRoutes(options);
    
            //Add app proxy events
            // this._proxyEvents(options);
    
            //Start the `JSkeleton.Router` to listen to Backbone.History and to listen to the global channel events
            this.startRouter();
    
            //trigger start event and call to onStart method if it's defined in the application object
            this.triggerMethod('start', options);
    
        },
    
        //Method to wait for all before start hooks defined inside the application object and inside `JSkeleton` namespace.
        // The beforeStartHooks have to be an array with methods that return promises.
        // These promises will be the wait condition.
        _waitBeforeStartHooks: function() {
    
            //get the beforeStart application Hooks and ensure that the Hooks are an array
            var beforeStartHooks = _.isArray(this._beforeStartHooks) ? this._beforeStartHooks : [this._beforeStartHooks],
                //get the beforeStart JSkeleton global Hooks and ensure that the Hooks are an array
                lookUpHooks = _.isArray(JSkeleton.beforeStartHooks) ? JSkeleton.beforeStartHooks : [JSkeleton.beforeStartHooks],
                //Concat the hooks to iterate over them
                hooks = lookUpHooks.concat(beforeStartHooks),
                self = this,
                promises = [];
    
            _.each(hooks, function(fnHook) {
                if (typeof fnHook === 'function') {
                    promises.push(fnHook.call(self));
                }
            });
    
            return JSkeleton.Promise.all(promises);
        },
    
        //Private method to initialize the application regions
        _initializeRegions: function() {
            //ensure initial root DOM reference is available
            this._ensureEl();
    
            Marionette.Application.prototype._initializeRegions.apply(this, arguments);
    
            // Create root region on root DOM reference
            if (!this.parentApplication) {
                this._createMainRegion();
            }
        },
    
        //Private method to ensure that the application has a dom reference where create the main application region
        _ensureEl: function() {
            if (!this.$el && !this.parentApplication) {
                if (!this.el) {
    
                    throw new Error('It is necessary to define a \'el\' for Main App');
                }
                this.$el = $(this.el);
            }
        },
    
        //Add the root region to the main application
        _createMainRegion: function() {
    
            if (!(this._region instanceof JSkeleton.Region)) {
                //create a new `JSkeleton.Region`
                this._region = this._regionManager.addRegion('main', this.$el);
            }
        },
    
        //Create a layout for the Application to have more regions availables.
        //The application expose the layout regions to the application object as own properties.
        _createApplicationLayout: function() {
            var layout = this.layout;
    
            //ensure viewController object is defined
            if (layout) {
                //get layout class
                var LayoutClass = typeof layout === 'object' && layout.layoutClass ? layout.layoutClass : layout,
                    //get the layout options that will be passed to the layout constructor
                    layoutOptions = typeof layout === 'object' && layout.layoutOptions ? layout.layoutOptions : {},
                    //extend viewController template
                    layoutExtendTemplate = typeof layout === 'object' && layout.template ? {
                        template: layout.template
                    } : undefined;
    
                //create the layout instance if it isn't rendered yet
                if (!this._layout || !this._layout instanceof LayoutClass) {
                    this._layout = this.getInstance(LayoutClass, layoutExtendTemplate, layoutOptions);
    
                    //Show the layout in the application main region
                    this.main.show(this._layout);
    
                    //expose the view-controller regions to the application object
                    this._addLayoutRegions();
                }
            }
        },
    
        //Expose view-controller regions to the application namespace
        _addLayoutRegions: function() {
            var self = this;
            if (this._layout.regionManager.length > 0) {
                _.each(this._layout.regionManager._regions, function(region, regionName) {
                    self[regionName] = region;
                });
            }
        },
    
        //Iterate over child applications to start each one
        _initChildApplications: function() {
            if (!this.isChildApp) {
    
                var self = this;
    
                _.each(this.applications, function(appOptions, appName) {
                    appOptions.parentApplication = self;
                    self._initChildApplication(appName, appOptions);
                });
    
                //trigger onApplicationsStart event when all the `JSkeleton.ChildApplication` are started and before the application router it's started
                this.triggerMethod('applications:start');
            }
        },
    
        //Start child application with it's dependencies injected
        _initChildApplication: function(appName, appOptions) {
            appOptions = appOptions || {};
    
            //get application class definition (could be either a factory key string or an application class)
            var appClass = appOptions.applicationClass, //DI: this.getClass(appOptions.applicationClass)
                startWithParent = appOptions.startWithParent !== undefined ? appOptions.startWithParent : true;
    
            //Get the region where the `JSkeleton.ChildApplication` logic the `JSkeleton.ChildApplication` layout and the `JSkeleton.ChildApplication` view-controllers will be 'rendered'.
            //It would be the main application region by default, but if a layout it's defined for the Application object, a different region must be defined.
            appOptions.region = this._getChildAppRegion(appOptions);
    
            //Ommit instanciate config options
            var instanceOptions = _.omit(appOptions, 'applicationClass', 'startWithParent');
            //Instance the `JSkeleton.ChildApplication` class with the `JSkeleton.ChildApplication` options specified
            var instance = this.getInstance(appClass, {}, instanceOptions); //DI: resolve dependencies with the injector (using the factory object maybe)
    
            //expose the child application instance
            this._childApplications[appName] = instance;
    
            //Start child application
            if (startWithParent === true) {
                this.startChildApplication(instance, instanceOptions.startOptions);
            }
        },
    
        //Get the region where a `JSkeleton.ChildApplication` will be rendered when process a route or an event
        _getChildAppRegion: function(appOptions) {
            var region,
                regionName = appOptions.region || this.mainRegionName;
    
            //retrieve the region from the application layout (if it exists)
            if (this._layout && this._layout.regionManager) {
                region = this._layout.regionManager.get(regionName);
            }
    
            //if the region isn`t in the application layout, retrieve the region from the application region manager defined as application region
            if (!region) {
                region = this._regionManager.get(regionName);
            }
    
            //the region must exists
            if (!region) {
                throw new Error('The region must exist in the Application.');
            }
    
            return region;
        },
    
        //Method to explicit start a child app instance
        startChildApplication: function(childApp, options) {
            childApp.start(options);
        },
    
        //Get child app instance by name
        getChildApplication: function(appName) {
            return this._childApplications[appName];
        },
        stop: function(options) {
            this.stopListening();
        },
        //Call to the specified view-controller method for render a app state
        invokeViewControllerRender: function(routeObject, args, handlerName) {
            // var hook = this.getHook(),
            //Get the view controller instance
            var viewController = routeObject._viewController = this._getViewControllerInstance(routeObject);
    
            this.triggerMethod('onNavigate', viewController);
    
            this._showViewController(viewController, handlerName, args);
        },
        //Factory method to instance objects from Class references or from factory key strings
        getInstance: function(Class, extendProperties, options) {
            options = options || {};
            options.parentApp = this;
    
            return this.di.create(Class, extendProperties, options);
        },
        destroy: function(options) {
            this.removeRegions();
        },
        removeRegions: function() {
            //TODO
        },
        getDefaultviewController: function() {},
        //Get default application layout class if no layoutClass is specified
        getDefaultLayoutClass: function() {
            return Marionette.LayoutView;
        },
        //Factory hook method
        getHook: function() {
            return new JSkeleton.Hook();
        },
        //Generate unique app id using underscore uniqueId method
        _getAppId: function() {
            return _.uniqueId('a');
        },
        _addApplicationDependencies: function() {
    
            this.di.inject({
                _privateChannel: this.privateChannel,
                _globalChannel: this.globalChannel,
                _app: this,
                _scope: this.scope
            });
    
        },
        //Show the controller view instance in the application region
        _showViewController: function(viewController, handlerName, args) {
    
            if (this._region && this._region.currentView !== viewController) {
    
                this._region.show(viewController, {
                    renderOptions: args
                });
    
            } else {
                // view already rendered, update view
                if (this._region) {
                    viewController.refresh({
                        renderOptions: args
                    });
                }
            }
        },
        //Add application routes  to the router and event handlers to the global channel
        _initRoutes: function() {
    
            var self = this;
    
            this.router.addApplicationRoutes(this.routes);
    
            this.listenTo(this.router, 'navigate', function(opts) {
                self._processNavigation(opts.routeString, opts.routeObject, opts.params /*, handlerName, args*/ );
            });
    
        },
        //Process a navigation (either event or route navigation).
        //Check if the navigation should be completed (if all the filters success).
        //Also call to the declared middlewares before navigate.
        _processNavigation: function(routeString, routeObject, args, handlerName) {
    
            if (this._routeFilterProcessing(routeString, routeObject, args)) {
    
                //middlewares processing before navigation
                this._middlewaresProcessing(routeString, routeObject, args);
    
                //check if the navigate option is set to false to prevent from change the navigation url
                if (routeObject.navigate !== false) {
                    //update the url
                    this._navigateTo.call(this, routeString, routeObject, args);
                }
    
                this.invokeViewControllerRender(routeObject, args, handlerName || 'processContext');
            }
    
        },
        //Update the url with the specified parameters.
        //If triggerNavigate option is set to true, the route callback will be fired adding an entry to the history.
        _navigateTo: function(routeString, routeOptions, params) {
    
            var triggerValue = routeOptions.triggerNavigate === true ? true : false,
                processedRoute = this.router._replaceRouteString(routeString, params);
    
            this.router.navigate(processedRoute, {
                trigger: triggerValue
            });
    
        },
        //RouteFilters Middlewares handlers processor
        _routeFilterProcessing: function(routeString, routeOptions, params) {
            var self = this,
                filterError = false,
                err = null,
                result,
                _routeParams = {
                    routeString: routeString,
                    routeOptions: routeOptions,
                    params: params
                };
    
            var mainStack = (this.parentApp) ? this.parentApp.filterStack : this.filterStack;
    
            if (mainStack.length !== 0) {
                for (var i = 0; i < mainStack.length; i++) {
                    result = mainStack[i].call(self, _routeParams);
                    if (typeof result !== true && typeof result !== 'undefined') {
                        filterError = true;
                        err = result;
                        break;
                    }
                }
            }
    
            if (filterError === false) {
                return true;
            } else {
                this.parentApp ? this.parentApp.triggerMethod('filter:error', err, _routeParams) : this.triggerMethod('filter:error', err, _routeParams); //jshint ignore:line
            }
        },
        //Middlewares handlers processing
        _middlewaresProcessing: function(routeString, routeOptions, params) {
            var self = this,
                _routeParams = {
                    routeString: routeString,
                    routeOptions: routeOptions,
                    params: params
                };
    
            var mainStack = (this.parentApp) ? this.parentApp.middlewareStack : this.middlewareStack;
    
            if (mainStack.length !== 0) {
                for (var i = 0; i < mainStack.length; i++) {
                    mainStack[i].call(self, _routeParams);
                }
            }
        },
        _use: function(type, fn) {
            var offset = 1;
            var fns = _.flatten(Array.prototype.slice.call(arguments, offset));
    
            if (fns.length === 0) {
                throw new TypeError('Application.use() requires functions');
            }
            //evaluate type of middlewares and push to their stack
            if (type === 'routeFilters') {
                this.filterStack = _.union(this.filterStack, fns);
            } else if (type === 'middlewares') {
                this.middlewareStack = _.union(this.middlewareStack, fns);
            }
        },
        // Get a view controller instance (if no view controller is specified, a default view controller class is instantiated).
        //Ensure that don't extist a view-controller and if exist that it's not destroyed.
        //The view controller is instantiated using the `JSkeleton.Di` to resolve the view-controller dependencies.
        _getViewControllerInstance: function(routeObject) {
            var self = this,
                //get the view-controller instance (if it exists)
                viewController = routeObject._viewController,
                //get the view-controller class
                ViewControllerClass = routeObject.viewControllerClass,
                //get the view-controller options
                viewControllerOptions = routeObject._viewControllerOptions || {};
    
            //get the view-controller template
            var viewControllerExtendTemplate = routeObject.template ? {
                template: routeObject.template
            } : undefined;
    
            if (!viewController || viewController.isDestroyed === true) {
                viewController = this.getInstance(ViewControllerClass, viewControllerExtendTemplate, viewControllerOptions);
                this.listenTo(viewController, 'destroy', this._removeViewController.bind(this, routeObject, viewController));
            }
    
            return viewController;
        },
        //Get the application view-controller class.
        //Retrieve a default view controller class if no controller is specified in the options.
        //If a key string is specified as view-controller, a factory object is retrieved `{Class: ClassReference, Parent: ParentClassReference}`
        _getViewControllerClass: function(options) {
            var ViewController;
    
            //the view controller class is a factory key string
            if (typeof options.viewControllerClass === 'string') {
                ViewController = JSkeleton.factory.get(options.viewControllerClass);
            } else {
                //the view controller class is a class reference
                //If no view controller class is specified, a default JSkeleton.ViewController is retrieved
                ViewController = options.viewControllerClass || JSkeleton.ViewController;
            }
    
            return ViewController;
        },
        _removeViewController: function(routeObject, viewController) {
            if (routeObject._viewController === viewController) {
                routeObject._viewController = undefined;
            }
        },
        //Attach application events to the global channel (triggers and listeners)
        _proxyEvents: function(options) {
            options = options || {};
            var events = options.events || this.events || {};
    
            this._proxyTriggerEvents(events.triggers);
            this._proxyListenEvents(events.listen);
        },
        //Attach trigger events:
        //Propagate internal events (application channel) into the global channel
        _proxyTriggerEvents: function(triggerArray) {
            var self = this;
            //Check if triggers are defined
            if (triggerArray && typeof triggerArray === 'object') {
                _.each(triggerArray, function(eventName) {
                    //Listen to the event in the private channel
                    self.listenTo(self.privateChannel, eventName, function() {
                        var args;
                        //if the event type is 'all', the first argument is the name of the event
                        if (eventName === 'all') {
                            eventName = arguments[0];
                            //casting arguments array-like object to array with excluding the eventName argument
                            args = [eventName].concat(Array.prototype.slice.call(arguments, 1));
                        } else {
                            //casting arguments array-like object to array
                            args = Array.prototype.slice.call(arguments);
                        }
    
                        //trigger the event throw the globalChannel
                        self.globalChannel.trigger.apply(self.globalChannel, [eventName].concat(args));
                    });
                });
    
            }
        },
        //Attach Global events to the private channel:
        //Propagate external events (global channel) into the private channel
        _proxyListenEvents: function(listenObject) {
            var self = this;
            if (listenObject && typeof listenObject === 'object') {
                _.each(listenObject, function(eventName) {
                    //Listen to that event in the global channel
                    self.listenTo(self.globalChannel, eventName, function() {
                        var args;
    
                        //if the event is 'all' the first argument is the name of the event
                        if (eventName === 'all') {
                            eventName = arguments[0];
                            //casting arguments array-like object to array with excluding the eventName argument
                            args = [eventName].concat(Array.prototype.slice.call(arguments, 1));
                        } else {
                            //casting arguments array-like object to array
                            args = Array.prototype.slice.call(arguments);
                        }
    
                        //trigger the event throw the globalChannel
                        self.privateChannel.trigger.apply(self.privateChannel, [eventName].concat(args));
                    });
                });
            }
        }
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, JSkeleton*/
    
    /* jshint unused: false */
    
    JSkeleton.View = Marionette.View.extend({
        constructor: function(options) {
            options = options || {};
    
            this._app = options.app;
    
            Marionette.View.apply(this, arguments);
    
        }
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, JSkeleton*/
    
    /* jshint unused: false */
    
    JSkeleton.ItemView = Marionette.ItemView.extend({
        constructor: function(options) {
            JSkeleton.View.apply(this, arguments);
        }
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, JSkeleton */
    
    /* jshint unused: false */
    
    JSkeleton.LayoutView = Marionette.LayoutView.extend({
        regionClass: JSkeleton.Region,
        constructor: function(options) {
            options = options || {};
    
            this._firstRender = true;
            this._initializeRegions(options);
    
            JSkeleton.ItemView.call(this, options);
        }
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, JSkeleton, _*/
    
    /* jshint unused: false */
    
    JSkeleton.CollectionView = Marionette.CollectionView.extend({
    
        constructor: function(options) {
            this.once('render', this._initialEvents);
    
            this._initChildViewStorage();
    
            JSkeleton.View.apply(this, arguments);
    
            this.on('show', this._onShowCalled);
    
            this.initRenderBuffer();
        },
    
        //override Marionette method to inject dependencies (as application channel, application reference ...) into child views
        buildChildView: function(child, ChildViewClass, childViewOptions) {
            var options = _.extend({
                model: child,
                channel: this.channel,
                _app: this._app
            }, childViewOptions);
    
            return new ChildViewClass(options);
        },
    
        getChildView: function(child) {
            var childView = this.getOption('childView');
    
            //The child view is a `JSkeleton.Factory` key string reference
            if (typeof childView === 'string') {
                childView = JSkeleton.factory.getClass(childView);
            }
    
            if (!childView) {
                throw new Marionette.Error({
                    name: 'NoChildViewError',
                    message: 'A "childView" must be specified'
                });
            }
            return childView;
        }
    
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    
    'use strict';
    
    /*globals Marionette, JSkeleton*/
    
    /* jshint unused: false */
    
    JSkeleton.CompositeView = Marionette.CompositeView.extend({
    
        constructor: function(options) {
            JSkeleton.CollectionView.apply(this, arguments);
        },
    
        getChildView: function(child) {
            var childView = this.getOption('childView');
    
            //The child view is a `JSkeleton.Factory` key string reference
            if (typeof childView === 'string') {
                childView = JSkeleton.factory.getClass(childView);
            }
    
            if (!childView) {
                childView = this.constructor;
            }
    
            return childView;
        }
    }, {
        factory: JSkeleton.Utils.FactoryAdd
    });
    
        'use strict';
    
        /*globals JSkeleton, Marionette, _ */
    
        //## ViewController
        // The view controller object is an hybrid of View/Controller. It is responsible for render an application
        // state, build up the application context and render the application components.
        JSkeleton.ViewController = JSkeleton.LayoutView.extend({
            //re-render the view-controller when the render promise is completed
            renderOnPromise: true,
            constructor: function(options) {
                options = options || {};
                this._app = options.app;
                this.region = options.region;
                this.service = options.service;
                this.context = {};
                this.components = {};
                this.events = this.events || {};
                this.handlerName = options.handlerName || {};
                JSkeleton.LayoutView.prototype.constructor.apply(this, arguments);
            },
    
            //expose application enviroment, ViewController context and `Marionette.templateHelpers` to the view-controller template
            mixinTemplateHelpers: function(target) {
                target = target || {};
                var templateHelpers = this.getOption('templateHelpers');
    
                templateHelpers = Marionette._getValue(templateHelpers, this);
    
                var templateContext = {
                    enviroment: {
                        _app: this._app,
                        _view: this,
                        _channel: this.channel
                    },
                    templateHelpers: templateHelpers,
                    context: this.context, // TODO: Mirar bien
                    serializedData: target
                };
    
                return templateContext;
            },
    
            addComponent: function(name, instance) {
                this.components[name] = this.components[name] || [];
                this.components[name].push(instance);
            },
    
            _destroyComponents: function() {
                var component;
    
                _.each(this.components, function(componentArray) {
                    for (var i = 0; i < componentArray.length; i++) {
                        component = componentArray[i];
    
                        if (component && _.isFunction(component.destroy)) {
                            component.destroy();
                        }
    
                        delete componentArray[i];
                    }
                });
            },
    
            //Override Marionette._delegateDOMEvents to add Components listeners
            _delegateDOMEvents: function(eventsArg) {
                var events = Marionette._getValue(eventsArg || this.events, this),
                    componentEvents = JSkeleton.Utils.extractComponentEvents(events);
    
                events = _.omit(events, _.keys(componentEvents));
    
                this._componentEvents = componentEvents;
    
                return Marionette.View.prototype._delegateDOMEvents.call(this, events);
            },
    
            //Bind event to the specified component using listenTo method
            _delegateComponentEvent: function(component, event, handlerName) {
                var handler = this[handlerName];
    
                if (!handler || typeof handler !== 'function') {
                    throw new Error('You have to define a valid method as handler of event view');
                }
    
                if (component && component.isDestroyed !== true) {
                    this.listenTo(component, event, handler);
                }
            },
    
            //Bind off event to the specified component using off method
            _undelegateComponentEvent: function(component, event, handler) {
                this.off(event, handler);
            },
    
            unbindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    var componentName = JSkeleton.Utils.normalizeComponentName(eventName),
                        eventType = JSkeleton.Utils.normailzeEventType(eventName),
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
    
                        self._undelegateComponentEvent(component, eventType, method);
    
                    });
                });
            },
    
            //Attach events to the controller-view components to listenTo those events with `@component.ComponentName` event notation
            bindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    //Get component name from event hash `@component.ComponentName`
                    var componentName = JSkeleton.Utils.normalizeComponentName(eventName),
                        //Get event name from event hash `click @component.ComponentName`
                        eventType = JSkeleton.Utils.normailzeEventType(eventName),
                        //Get the component instance by component name
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
                        self._delegateComponentEvent(component, eventType, method);
                    });
                });
            },
    
            render: function(args) {
    
                this._processState(args);
    
                this.baseRender();
    
                return this;
            },
    
            baseRender: function() {
    
                this._destroyComponents();
    
                JSkeleton.LayoutView.prototype.render.apply(this, arguments);
    
                this.unbindComponents();
    
                this.bindComponents();
    
            },
    
            refresh: function(options) {
                options = options || {};
    
                if (options.processState) {
                    this._processState(options.renderoptions);
                }
    
                this.baseRender();
    
            },
    
            _processState: function(args) {
                var promise,
                    methodName = 'onStateChange',
                    self = this;
    
                this.context.isPromise = false;
    
                if (this[methodName] && typeof this[methodName] === 'function') {
                    promise = this[methodName].call(this, args);
                }
    
                //the result of the "render"
                //method invocation is a promise and will be resolved later
                if (promise && typeof promise.then === 'function') {
                    promise.then(function() {
                        //expose a isPromise flag to the template
                        self.context.isPromise = false;
                        //if the `renderOnPromise` option is set to true, re-render the `JSkeleton.ViewController`
                        if (self.renderOnPromise === true) {
                            self.refresh();
                            //JSkeleton.LayoutView.prototype.render.apply(this, arguments);
                        }
                    });
    
                    //Set up the `JSkeleton.ViewController` context
                    this.context.isPromise = true;
                }
            },
    
            destroy: function() {
                this._destroyComponents();
                return Marionette.LayoutView.prototype.destroy.apply(this, arguments);
            }
        });
     'use strict';
     /*globals Marionette, JSkeleton, _ */
     /* jshint unused: false */
    
    
     Marionette.Renderer.render = function(template, data) {
         data = data || {};
    
         // data.enviroment; //_app, channel, _view
         // data.templateHelpers; //Marionette template helpers view
         // data.serializedData; //Marionette model/collection serializedData
         // data.context; //View-controller context
    
         if (!template && template !== '') {
             throw new Marionette.Error({
                 name: 'TemplateNotFoundError',
                 message: 'Cannot render the template since its false, null or undefined.'
             });
         }
    
         template = typeof template === 'function' ? template(data) : template;
    
         template = typeof template === 'string' ? template : String(template);
    
         var compiler = JSkeleton.htmlBars.compiler,
             DOMHelper = JSkeleton.htmlBars.DOMHelper,
             hooks = JSkeleton.htmlBars.hooks,
             render = JSkeleton.htmlBars.render;
    
         var templateSpec = compiler.compileSpec(template, {}),
             templatePreCompiled = compiler.template(templateSpec),
             env = {
                 dom: new DOMHelper(),
                 hooks: hooks,
                 helpers: JSkeleton._helpers,
                 enviroment: data.enviroment,
                 scope: hooks.createFreshScope() // for helper access to the enviroments
             };
    
         hooks.bindSelf(env, env.scope, data);
    
         //template access: context (view-controller context) , templateHelpers and model serialized data
    
         var dom = render(templatePreCompiled, env, env.scope, {
             //contextualElement: output
         }).fragment;
    
         return dom;
     };
        'use strict';
        /*globals JSkeleton */
    
        JSkeleton._helpers = {};
    
        JSkeleton.registerHelper = function(name, helperFunc) {
            JSkeleton._helpers[name] = helperFunc;
        };
    
    
        function normalizeArray(env, array) {
            var out = new Array(array.length);
    
            for (var i = 0, l = array.length; i < l; i++) {
                out[i] = env.hooks.getValue(array[i]);
            }
    
            return out;
        }
    
        function normalizeObject(env, object) {
            var out = {};
    
            for (var prop in object) {
                out[prop] = env.hooks.getValue(object[prop]);
            }
    
            return out;
        }
    
        JSkeleton.htmlBars.hooks.invokeHelper = function(morph, env, scope, visitor, _params, _hash, helper, templates, context) {
            var params = normalizeArray(env, _params);
            var hash = normalizeObject(env, _hash);
            return {
                value: helper.call(context, hash, env, params, templates)
            };
        };
         'use strict';
         /*globals  JSkeleton, _ */
         /* jshint unused: false */
    
         JSkeleton.registerHelper('@component', function(params, env, args) {
             // env.enviroment._app;
             // env.enviroment.channel;
             //env.enviroment._view, view-controller
             //
    
             params = params || {};
    
             var componentName = typeof args[0] === 'string' ? args[0] : params.name,
                 ComponentClass,
                 component,
                 viewInstance = env.enviroment._view,
                 componentData;
    
             if (!componentName) {
                 throw new Error('You must define a Component Class Name.');
             }
    
             //omit component factory name
             componentData = _.omit(params, 'name');
    
             //inject component dependencies
             componentData = _.extend(componentData, {
                 _app: env.enviroment._app
             });
    
             component = JSkeleton.factory.new(componentName, componentData);
    
             if (!component || typeof component !== 'object') {
                 throw new Error('It is not possible create the component.');
             }
    
             viewInstance.addComponent(componentName, component);
    
             return component.render().$el.get(0);
         });
     'use strict';
     /*globals  JSkeleton, _ */
     /* jshint unused: false */
     var shouldDisplay = function(param, param2, operator) {
         var result;
    
         if (operator) {
    
             switch (operator) {
                 case '===':
                     result = param === param2;
                     break;
                 case '==':
                     result = param == param2; // jshint ignore:line
                     break;
                 case '>':
                     result = param > param2;
                     break;
                 case '>=':
                     result = param >= param2;
                     break;
                 case '<':
                     result = param < param2;
                     break;
                 case '<=':
                     result = param <= param2;
                     break;
                 case '!=':
                     result = param != param2; // jshint ignore:line
                     break;
                 case '!==':
                     result = param !== param2;
                     break;
                 default:
                     result = false;
             }
    
         } else {
             result = !!param;
         }
    
         return result;
     };
    
     JSkeleton.registerHelper('if', function(params, env, args, options) {
         if (!options.template && !options.inverse) {
             // <strong  class="{{if assertion "result" "alternative"}}">
             // true --> <strong  class="result">
             // false --> <strong  class="alternative">
             var condition = args[0],
                 truthyStr = args[1] || '',
                 falsyStr = args[2] || '';
    
             return condition ? truthyStr : falsyStr;
         } else {
             var condition = shouldDisplay(args[0], args[2], args[1]),
                 truthyTemplate = options.template || '',
                 falsyTemplate = options.inverse || '';
    
             var template = condition ? truthyTemplate : falsyTemplate;
    
             if (template && typeof template.render === 'function') {
                 return template.render(undefined, env);
             }
         }
    
     });
    
          'use strict';
          /*globals  JSkeleton, _, Backbone */
          /* jshint unused: false */
    
          JSkeleton.registerHelper('each', function(params, env, args, options) {
              var itemName = args[0],
                  collection = args[2],
                  template = options.template;
              // domFragment = env.dom.createDocumentFragment();
    
              if (!collection) {
                  return;
              }
    
              if (typeof itemName !== 'string') {
                  throw new Error('You have to define a valid string name for the iteration in the each helper.');
              }
    
              var scope = env.hooks.createChildScope(env.scope);
    
              var renderTemplate = function(count, element) {
                  var child,
                      data;
    
                  if (element instanceof Backbone.Model) {
                      data = element.toJSON();
                  } else {
                      data = element;
                  }
    
                  scope.self[itemName] = _.extend({
                      count: count
                  }, data);
    
    
                  if (template && typeof template.render === 'function') {
                      template.yieldItem('each', scope);
                  }
              };
    
              //the collection has an each implementation
              if (collection.each) {
    
                  //iterate over the collection
                  collection.each(function(element, count) {
                      renderTemplate(count, element);
                  });
    
              } else {
    
                  //the collection doesn't have an each implementation
                  for (var i = 0; i < collection.length; i++) {
                      renderTemplate(i, collection[i]);
                  }
    
              }
    
              scope.self[itemName] = {};
    
              env.hooks.updateScope(env, env.scope);
    
          });
    'use strict';
    
    /* globals JSkeleton, Marionette, _ */
    
    JSkeleton.Extension = Marionette.Object.extend({
        constructor: function() {
            this.extensions = {};
            this.promises = [];
        },
        // Add extension to JSkeleton.
        //
        //
        //
        add: function(name, options) {
            options = options || {};
    
            var extension = this.extensions[name] = _.extend(options, {
                //Extension class function
                proto: options.extensionClass,
                //A resolved flag to indicate if the extension asynchronous is resolved.
                resolved: options.async === true ? false : true,
                //The value returned by the async resolver function
                resolvedValue: undefined,
                //A promise to resolve the async. It has to be resolved when the extension be ready for use it.
                promise: options.promise
            });
    
            if (options.async === true && !options.promise instanceof Promise) {
                throw new Error('If the extension is asynchronous you have to provide a promise to resolve the async.');
            }
    
            //If the extension factory flag is set to true and has a function class, add the extension class to the `JSkeleton.factory`
            if (options.factory !== false && typeof options.extensionClass === 'function') {
                JSkeleton.factory.add(name, options.extensionClass);
            }
    
            if (options.async === true) {
                this.promises.push(options.promise);
                //if an option beforeStartHook it's set to true, add a beforeStartHook to JSKeleton namespace that will be processed when a `JSkeleton.Application` starts
                if (options.beforeStartHook === true) {
    
                    JSkeleton.Utils.addBeforeStartHook(JSkeleton, function() {
                        return options.promise;
                    });
    
                }
            }
        },
        //
        //
        //
        wait: function(name, callback) {
            var self = this,
                extension = this.extensions[name];
    
            return new JSkeleton.Promise(function(promiseResolver) {
    
                if (extension.async === true && extension.resolved !== true) {
                    var resolvedValue = extension.resolver();
    
                    if (typeof resolvedValue.then === 'function') {
                        //the resolver function returns a promise, stored in resolverValue
                        extension.resolverValue.then(function(resolvedExtension) {
                            self._resolveResource(resolvedExtension, promiseResolver, callback);
                            extension.resolved = true;
                            extension.resolvedValue = resolvedExtension;
                        });
                    } else {
                        //the resolver function returns a simple value
                        self._resolveResource(resolvedValue, promiseResolver, callback);
                        extension.resolved = true;
                        extension.resolvedValue = resolvedValue;
                    }
    
                } else {
                    self._resolveResource(extension.resolvedValue, promiseResolver, callback);
                }
    
            });
    
        },
        waitAll: function() {
            var numPromises = this.promises.length;
    
            return new JSkeleton.Promise(function(resolve) {
    
                if (numPromises === 0) {
                    resolve();
                }
    
                JSkeleton.Promise.all(this.promises).then(function() {
                    resolve();
                });
    
            });
        },
        //
        //
        //
        _resolveResource: function(resource, promiseResolver, callback) {
            if (typeof promiseResolver === 'function') {
                promiseResolver(resource);
            }
    
            if (typeof callback === 'function') {
                callback(resource);
    
            }
        }
    });
    'use strict';
    /*globals JSkeleton, Backbone, _, Marionette */
    /* jshint unused: false */
    
    var Utils = JSkeleton.Utils = {};
    
    // RegExp @component htmlBars
    Utils.regExpComponent = /{{@component/ig;
    
    //replace string chars (instead using encodeUrl)
    Utils.replaceSpecialChars = function(text) {
        if (typeof text === 'string') {
    
            var specialChars = 'ãàáäâèéëêìíïîòóöôùúüûÑñÇç \'',
                chars = 'aaaaaeeeeiiiioooouuuunncc--';
    
            for (var i = 0; i < specialChars.length; i++) {
                text = text.replace(new RegExp(specialChars.charAt(i), 'g'), chars.charAt(i));
            }
        }
        return text;
    };
    
    Utils.stringToObject = function(string) {
        var start = (string ? string.indexOf('{') : -1),
            options = {};
    
        if (start !== -1) {
            try {
                /*jslint evil: true */
                options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
            } catch (e) {
                throw new Error('InvalidJsonFormat - ' + string);
            }
        }
    
        return options;
    };
    
    Utils.normalizeComponentName = function(eventString) {
        var name = /@component\.[a-zA-Z_$0-9]*/g.exec(String(eventString))[0].slice(11);
    
        return name;
    };
    
    // utility method for parsing event syntax strings to retrieve the event type string
    Utils.normailzeEventType = function(eventString) {
        var eventType = /(\S)*/g.exec(String(eventString))[0].trim();
    
        return eventType;
    };
    
    // utility method for extract @component. syntax strings
    // into associated object
    Utils.extractComponentEvents = function(events) {
        return _.reduce(events, function(memo, val, eventName) {
            if (eventName.match(/@component\.[a-zA-Z_$0-9]*/g)) {
                memo[eventName] = val;
            }
            return memo;
        }, {});
    };
    
    // allows for the use of the @component. syntax within
    // a given key for triggers and events
    // swaps the @component with the associated component object.
    // Returns a new, parsed components event hash, and mutate the object events hash.
    // Utils.normalizeComponentKeys = function(events, components) {
    //     return _.reduce(events, function(memo, val, key) {
    //         var normalizedKey = Marionette.normalizeComponentString(key, components);
    //         memo[normalizedKey] = val;
    //         return memo;
    //     }, {});
    // };
    
    
    var BackboneExtend = Backbone.Model.extend;
    
    // Util function to correctly set up the prototype chain for subclasses.
    // Override the Backbone extend implementation to integrate with JSkeleton.factory
    // and with JSkeleton.Di JSkeleton.di
    Utils.FactoryAdd = function(name /*,deps, protoProps, staticProps*/ ) {
        var areDeps = _.isArray(arguments[1]),
            ClassProperties = areDeps ? arguments[2] : arguments[1],
            Parent = this,
            deps = areDeps ? arguments[1] : undefined,
            Class;
    
        //the object has dependencies (as a function) but doesn't have an array with explicit dependencies
        if (deps === undefined && _.isFunction(ClassProperties)) {
            deps = JSkeleton.Di.extractDependencyNames(ClassProperties);
        }
    
        if (_.isFunction(ClassProperties)) {
            JSkeleton.factory.add(name, ClassProperties, Parent, deps);
        } else {
            //the class doesn't have dependencies
            //get the inherited class using default Backbone extend method
            Class = BackboneExtend.apply(this, Array.prototype.slice.call(arguments, 1));
            //add the inherited class to the JSkeleton.factory
            JSkeleton.factory.add(name, Class);
    
            return Class;
        }
    
    };
    
    
    Utils.addBeforeStartHook = function(namespace, hook) {
        if (typeof namespace !== 'object') {
            throw new Error();
        }
    
        if (!namespace.beforeStartHooks) {
            namespace.beforeStartHooks = [];
        }
    
        namespace.beforeStartHooks.push(hook);
    };
    
    'use strict';
    /*globals Marionette, JSkeleton, _, Backbone */
    /* jshint unused: false */
    
    //Application object factory
    var factory = {};
    
    //Default available factory objects
    factory.prototypes = {
        Model: {
            Class: Backbone.Model
        },
        Collection: {
            Class: Backbone.Collection
        }
    };
    
    //Available singletons objects
    factory.singletons = {};
    
    //Adds an object class to the factory
    factory.add = function(key, ObjClass, ParentClass, deps) {
    
        if (this.prototypes[key]) {
            throw new Error('AlreadyDefinedFactoryObject - ' + key);
        }
    
        this.prototypes[key] = {
            Class: ObjClass
        };
    
        if (ParentClass) {
            this.prototypes[key].Parent = ParentClass;
        }
    
        if (deps) {
            this.prototypes[key].dependencies = deps;
        }
    };
    
    //Creates a new object.
    //Can recieve an object class or a string object factory key.
    //It resolves the object dependencies with the global dependency injector JSkeleton.di
    factory.new = function(obj, options /* ,more constructor args */ ) {
        options = options || {};
    
        var FactoryObject;
    
        if (typeof obj === 'object' || typeof obj === 'function') {
            FactoryObject = obj;
        } else {
            FactoryObject = this.prototypes[obj];
        }
    
        if (!FactoryObject) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        //resolve dependencies
        return JSkeleton.di.create.apply(JSkeleton.di, [FactoryObject, undefined].concat(Array.prototype.slice.call(arguments, 1)));
    };
    
    //Creates a new singleton object o retrieves the created one
    factory.singleton = function(obj, options) {
        options = options || {};
    
        if (!this.singletons[obj]) {
            this.singletons[obj] = this.new(obj, options);
        }
    
        return this.singletons[obj];
    };
    
    //Retrieves an Object reference
    factory.get = function(obj) {
    
        if (!this.prototypes[obj]) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return this.prototypes[obj];
    };
    
    //Retrieves an Object reference
    factory.getClass = function(obj) {
    
        if (!this.prototypes[obj]) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return this.prototypes[obj].Class;
    };
    
    //Gets all objects added to the factory
    factory.getAll = function() {
        return this.prototypes;
    };
    
    // empty factory prototypes
    factory.empty = function() {
        this.prototypes = {
            Model: {
                Class: Backbone.Model
            },
            Collection: {
                Class: Backbone.Collection
            }
        };
    };
    
    JSkeleton.factory = factory;
    'use strict';
    
    /* globals _, JSkeleton */
    
    // Application global config and params
    var common = JSkeleton.common = {
        config: {
            mode: undefined,
            version: '0.0.1',
            // application name
            appName: 'jskeleton-app',
            // Client type
            clientType: 'WEB',
            // WebApp root URL
            wwwRoot: window.location.protocol + '//' + window.location.host + window.location.pathname,
            //Default lang
            lang: 'es-ES'
        }
    };
    
    // Returns all application config params
    common.getConfig = function() {
        return this.config;
    };
    
    // Overrides current config with params object config
    common.setConfig = function(config) {
    
        _.extend(this.config, config);
    
        return this;
    };
    
    
    // Gets a specific config param
    common.get = function(field) {
        if (this.config[field] === undefined) {
            throw new Error('UndefinedCommonField "' + field + '"');
        }
        return this.config[field];
    };
    
    // Gets a specific config param or default
    common.getOrDefault = function(field, defaultValue) {
        return this.config[field] || defaultValue;
    };
    
    // Sets a new value for specific config param
    common.set = function(field, value) {
        this.config[field] = value;
    };
    'use strict';
    /* globals JSkeleton */
    
    
    /**
     * Module to manage Marionette behaviors
     * @exports behaviors
     * @namespace
     * @memberof app
     */
    var behaviors = {
    
        /**
         * Defines a behaviors lookup namespace
         * @type {Object}
         */
        lookup: {},
    
        /**
         * Storages only defaults behaviors
         * @type {Object}
         */
        defaults: {}
    
    };
    
    /**
     * Adds a behavior
     * @param {Object} params
     * @param {String} params.name
     * @param {Marionette.Behavior} params.behaviorClass
     * @param {Object} params.isDefault
     */
    behaviors.add = function(params) {
        if (params.isDefault) {
            this.defaults[params.name] = {};
        }
        this.lookup[params.name] = params.behaviorClass;
    };
    
    /**
     * Gets a specific behavior
     * @param  {Object} params
     * @param  {String} params.name
     * @param  {Object} params.options  Behavior options
     * @return {Object} Behavior config for Marionette.View.behaviors function
     */
    behaviors.get = function(params) {
    
        if (behaviors.lookup[params.name]) {
            var behavior = {};
            behavior[params.name] = params.options || {};
            return behavior;
        }
        throw new Error('behaviors:behavior:undefined');
    };
    
    /**
     * Gets defaults behaviors
     * @param  {Object} options  Behavior options
     * @return {Object} Behavior config for Marionette.View.behaviors function
     */
    behaviors.getDefaults = function(options) {
        return _.extend(_.clone(this.defaults), options);
    };
    
    // Tell Marionette where to lookup for behaviors
    Marionette.Behaviors.behaviorsLookup = function() {
        return behaviors.lookup;
    };
    
    
    JSkeleton.behaviors = behaviors;
    

    return JSkeleton;

});