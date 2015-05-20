'use strict';

/*globals Marionette, JSkeleton,_ */

/* jshint unused: false */

///## Di
//  Dependency Injection (DI) is a software design pattern that deals with how "components" get hold of their dependencies.
//  The JSkeleton Dependency Injection subsystem is called inside constructor classes and resolves the instance dependency before
//  instantiation object. This subsystem creates an clousure invoking all dependencies inside.

JSkeleton.Di = Marionette.Object.extend({
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
        var FactoryObject = JSkeleton.factory.get(factoryKey),
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
            FactoryObject = JSkeleton.factory.get(arguments[0]);
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
        if (!FactoryObject || !FactoryObject.Class) {
            throw new Error(JSkeleton.Di.NoDependencyError);
        }

        var constructorArgs = Array.prototype.slice.call(arguments, 2),
            dependency,
            Class = FactoryObject.Class;


        //the dependency object has dependencies
        if (typeof FactoryObject.Class === 'function' && FactoryObject.dependencies) {

            if (!FactoryObject.Parent) {
                throw new Error(JSkeleton.Di.NoParentClassError);
            }

            dependency = this._resolveDependencies({
                Class: Class,
                Parent: FactoryObject.Parent,
                extendProperties: extendProperties,
                dependencies: FactoryObject.dependencies
            }, constructorArgs);

            //the dependency object  hasn't dependencies
        } else {

            //extend class properties
            if (extendProperties) {
                Class = Class.extend(extendProperties);
            }

            dependency = this.instantiateClass(Class, constructorArgs);
        }


        return dependency;

    },
    _resolveDependencies: function(options, constructorArgs) {

        var deps, args = [],
            self = this,
            func = options.Class,
            Parent = options.Parent,
            extendProperties = options.extendProperties || {};

        deps = options.dependencies || JSkeleton.Di.extractDependencyNames(func);

        return (function() {

            for (var i = 0; i < deps.length; i++) {
                var d = deps[i];
                args.push(self._getDependency(d));
            }

            //Resolve dependencies within the clousure function
            var props = func.apply(this, args);

            //if extendProperties are expecified, extend with injected props
            if (options.extendProperties) {
                props = _.extend(props, extendProperties);
            }

            //extend the class with the parent properties
            var InjectedClass = Parent.extend(props);

            //instantiate the class with constructor arguments
            return self.instantiateClass(InjectedClass, constructorArgs);

        })();
    },
    instantiateClass: function(Class, constructorArgs) {

        var Child = function() {}, // temporary constructor
            inst, ret; // other vars

        // Give the Temp constructor the Constructor's prototype
        Child.prototype = Class.prototype;

        // Create a new instance
        inst = new Child; // jshint ignore:line

        // Call the original Constructor with the temp
        // instance as its context (i.e. its 'this' value)
        Class.apply(inst, constructorArgs);

        return inst;
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

        // throw new Error(JSkeleton.Di.NoDependencyError);
        return dep;
    }
}, {
    FN_ARGS: /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    NoDependencyError: 'JSkeleton.DI: Unknown dependency.',
    NoParentClassError: 'JSkeleton.DI: Unknown parent class.',
    extractDependencyNames: function(func) {
        return func.toString().match(JSkeleton.Di.FN_ARGS)[1].replace(/ /g, '').split(',');
    }
});
