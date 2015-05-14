'use strict';
/*globals Marionette, Jskeleton, _, Backbone */
/* jshint unused: false */

var extension = function(name, classToExtend, extensionContent){
    var jskeletonClass = Jskeleton[classToExtend];

    if (!jskeletonClass){
        throw new Error('You must specify a existent Jskeleton Class');
    }
    else if(!extensionContent || typeof extensionContent !== 'object'){
        throw new Error('You must spefify a correct extension object');
    }
    else{
        Jskeleton[name] = jskeletonClass.extend(extensionContent);
    }
};

Jskeleton.extension = extension;
