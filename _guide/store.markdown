---
layout: guide
title:  "Store"
aside_order: 3
submenu:
  - Definition: "#definition"
  - JSkeleton.store: "#JSkeleton.store"
---

##Definición

El objeto `store` será la interfaz para crear, actualizar y obtener modelos de Backbone contenidos en el `storage` o almacén de modelos. De este modo, la forma de interactuar con el storage será a través de `JSkeleton.store()`.


##JSkeleton.store

Creación de modelos mediante el store con attributos.

{% highlight javascript %}
/**
 * @param modelClass Clase del modelo a crear
 * @param attributes
 * @return object instancia de modelo
 */
JSkeleton.store(modelClass, attributes)

var BookModel = Jskeleton.Model.extend({
    idAttribute: 'isbn'
});

var model = JSkeleton.store(BookModel, {
    isbn: 123,
    title:'foo'
});

{% endhighlight %}


Actualizar un modelo mediante el store con nuevos attributos.

{% highlight javascript %}
/**
 * @param modelClass Clase del modelo a crear
 * @param attributes
 * @return object instancia de modelo
 */
JSkeleton.store(modelClass, attributes)

JSkeleton.store(BookModel, {
    isbn: 123,
    title:'foo',
    desc: 'foo description'
});

{% endhighlight %}


Obtener un modelo del storage.

{% highlight javascript %}
/**
 * @param modelClass Clase del modelo a crear
 * @param attributes attribute with id
 * @return object instancia de modelo
 */
JSkeleton.store(modelClass, attributes)

var model = JSkeleton.store(BookModel, {
    isbn: 123
});

{% endhighlight %}
