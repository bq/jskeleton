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

El objeto `JSkeleton.ModelStore` define un `storage` o almacén de modelos organizados por su clase además de determinados métodos accesorios para poder manipular nuestro almacén de modelos.

##storage
El attributo `storage` es una collección de Backbone, nuestro "almacén" de modelos organizados por clase con la siguiente estructura:

{% highlight javascript %}
* storage
    * Backbone.Model
        * Class         // Class Constructor Ej: BookModel
        * instances     // models Backbone.Collection
    * Backbone.Model
        * Class         // Class Constructor Ej: AuthorModel
        * instances     // models Backbone.Collection
{% endhighlight %}

Tendremos acceso a nuestro storage mediante nuestra instancia de ModelStore,  `JSkeleton.modelStore.storage`

##add
Agregar o actualizar un modelo en el `storage`
{% highlight javascript %}
var model = new FooModel({id:1, title:'foo'});

JSkeleton.modelStore.add(model);
{% endhighlight %}

##get
Obtener un modelo del `storage`
{% highlight javascript %}
JSkeleton.modelStore.get(1, FooModel);
{% endhighlight %}

##remove
Eliminar un modelo del `storage`
{% highlight javascript %}
JSkeleton.modelStore.remove(model);
{% endhighlight %}

##getAll
Obtener todos los modelos de una clase del `storage`
{% highlight javascript %}
JSkeleton.modelStore.getAll(FooModel);
{% endhighlight %}

##classExist
Comprueba si existe una organización de clase en el  `storage`
`*param` puede ser una Clase de modelo Ej: `FooModel` o una instancia
{% highlight javascript %}
JSkeleton.modelStore.classExist(param);
{% endhighlight %}

##modelExist
Comprueba si existe un modelo en una determinada organización de clase en el `storage`
{% highlight javascript %}
JSkeleton.modelStore.modelExist(1, FooModel);
{% endhighlight %}

