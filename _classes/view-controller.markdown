---
layout: api
title:  "ViewController"
submenu:
  - ViewController.channel: "#viewcontroller-channel"
  - ViewController.region: "#viewcontroller-region"
  - ViewController.service: "#viewcontroller-service"
  - ViewController.context: "#viewcontroller-context"
  - ViewController.components: "#viewcontroller-components"
  - ViewController.events: "#components-events"
  - ViewController.template: "#viewcontroller-template"
---

El objeto `Jskeleton.ViewController` nos permite "renderizar" el estado de una aplicación procesando una ruta o un evento de navegación. Es un hibrido entre Vista y Controlador.

Se podría definir como un contenedor de "Componentes-UI", entendiendo como tales cualquier componente javascript que tenga como finalidad encapsular lógica UI y que pueda generar HTML (`Jskeleton.ItemView` , `Jskeleton.CollectionView`, `Jskeleton.CompositeView`, `Jskeleton.LayoutView`).

`Jskeleton.ViewController` extiende de `Marionette.LayoutView`. Para más información sobre las propiedades y métodos de esta clase visita [la documentación de Marionette](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html)

##ViewController channel

##ViewController region

##ViewController service

##ViewController context

Cuando se procesa un evento o ruta de navegación, un método del view-controller es invocado (para ver más información sobre que método ir a: ); tras la ejecución de dicho método, se renderiza el template asociado al view controller con el contexto del view controller. Por tanto dicho método es ideal para inflar el contexto que el template va a consumir y exponer los modelos y colecciones que los componentes del template vayan a usar.

    {% highlight javascript %}

   Jskeleton.ViewController.extend({
        onBookList: function(routeParams, context){
            context.model = new Backbone.Model({

            });
        }
    });

    {% endhighlight %}

En el template asociado al view controller, tendremos total acceso al contexto creado por el view controller.

    {% highlight html %}
        <div> { { context.model } } </div>
    {% endhighlight %}

El método podrá devolver una promesa para resolver asincronamente el renderizado...

##Dependency injection

##ViewController components

A través del template podremos definir componentes ui que el view-controller va a crear al renderizar el template:

    {% highlight html %}
        <div> { { @component name="menu-bar" model=context.model } } </div>
    {% endhighlight %}

Para más información sobre componentes ir a:

##Components events

##ViewController template





