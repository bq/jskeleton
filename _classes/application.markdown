---
layout: api
title:  "Application"
submenu:
  - Application.rootEl: "#rootel"
  - Application.rootRegion: "#application-main-region"
  - Application.regions: "#regions"
  - Application.layout: "#layout"
  - Application.applications: "#child-applications"
  - Application.channels: "#channels"
---

 `JSkeleton.Application` es un contenedor donde almacenar y dividir en pequeñas partes la lógica de tu aplicación web, haciéndola más reusable, desacoplada y escalable.


##Documentation Index
* [Application DOM](#application-dom)
    * [Definir el rootEl de una aplicación](#rootel)
    * [Definir la región principal de una aplicación](#application-main-region)
* [Definir regiones de una aplicación](#regions)
* [Definir layout de una aplicación](#layout)
* [Definir child applications de una aplicación](#child-applications)
* [Application channels](#Channels)

##Application DOM

###rootEl


Todas las `Jskeleton.Application` **tienen** que tener un DOM raíz, donde se definirá la región raíz/principal de la aplicación y donde se pintará el layout de la aplicación (si se ha definido).

Para definir el root raíz de una aplicación, basta con definirlo en la clase o en la instanciación:

    {% highlight javascript %}

    var ExampleApp = Jskeleton.Application.extend({
        rootEl: 'body'
    });

var ExampleApp = Jskeleton.Application.extend({});
var app = new ExampleApp({rootEl: 'body'});

    {% endhighlight %}

###Application main region

Todas las `Jskeleton.Application` tienen una región raíz/principal (por defecto, 'root'). Esta región es la que se le pasará a las child applications si no se les especifica ninguna región. Para definir una región principal:


    {% highlight javascript %}
    var ExampleApp = Jskeleton.Application.extend({
        rootRegion: 'main'
    });
    {% endhighlight %}

##Regions

Cada aplicación puede definir regiones de forma declarativa o de forma dinámica:

    {% highlight javascript %}

        //Declarative Way
var ExampleApp = Jskeleton.Application.extend({
    regions: {
        main: 'body',
        someRegion: '.dom-selector'
    }
});

//Dynamic Way
var app = new Jskeleton.Application();
app.addRegion({contentRegion: 'body'});

    {% endhighlight %}

##Layout

Una aplicación también puede añadir regiones a través de su layout. Estas regiones se expondrán directamente a la aplicación y se destruirán cuando ésta se destruya.

{% highlight javascript %}
var Layout = Jskeleton.Layout.extend({
    regions: {
        anotherRegion: '.template-dom-selector'
    }
});

var ExampleApp = Jskeleton.Application.extend({
    layout: {
        template: '<div class="header"></div><div class="content"></div>',
        class: Layout
    }
});
{% endhighlight %}

##Child Applications

 Una aplicación puede tener múltiples `Jskeleton.ChildApplication`:

    {% highlight javascript %}
    var ExampleApp = Jskeleton.Application.extend({
        applications: {
            'bookCatalogue': {
                application: 'BookCatalogue',
                region: 'main'
            },
            'chat': {
                application: 'ChatApplication',
                region: 'aside'
            }
        }
    });
    {% endhighlight %}

Cuando una aplicación define aplicaciones hijas, éstas se instanciarán y "arrancarán" automáticamente cuando se llame explícitamente a la función _start()_.

    {% highlight javascript %}
    var app = new ExampleApp();
app.start(); //explicit start (the child applications will be started to)
    {% endhighlight %}

Para obligar a que una aplicación hija deba de ser arrancada de forma explícita, se puede añadir la opción `startWithParent: false` (por defecto, _true_). De este modo, la aplicación hija no será arrancada por su aplicación padre.

    {% highlight javascript %}
    var ExampleApp = Jskeleton.Application.extend({
        applications: {
            'bookCatalogue': {
                application: 'BookCatalogue',
                region: 'main',
                startWithParent: false
            },
            'chat': {
                application: 'ChatApplication',
                region: 'aside'
            }
        }
    });

app.start(); //explicit start (the child application chat will be started to but bookCatalogue child application will not)
    {% endhighlight %}

A su vez, es posible añadir aplicaciones bajo demanda. Por defecto, esta nueva aplicación se iniciará al añadirse, a no ser que tenga flag `startWithParent: false`, que habrá que arrancarla de forma explícita.

    {% highlight javascript %}

    var app = new ExampleApp();

var ChildApp = Jskeleton.ChildApplication.extend({});

app.addApplication({application: ChildApp, region: 'main', startWithParent: false});
    {% endhighlight %}


##Channels

Cada aplicación dispone de dos canales de comunicación:

-**Canal privado**:
    Canal para comunicar **componentes** dentro de una aplicación sin afectar a otras aplicaciones.

-**Canal global**:
    Canal para comunicar **aplicaciones** entre sí.

A continuación, se muestra un ejemplo de uso de los canales.

    {% highlight javascript %}
    var app = new ExampleApp();
//Using each channel
app.privateChannel.trigger();
app.globalChannel.trigger();

    {% endhighlight %}


##Routes

Cada aplicación, ya sea `Jskeleton.Application` como `Jskeleton.ChildApplication`, define sus rutas y estados.

    {% highlight javascript %}
    var ExampleApp = Jskeleton.ChildApplication.extend({
        routes: {
            'my/backbone/route': {
                'template': '<div></div>'
            },
            'backbone/route/:with/:params': {
                viewController: ViewControllerClass,
                'template': '<div></div>'
            }
        }
    });
    {% endhighlight %}


Las rutas y eventos de una aplicación no se inician hasta que no se hace un _start()_ de la misma.

Es posible especificar un `Jskeleton.ViewController` para cada ruta. Si no se define ningún `Jskeleton.ViewController`, se inyectará uno por defecto usando el template de la ruta. Es recomendable el uso de _jskeleton dependency injection_ para definir dependencias.

    {% highlight javascript %}
    var ExampleApp = Jskeleton.ChildApplication.extend({
        routes: {
            'my/backbone/route': {
                'template': '<div></div>'
                viewController: ViewControllerClass
            }
        }
    });
    {% endhighlight %}

El `Jskeleton.ViewController` es _renderizado_ en la región definida para la aplicación. En el caso de tratarse de una `Jskeleton.Application`, el `Jskeleton.ViewController` se renderizará en la región principal para esa aplicación.

Si se trata de una `Jskeleton.ChildApplication` se renderizará en la región de la aplicación padre que nosotros le hayamos especificado al declararla como aplicación hija.

Para cada ruta podemos definir el evento de navegación que va a provocar esa ruta. De este modo, cuándo otra aplicación lance dicho evento a nivel global, nuestra aplicación lo procesará como si de una ruta se tratase. Ésto conllevará el renderizado del `Jskeleton.ViewController` (con el template y la región especificada) y la actualización de la ruta de forma automática (mapeando los parámetros que recibimos a través del evento con los parametros que se han definido en la ruta).

    {% highlight javascript %}
    var ExampleApp = Jskeleton.ChildApplication.extend({
        routes: {
            'backbone/route/:with/:params': {
                'template': '<div></div>'
                viewController: ViewControllerClass,
                eventListener: 'backbone:navigate:event'
            }
        }
    });

    var app = new ExampleApp();
    app.start();

    anotherApp.globalChannel.trigger('backbone:navigate:event',{
        with: 'ejemplo',
        params: '15'
    });

    //La aplicación ExampleApp procesaría el evento como si de una ruta se tratase, y actualizaría la ruta del navegador con los parámetros obtenidos del evento:
    // 'backbone/route/ejemplo/15'
    {% endhighlight %}


