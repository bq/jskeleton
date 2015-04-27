    'use strict';
    /*globals Jskeleton */

    Jskeleton._helpers = {};

    Jskeleton.registerHelper = function(name, helperFunc) {
        Jskeleton._helpers[name] = helperFunc;
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

    Jskeleton.htmlBars.hooks.invokeHelper = function(morph, env, scope, visitor, _params, _hash, helper, templates, context) {
        var params = normalizeArray(env, _params);
        var hash = normalizeObject(env, _hash);
        return {
            value: helper.call(context, hash, env, params, templates)
        };
    };