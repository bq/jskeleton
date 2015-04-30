 'use strict';
 /*globals Marionette, Jskeleton, _ */
 /* jshint unused: false */


 // utility method for parsing @component. syntax strings
 // into associated object
 Marionette.normalizeComponentName = function(eventString) {
     var name = /@component\.[a-zA-Z_$0-9]*/g.exec(String(eventString))[0].slice(11);

     return name;
 };

 // utility method for parsing event syntax strings to retrieve the event type string
 Marionette.normailzeEventType = function(eventString) {
     var eventType = /(\w)+\s*/g.exec(String(eventString))[0].trim();

     return eventType;
 };

 // utility method for extract @component. syntax strings
 // into associated object
 Marionette.extractComponentEvents = function(events) {
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
 Marionette.normalizeComponentKeys = function(events, components) {
     return _.reduce(events, function(memo, val, key) {
         var normalizedKey = Marionette.normalizeComponentString(key, components);
         memo[normalizedKey] = val;
         return memo;
     }, {});
 };