---
layout: api
title:  "Service"
submenu:
  - Definition: "#definition"
---

##Definition

Los `JSkeleton.Services` son objetos que van a permitir que las `JSkeleton.Applications` se comuniquen con entidades externas. Para ello es necesario dar de alta en la factoría al nuevo servicio.

{% highlight javascript %}

Jskeleton.Service.factory('ServiceExample', {
    initialize: function() {
        console.log('Service Init');
    },
    actionService: function(args) {
    }
});
{% endhighlight %}

En este nuevo `JSkeleton.Service` se define la interfaz de comunicación con entidades externas. Esa interfaz será usada por las `JSkeleton.Application` a través de su `JSkeleton.ViewController`

{% highlight javascript %}

Jskeleton.ViewController.factory('DetalleDeLibro', function(ServiceExample, _channel) {
    return {
        template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
        events: {
            'action @component.DetailBookView': 'onActionClicked'
        },
        onActionClicked: function(args) {
            ServicioDeCompras.actionService(args);
        }
    };
});
{% endhighlight %}