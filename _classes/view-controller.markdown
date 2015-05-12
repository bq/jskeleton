---
layout: api
title:  "ViewController"
submenu:
  - ViewController.channel: "#viewcontroller-channel"
  - ViewController.region: "#viewcontroller-region"
  - ViewController.service: "#viewcontroller-service"
  - ViewController.context: "#viewcontroller-context"
  - ViewController.components: "#viewcontroller-components"
  - ViewController.events: "#viewcontroller-events"
  - ViewController.template: "#viewcontroller-template"
  - ViewController.render: "#viewcontroller-render"
  - ViewController.destroy: "#viewcontroller-destroy"
---

El objeto `Jskeleton.ViewController` nos permite "renderizar" el estado de una aplicación procesando una ruta o un evento de navegación. Es un hibrido entre Vista y Controlador.

Se podría definir como un contenedor de "Componentes-UI", entendiendo como tales cualquier componente javascript que tenga como finalidad encapsular lógica UI y que pueda generar HTML (`Jskeleton.ItemView` , `Jskeleton.CollectionView`, `Jskeleton.CompositeView`, `Jskeleton.LayoutView`).

`Jskeleton.ViewController` extiende de `Marionette.LayoutView`. Para más información sobre las propiedades y métodos de esta clase visita [la documentación de Marionette](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html)

##ViewController channel
El `channel` del ViewController define como se propagan los eventos del mismo a través de la aplicación. Cada vez que se crea un nuevo ViewController debemos inyectar su `channel`, que puede ser privado o global (ver Application.channels).

{% highlight javascript %}
  _channel.trigger('some:event');
{% endhighlight %}

En el ejemplo anterior el evento `some:event` sería propagado por `_channel`. En el siguiente ejemplo se puede ver como se definiría dentro de un ViewController:

{% highlight javascript %}
   Jskeleton.ViewController.factory('DetalleDeLibro', function(_channel) {
       return {
           events: {
               'navigate @component.DetailBookView': 'onNavigateClicked'
           },
           onNavigateClicked: function() {
               _channel.trigger('book:list');
           }
       };
   });
{% endhighlight %}

Los `channel` se basan en `Backbone.Radio`. Para mas información puedes acceder a [su documentación](https://github.com/marionettejs/backbone.radio#channels).

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

##ViewController Components

A través del template podremos definir componentes ui que el view-controller va a crear al renderizar el template:

    {% highlight html %}
        <div> { { @component name="menu-bar" model=context.model } } </div>
    {% endhighlight %}

A su vez, una vez destruido un ViewController todos sus componentes son también destruidos.

Para más información sobre componentes puedes ir a [esta sección](/api-reference/components/)

##ViewController Events

Los eventos definidos en cada componente pueden disparar otros eventos definidos en el ViewController a través de su `channel`.

{% highlight html %}
  Jskeleton.ViewController.factory('BookListController', function(_channel) {
       events: {
           'some:event @component.menu-bar': 'onMenuClicked'
       }
  });
{% endhighlight %}

##ViewController Template

##ViewController Render

##ViewController Destroy
