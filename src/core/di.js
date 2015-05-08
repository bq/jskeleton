'use strict';

/*globals Marionette, Jskeleton,_ */

/* jshint unused: false */

///## Di
//  Dependency Injection (DI) is a software design pattern that deals with how "components" get hold of their dependencies.
//  The Jskeleton Dependency Injection subsystem is called inside constructor classes and resolves the instance dependency before
//  instantiation object. This subsystem creates an clousure invoking all dependencies inside.

Jskeleton.Di = Marionette.Object.extend({
    globalDi: undefined,
    initialize: function(options) {
        options = options || {};

        if (options.globalDi) {
            this.globalDi = options.globalDi;
        }

        this.dependencies = {};

    },
    inject: function(deps) {
        this.dependencies = _.extend(this.dependencies, deps);
    },
    //Instance the object with the factory key and store the instance as a injection dependency
    store: function(factoryKey) {
        var FactoryObject = Jskeleton.factory.get(factoryKey),
            instance;

        instance = this._resolve.apply(this, [FactoryObject].concat(Array.prototype.slice.call(arguments, 1)));

        this.dependencies[factoryKey] = instance;

        return instance;

    },
    //Instance the object with the factory key or the factory object.
    //The object can be a factory key string reference, the object class or the factory object
    create: function( /*factoryKey||Class||FactoryObject, args..*/ ) {
        var FactoryObject;

        if (typeof arguments[0] === 'string') {
            //The object is referenced by a factory key string
            FactoryObject = Jskeleton.factory.get(arguments[0]);
        } else {
            if (!arguments[0].Class) {
                //The object isn't a factory object (is a class reference)
                FactoryObject = {
                    Class: arguments[0]
                };
            } else {
                //the first argument is a factory object
                FactoryObject = arguments[0];
            }
        }


        return this._resolve.apply(this, [FactoryObject].concat(Array.prototype.slice.call(arguments, 1)));
    },
    _resolve: function(FactoryObject, extendProperties /*, args..*/ ) {
        var constructorArgs = Array.prototype.slice.call(arguments, 2),
            dependency;

        if (!FactoryObject || !FactoryObject.Class) {
            throw new Error(Jskeleton.Di.NoDependencyError);
        }

        //the dependency object has dependencies
        if (typeof FactoryObject.Class === 'function' && FactoryObject.Parent) {

            if (!FactoryObject.Parent) {
                throw new Error(Jskeleton.Di.NoParentClassError);
            }

            dependency = this._resolveDependencies(FactoryObject.Class, FactoryObject.Parent, extendProperties, constructorArgs);

        } else {
            //the dependency object  hasnt dependencies
            dependency = this.instantiateClass(FactoryObject.Class, extendProperties, constructorArgs);
        }


        return dependency;

    },
    _resolveDependencies: function(func, Parent, extendProperties, constructorArgs) {

        var deps, args = [],
            self = this;

        deps = func.toString().match(Jskeleton.Di.FN_ARGS)[1].replace(/ /g, '').split(',');


        return (function() {

            for (var i = 0; i < deps.length; i++) {
                var d = deps[i];
                args.push(self._getDependency(d));
            }

            //Resolve dependencies within the clousure function
            var props = func.apply(this, args);

            //if extendProperties are expecified, extend with injected props
            if (extendProperties) {
                props = _.extend(props, extendProperties);
            }

            //extend the class with the parent properties
            var InjectedClass = Parent.extend(props);

            //instantiate the class with constructor arguments
            return self.instantiateClass(InjectedClass, undefined, constructorArgs);

        })();
    },
    instantiateClass: function(Class, extendProperties, constructorArgs) {

        if (extendProperties) {
            Class = Class.extend(extendProperties);
        }

        var Temp = function() {}, // temporary constructor
            inst, ret; // other vars

        // Give the Temp constructor the Constructor's prototype
        Temp.prototype = Class.prototype;

        // Create a new instance
        inst = new Temp; // jshint ignore:line

        // Call the original Constructor with the temp
        // instance as its context (i.e. its 'this' value)
        Class.apply(inst, constructorArgs);

        return inst;
        // var Surrogate = function() {
        //     this.constructor = Class;
        // };

        // Surrogate.prototype = Class.prototype;
        // Class.prototype = new Surrogate;

        // return Class.apply(Surrogate, constructorArgs);
    },
    _getDependency: function(dependencyName) {
        //Search the dependency instance in the injector cache
        var dep = this.dependencies[dependencyName];

        if (!dep && this.globalDi) {
            //Search the dependency instance in the global injector cache
            dep = this.globalDi._getDependency(dependencyName);
        }

        if (!dep) {
            //instance the dependency
            dep = this.store(dependencyName);
        }

        // throw new Error(Jskeleton.Di.NoDependencyError);
        return dep;
    }
}, {
    FN_ARGS: /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    NoDependencyError: 'Jskeleton.DI: Unknown dependency.',
    NoParentClassError: 'Jskeleton.DI: Unknown parent class.'

});
