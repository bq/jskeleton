---
layout: api
title:  "ViewController"
submenu:
  - ViewController.channel: "#channel"
  - ViewController.region: "#region"
  - ViewController.service: "#service"
  - ViewController.context: "#context"
  - ViewController.components: "#components"
  - ViewController.events: "#events"
  - ViewController.template: "#template"
---

El objeto `Jskeleton.ViewController` nos permite "renderizar" el estado de una aplicación procesando una ruta o un evento de navegación. Es un hibrido entre Vista y Controlador.

Se podría definir como un contenedor de "Componentes-UI", entendiendo como tales cualquier componente javascript que tenga como finalidad encapsular lógica UI y que pueda generar HTML (`Jskeleton.ItemView` , `Jskeleton.CollectionView`, `Jskeleton.CompositeView`, `Jskeleton.LayoutView`).

`Jskeleton.ViewController` extiende de `Marionette.LayoutView`. Para más información sobre las propiedades y métodos de esta clase visita [la documentación de Marionette](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html)

##Channel
El `channel` del ViewController define como se propagan los eventos del mismo a través de la aplicación. Cada vez que se crea un nuevo ViewController debemos inyectar su `channel`, que puede ser privado o global ([ver Application.channels](/api-reference/application/#channels)).

{% highlight javascript %}
  _channel.trigger('some:event');
{% endhighlight %}

En el ejemplo anterior el evento `some:event` sería propagado por `_channel`. En el siguiente ejemplo se puede ver como se definiría dentro de un ViewController:

{% highlight javascript linenos=inline %}
   Jskeleton.ViewController.factory('MyViewController', function(_channel) {
       return {
           events: {
               'myevent @component.MyComponent': 'myMethod'
           },
           myMethod: function() {
               _channel.trigger('application:event');
           }
       };
   });
{% endhighlight %}

En la linea 1 definimos un ViewController `MyViewController` al que le inyectamos el canal privado `_channel` de la aplicación en la que va a estar contenido.

En la línea 4 creamos un nuevo evento `myevent` que afectara al componente `MyComponent` que, al ser llamado, ejecutará al método `myMethod` definido en la línea 6.

A su vez, `myMethod` dispara otro evento, `application:event`, que estará siendo escuchado en el ámbito de la aplicación que contenga la instancia de `MyViewController`, gracias a que ha sido disparado a través del canal privado `_channel`.

Los `channel` se basan en `Backbone.Radio`. Para mas información puedes acceder a [su documentación](https://github.com/marionettejs/backbone.radio#channels).

##Region

Un ViewController renderiza sus componentes sobre una región o regiones.

  {% highlight javascript linenos=inline %}
    var Layout = Jskeleton.ViewController.factory('MainViewController', {
        regions: {
            headerRegion: '.header',
            contentRegion: '.content',
            footerRegion: '.footer'
        },
        onStart: function() {
        }
    });
  {% endhighlight %}

##Context
<!--
Cuando se procesa un evento o ruta de navegación, un método del view-controller es invocado (para ver más información sobre que método ir a: ); tras la ejecución de dicho método, se renderiza el template asociado al view controller con el contexto del view controller. Por tanto dicho método es ideal para inflar el contexto que el template va a consumir y exponer los modelos y colecciones que los componentes del template vayan a usar.
-->
Cuando se procesa un evento o ruta de navegación, se invoca un método (`handler`) del ViewController que se debe especificar en la aplicación en la que estemos definiendo el ViewController ([ver Application.Routes](/api-reference/application/#routes)). Tras la ejecución de dicho método, se renderiza el template asociado al ViewController con su contexto.

Por tanto, dicho método es ideal para inflar el contexto que el template va a consumir y exponer los modelos y colecciones que los componentes del template vayan a usar.

  {% highlight javascript linenos=inline %}

    Jskeleton.ViewController.factory('MyViewController', function(_channel) {
        myHandlerMethod: function(routeParams, context){
            context.myModel = new Backbone.Model({
                title: routeParams.title,
            });
        }
    });

  {% endhighlight %}

En el template asociado al ViewController, tendremos total acceso al contexto creado por el ViewController.

  {% highlight html %}
      <div> { { context.myModel } } </div>
  {% endhighlight %}

El método podrá devolver una promesa para resolver asincronamente el renderizado...

##Components

A través del template podremos definir componentes ui que el view-controller va a crear al renderizar el template:

    {% highlight html %}
        <div> { { @component name="menu-bar" model=context.model } } </div>
    {% endhighlight %}

A su vez, una vez destruido un ViewController todos sus componentes son también destruidos.

Para más información sobre componentes puedes ir a [esta sección](/api-reference/components/).

##Events

Los eventos pueden ser definidos en una clase ViewController.
Pueden escuchar acciones propagadas a través de su `channel`, sobre su propio `template` o dentro de sus componentes.

{% highlight javascript linenos=inline %}
  Jskeleton.ViewController.factory('MyViewController', function(_channel) {
      template: '<h1> My Template with components: </h1>' +
                '<div class="panel">This is a template</div>' +
                ' { { @component name="MyComponent" model=context.myModel } }',
      events: {
         'click .panel': 'myMehtod'
         'action @component.MyComponent': 'myOtherMethod',
         'childview:action @component.MyCollectionView': 'myAnotherMethod',
      },
      myMethod: function(){
        alert('Panel clicked!')
      },
      myOtherMethod: function(){
        alert('Something happened in MyComponent!')
      },
      myAnotherMethod: function(){
        alert('Something happened in MyCollectionView!')
      },
  });
{% endhighlight %}

En este ejemplo:

* En la línea 6 se define un nuevo evento que escuchará la acción 'click' sobre el `<div>` con clase `panel` definido en la línea 3.
* En la línea 7 se define un evento que esuchará la acción `action` lanzada desde el componente MyComponent.
* En la línea 8 se define un evento que esuchará la acción `action` lanzada desde el componente MyCollectionView de la vista `childview`.

Los `events` se basan en `Backbone.Events`. Para mas información puedes acceder a [su documentación](http://backbonejs.org/#Events).

##Template

El ViewController renderiza un `template` donde se podrán definir también los componentes del mismo.

  {% highlight javascript linenos=inline %}

    Jskeleton.ViewController.factory('DetalleDeLibro', function() {
        return {
            template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
        };
    });

  {% endhighlight %}

