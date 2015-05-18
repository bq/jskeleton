---
layout: api
title:  "ViewController"
submenu:
  - ViewController.region: "#region"
  - ViewController.routeMethod: "#Route method"
  - ViewController.renderOnPromise: "#asincronia"
  - ViewController.context: "#context"
  - ViewController.components: "#components"
  - ViewController.events: "#componentEvents"
  - ViewController.template: "#template"
---

El objeto `Jskeleton.ViewController` nos permite "renderizar" el estado de una aplicación procesando una ruta o un evento de navegación. Es un hibrido entre Vista y Controlador.

Se podría definir como un contenedor de "Componentes-UI", entendiendo como tales cualquier componente javascript que tenga como finalidad encapsular lógica UI y que pueda generar HTML (`Jskeleton.ItemView` , `Jskeleton.CollectionView`, `Jskeleton.CompositeView`, `Jskeleton.LayoutView`).

`Jskeleton.ViewController` extiende de `Marionette.LayoutView`. Para más información sobre las propiedades y métodos de esta clase visita [la documentación de Marionette](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html)

##Route Method

##Regions

Se pueden definir regiones sobre un `Jskeleton.ViewController`.

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


Para más información sobre cómo definir regiones en un `Jskeleton.ViewController` visita la página de documentación de Marionette [Marionette.LayoutView](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html).

##Context
<!--
Cuando se procesa un evento o ruta de navegación, un método del view-controller es invocado (para ver más información sobre que método ir a: ); tras la ejecución de dicho método, se renderiza el template asociado al view controller con el contexto del view controller. Por tanto dicho método es ideal para inflar el contexto que el template va a consumir y exponer los modelos y colecciones que los componentes del template vayan a usar.
-->
Cuando se procesa un evento o ruta de navegación, se invoca un método (`handler`) del ViewController que se debe especificar en la aplicación en la que estemos definiendo el ViewController ([ver Application.Routes](/api-reference/application/#routes)). Tras la ejecución de dicho método, se renderiza el template asociado al ViewController con su contexto. Este método es el lugar ideal para exponer los modelos y colecciones que nuestros componentes vayan a usar.

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

###Asincronía
Podemos definir una opcion en los `Jskeleton.ViewController` para poder realizar un renderizado en "dos pasos" si hay un proceso de asincronía a la hora de exponer el contexto.
Esa opción es `renderOnPromise`.

  {% highlight javascript %}

    Jskeleton.ViewController.factory('MyViewController', {
      renderOnPromise: true //default true
    });

  {% endhighlight %}

Si la opción está activada y el método de navegación devuelve una promesa, el `Jskeleton.ViewController` realizará un primer renderizado antes de la resolución de la promesa y otro después. `Jskeleton` expondrá una variable al contexto con la cuál podremos saber si hay una asincronía por resolver o no.

  {% highlight html %}

{ {#if context.isPromise } }
        <div class="spinner"></div>
{ {else} }
        { {@component UserList collection=context.collection} }
{ {/if} }

  {% endhighlight %}

Además `Jskeleton.ViewController` lanzará el evento `before:promise` cuándo se renderice por primera antes de que la promesa se complete y `after:promise` después de que la promesa se complete y se lleve a cabo el segundo renderizado.

Èn caso de que la opción `renderOnPromise` sea `false` el proceso de doble renderizado no se realizará, aunque si se lanzara el evento y se expondrá la variable `isPromise` al contexto del `Jskeleton.ViewController`.

##Components

A través del template podremos definir componentes ui que el view-controller va a crear al renderizar el template:

    {% highlight html %}
        <div> { { @component name="menu-bar" model=context.model } } </div>
    {% endhighlight %}

A su vez, una vez destruido un ViewController todos sus componentes son también destruidos.

Para más información sobre componentes puedes ir a [esta sección](/api-reference/components/).

###getComponent

Para obtener el componente de un view controller se puede invocar el método `getComponent`.

{% highlight javascript %}

  Jskeleton.ViewController.factory('MyViewController', {
      events: {
         'action @component.ComponentName': 'myOtherMethod'
      }
  });

  var viewController = new Jskeleton.ViewController();

  var component = viewController.getComponent('ComponentName');

{% endhighlight %}

###Component Events

La clase Jskeleton.ViewController te permite escuchar eventos sobre sus propios componentes.
Estos eventos se pueden especificar de forma declarativa con el hash @component antes del nombre del componente:

{% highlight javascript linenos=inline %}
  Jskeleton.ViewController.factory('MyViewController', {
      events: {
         'action @component.ComponentName': 'myOtherMethod'
      }
  });
{% endhighlight %}

En este ejemplo:

* En la línea 7 se define un evento que esuchará la acción `action` lanzada desde el componente ComponentName.

Si un 'Jskeleton.ViewController' define varios componentes con el mismo nombre, el evento se añadirá sobre todos los componentes con ese nombre.

También se pueden añadir eventos de forma explicita accediendo a la instancia del componente desde el 'Jskeleton.ViewController del siguiente modo:

{% highlight javascript linenos=inline %}
  Jskeleton.ViewController.factory('MyViewController', {
      onRender: function(){
        this.getComponent('ComponentName').on('action',function(){

        });
      },
      events: {
         'action @component.ComponentName': 'myOtherMethod'
      }
  });
{% endhighlight %}

##Template

El ViewController renderiza un `template` donde se podrán definir también los componentes del mismo.

  {% highlight javascript linenos=inline %}

    Jskeleton.ViewController.factory('DetalleDeLibro', function() {
        return {
            template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
        };
    });

  {% endhighlight %}

