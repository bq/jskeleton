---
layout: api
title:  "Service"
submenu:
  - Definition: "#definition"
---

##Definition

Las `JSkeleton.Applications` van a usar `JSkeleton.Services` para comunicarse con entidades externas. Para ello es necesario dar de alta en la factoría al nuevo servicio.

{% highlight javascript %}

Jskeleton.Service.factory('ServiceExample', {
    initialize: function() {
        console.log('Service Init');
    },
    actionService: function(args) {
    }
});
{% endhighlight %}

Una `JSkeleton.Application` hará uso de este `JSkeleton.Service` a través de su `JSkeleton.ViewController`

{% highlight javascript %}

Jskeleton.ViewController.factory('DetalleDeLibro', function(ServiceExample, _channel) {
    return {
        template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
        events: {
            'action @component.DetailBookView': 'onActionClicked'
        },
        onActionClicked: function(libro) {
            ServicioDeCompras.actionService(args);
        }
    };
});
{% endhighlight %}