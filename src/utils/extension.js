'use strict';
/*globals Marionette, JSkeleton, _, Backbone */
/* jshint unused: false */

var extension = function(name, classToExtend, extensionContent) {
    var jskeletonClass = JSkeleton[classToExtend];

    if (!jskeletonClass) {
        throw new Error('You must specify a existent JSkeleton Class');
    } else if (!extensionContent || typeof extensionContent !== 'object') {
        throw new Error('You must spefify a correct extension object');
    } else {
        JSkeleton[name] = jskeletonClass.extend(extensionContent);
    }
};

JSkeleton.extension = extension;