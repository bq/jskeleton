---
layout: api
title:  "Application"
submenu:
  - Application.rootEl: "#root-el"
  - Application.rootRegion: "#application-main-region"
  - Application.regions: "#regions"
  - Application.applications: "#child-applications"
  - Application.channels: "#channels"
  - Application.layout: ""
---

 `JSkeleton.Application` es un contenedor donde almacenar y dividir en pequeñas partes la lógica de tu aplicación web, haciendola más rehusable, más desacoplada y más escalable.

*   [Application DOM](#application-dom)
    * [Definir el rootEl de una aplicación](#root-el)
    * [Definir la región principal de una aplicación](#application-main-region)
*   [Definir regiones de una aplicación](#regions)
*   [Definir child applications de una aplicación](#child-applications)
*   [Application channels](#Channels)

##Application DOM

###rootEl


Todas las `Jskeleton.Application` **tienen** que tener un dom raíz, donde se definira la región raíz/principal de la aplicación y donde se pintará el layout de la aplicación (si se ha definido).

Para definir el root raíz de una aplicación, basta con definirlo en la clase o en la instanciación:

    {% highlight javascript %}

    var ExampleApp = Jskeleton.Application.extend({
        rootEl: 'body'
    });


    var ExampleApp = Jskeleton.Application.extend({
    });

    var app = new ExampleApp({rootEl: 'body'});

    {% endhighlight %}

###Application main region

Todas las `Jskeleton.Application` tienen una región raíz/principal (por defecto 'root'). Esta región es la que se le pasará a las child applications si no se les especifica ninguna región. Para definir una región principal:


    {% highlight javascript %}
    var ExampleApp = Jskeleton.Application.extend({
        rootRegion: 'main'
    });
    {% endhighlight %}

##Regions

Cada aplicación puede definir regiones de forma declarativa:

    {% highlight javascript %}
        var ExampleApp = Jskeleton.Application.extend({
            regions: {
                main: 'body',
                someRegion: '.dom-selector'
            }
        });
    {% endhighlight %}


o de forma dinámica:

    {% highlight javascript %}
        var app = new Jskeleton.Application();

        app.addRegion({contentRegion: 'body'});
    {% endhighlight %}

Una aplicación también puede añadir regiones a partir de su layout:

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

Estas regiones se expondrán directamente a la aplicación y se destruirán cuando esta se destruya.

##Child applications

 Una aplicación puede tener multiples `Jskeleton.ChildApplication`.

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

Cuándo una aplicación define aplicaciones hijas,estas se instanciarán y "arrancaran" automaticamente cuando se llame explicitamente al método start.

    {% highlight javascript %}
    var app = new ExampleApp();

    app.start(); //explicit start (the child applications will be started to)
    {% endhighlight %}

Para arrancar una aplicación hija de forma explicita, se puede añadir la opcion `startWithParent: false`  (por defecto a true) para que la aplicación hija no sea arrancada con su aplicación padre.

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

Tambien se puede añadir aplicaciones bajo demanda:

    {% highlight javascript %}
    var app = new ExampleApp();

    var ChildApp = Jskeleton.ChildApplication.extend({

    });

    app.addApplication({application: ChildApp, region: 'main', startWithParent: false});
    {% endhighlight %}

Si la aplicación bajo demanda tiene el flag `startWithParent: false` (por defecto a true) la aplicación no va a arrancar automaticamente y habrá que arrancarla de forma explicita. En otro caso, la aplicación va a iniciarse nada más añadirse.


##Channels

Cada aplicación dispone de dos canales de comunicación:

-Canal privado:
    Canal para Comunicar componentes dentro de una aplicación sin afectar a otras aplicaciones.

-Canal global:
    Canal para Comunicar aplicaciones entre sí.

Uso de los canales:

    {% highlight javascript %}
    var app = new ExampleApp();

    app.privateChannel.trigger();
    app.globalChannel.trigger();

    {% endhighlight %}


##Routes

Cada aplicación define sus rutas y estados.

Tanto las `Jskeleton.Application`, como las `Jskeleton.ChildApplication` pueden definir rutas.

Para definir las rutas de una aplicación:

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

Jskeleton no empezará a escuchar las rutas y eventos de una aplicación hasta que esta no comienze (haga start). Si la ruta de una aplicación se dispara, Jskeleton se encarga de crear un view-controller (si no se ha definido se crea una clase por defecto automaticamente) e inyectar el template definido para esa ruta.

Para especificar un `Jskeleton.ViewController` solo hay que añadir la clase como opción de la ruta:

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


(Se recomienda el uso de **jskeleton dependency injection** para definir dependencias)

El view controller es **renderizado** en la región que se le ha definido a la aplicación.

Si se trata de una `Jskeleton.Application` se renderizará en la región principal que hayamos definido para esa aplicación.

Si se trata de una `Jskeleton.ChildApplication` se renderizará en la región de la aplicación padre que nosotros le hayamos especificado al declararla como aplicación hija.

Para cada ruta podemos definir el evento de navegación que va a provocar esa ruta, de tal forma que cuándo alguna otra aplicación lance dicho evento de navegación a nivel global, nuestra aplicación procese dicho evento como si de una ruta se tratase (renderizando el view controller con el template especificado y en la región de la aplicación) y actualizando la ruta de forma automática (mapeando los parametros que recibimos a través del evento con los parametros que se han definido en la ruta).

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

    //La aplicación ExampleApp procesaría el vento como si de una ruta se tratase, y actualizaria la ruta del navegador con los parametros obtenidos del evento:
    // 'backbone/route/ejemplo/15'
    {% endhighlight %}


