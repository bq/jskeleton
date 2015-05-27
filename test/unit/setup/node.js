/* globals require */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');
var requireHelper = require('./require-helper');

chai.use(sinonChai);
chai.use(chaiJq);

global.should = chai.should();
global.expect = chai.expect;
global.sinon = sinon;

if (!global.document || !global.window) {
    var jsdom = require('jsdom').jsdom;

    global.document = jsdom('<html><head><script></script></head><body></body></html>', null, {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
        MutationEvents: '2.0',
        QuerySelector: false
    });

    global.window = document.createWindow();
    global.navigator = global.window.navigator;

    global.window.Node.prototype.contains = function(node) {
        'use strict';
        return this.compareDocumentPosition(node) && 16;
    };
}

global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.Radio = require('backbone.radio');
global.Marionette = require('backbone.marionette');
global.Promise = require('es6-promise');
global.slice = Array.prototype.slice;

//var htmlbarsDomHelper = require('../../../node_modules/htmlbars/dist/cjs/dom-helper.js');
//var htmlbarsCompiler =  require('../../../node_modules/htmlbars/dist/cjs/htmlbars-compiler.js');
//var htmlbarsRuntime =   require('../../../node_modules/htmlbars/dist/cjs/htmlbars-runtime.js');

global.BackboneRadio = require('../../../bower_components/backbone.radio/src/backbone.radio.js');

/*global.JSkeleton.htmlBars =  {
    compiler: htmlbarsCompiler,
    DOMHelper: htmlbarsDomHelper.default,
    /*hooks: htmlbarsRuntime.hooks,*/
/* render: htmlbarsRuntime.render
};*/

if (!process.env || process.env.SOURCES !== 'MARIONETTE') {
    //Marionette.Deferred = global.Backbone.$.Deferred;
    global.JSkeleton = {};
    global.JSkeleton = require('../../../dist/jskeleton.js');
    // Promise polyfill fix
    requireHelper('/core/renderer.js');
    requireHelper('/core/model.js');
    requireHelper('/core/collection.js');
    requireHelper('/core/modelStore.js');
    requireHelper('/helpers/html-bars.js');
    requireHelper('/helpers/component.js');
    requireHelper('/helpers/if.js');
    requireHelper('/helpers/each.js');
    requireHelper('/utils/utils.js');
    requireHelper('/utils/common.js');
    requireHelper('/utils/factory.js');
    requireHelper('/utils/extension.js');
    requireHelper('/core/router.js');
    requireHelper('/core/service.js');
    requireHelper('/core/base-application.js');
    requireHelper('/core/application.js');
    requireHelper('/core/child-application.js');
    requireHelper('/core/di.js');
    requireHelper('/core/view.js');
    requireHelper('/core/item-view.js');
    requireHelper('/core/layout-view.js');
    requireHelper('/core/collection-view.js');
    requireHelper('/core/composite-view.js');
    requireHelper('/core/view-controller.js');
}