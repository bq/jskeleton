---
layout: api
title:  "ModelStore"
submenu:
  - initialize: "#initialize"
  - storage: "#storage"
  - modelStore.add: "#add"
  - modelStore.get: "#get"
  - modelStore.remove: "#remove"
  - modelStore.getAll: "#getAll"
  - modelStore.classExist: "#classExist"
  - modelStore.modelExist: "#modelExist"
---

El objeto `JSkeleton.ModelStore` define un `storage` o almacén de modelos organizados por su clase, además de determinados métodos extra para poder manipular dicho almacén de modelos.

##storage
El atributo `storage` es una collección de modelos de Backbone organizados por sus clases. Su estructura es la siguiente:

{% highlight javascript %}
* storage
    * Backbone.Model
        * Class         // Class Constructor Ej: BookModel
        * instances     // models Backbone.Collection
            * instance1
            * instance2
            *    ...
    * Backbone.Model
        * Class         // Class Constructor Ej: AuthorModel
        * instances     // models Backbone.Collection
            * instance1
            * instance2
            * instance3
            *    ...
{% endhighlight %}

Tendremos acceso a nuestro storage mediante nuestra instancia de `ModelStore`, `JSkeleton.modelStore.storage`.

##add
Agregar o actualizar un modelo al `storage`.
{% highlight javascript %}
var model = new FooModel({id:1, title:'foo'});
/**
 * @param model innstance
 */
JSkeleton.modelStore.add(model);
{% endhighlight %}

##get
Obtener un modelo almacenado en el `storage`.
{% highlight javascript %}

/**
 * @param modelId
 * @param model Class
 * @return model instance
 */
// JSkeleton.modelStore.get(modelId, modelClass);

var model = JSkeleton.modelStore.get(1, FooModel);
{% endhighlight %}

##remove
Eliminar un modelo del `storage`.
{% highlight javascript %}

var foomodel = new FooModel();
/**
 * @param model instance
 */
// JSkeleton.modelStore.remove(model);

JSkeleton.modelStore.remove(foomodel);
{% endhighlight %}

##getAll
Obtener todos los modelos de una clase del `storage`
{% highlight javascript %}
/**
 * @param model Class
 * @return array model instances
 */
// JSkeleton.modelStore.getAll(modelClass);

var models = JSkeleton.modelStore.getAll(FooModel);
{% endhighlight %}

##classExist
Comprueba si existe una organización de clase en el  `storage`. El parámetro que se le pasa puede ser una clase de modelo (por ejemplo, 'FooModel') o una instancia cualquiera.

{% highlight javascript %}
/**
 * @param model instance or model Class
 * @return boolean
 */
// JSkeleton.modelStore.classExist(modelClass);

if(JSkeleton.modelStore.classExist(FooModel)){
    ...
}
{% endhighlight %}

##modelExist
Comprueba si existe un modelo en una determinada organización de clase en el `storage`.
{% highlight javascript %}
/**
 * @param modelId
 * @param model Class
 * @return boolean
 */
// JSkeleton.modelStore.modelExist(modelId, modelClass);

if(JSkeleton.modelStore.modelExist(1, FooModel)){
    ...
}
{% endhighlight %}
