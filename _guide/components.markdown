---
layout: guide
title:  "Component"
aside_order: 2
submenu:
  - Definition: "#definition"
  - Component.ViewController: "#component.viewController"
  - Component.Channel: "#component.channel"
---

##Definición

Los componentes son objetos diseñados para encapsular lógica de UI. Estos te permiten mantener separada la lógica de negocio de la aplicación de la lógica 'visual'.

Un componente puede ser definido como un `Jskeleton.ItemView`, `Jskeleton.CollectionView`, `Jskeleton.CompositeView` o `Jskeleton.Layout` o como cualquier clase que herede de las clases anteriormente citadas y que soporten un "proceso" de renderizado que genere html.

##Uso

Para usar un componente, basta con definirlo dentro de un template con el helper `@component` seguido del nombre del componente.

{% highlight html %}

    { { @component 'ViewComponent' model=context.model } }

{% endhighlight %}

También se puede especificar el nombre del componente con el argumento name:


{% highlight html %}

    { { @component name='ViewComponent' model=context.model } }

{% endhighlight %}


##Factoria

El nombre del componente es el nombre con el que se ha dado de alta en la `Jskeleton.factory`.

Para dar de alta un nuevo componente en la Factoria se puede hacer uso del método factory disponible para todos los componentes:

{% highlight javascript %}
 
    Jskeleton.ItemView.factory('ViewComponent', {
        template: template,
        model: model,
        events: {
            'click @ui.button': 'onActionButton',
        },
        onActionButton: function() {}
    });

{% endhighlight %}

O también se puede añadir el componente invocando manualmente al método add de `Jskeleton.factory` añadiendo la clase y su correspondiente clave.

{% highlight javascript %}
 
    var ItemView = Jskeleton.ItemView.extend(, {
        template: template,
        model: model,
        events: {
            'click @ui.button': 'onActionButton',
        },
        onActionButton: function() {}
    });

    Jskeleton.factory.add('ViewComponent',ItemView);

{% endhighlight %}

##Atributos de componentes

Se le pueden pasar todos los argumentos que se quieran a los componentes poniendo el nombre del argumento y su valor correspondiente:

{% highlight html %}

    <!--First Component receives a model-->
    { { @component name='ViewComponent' model=context.model } }

    <!--Second Component receives a collection-->
    { {@component name='ViewComponent' collection=context.collection miParametro="argumentoCualquiera"} }

{% endhighlight %}

Estos parametros se le pasarán al componente en el constructor como opciones en forma de clave valor.

##Dependencias

Un componente puede definir dependencias en su implementación como cualquier otra clase Jskeleton.

Para ello hay que definir sus propiedades como una función con las dependencias que el componente necesite:

{% highlight javascript %}
 
    Jskeleton.ItemView.factory('ViewComponent', function(dependency1, dependency2){
       return {
            template: template,
            model: model,
            events: {
                'click @ui.button': 'onActionButton',
            },
            onActionButton: function() {
                dependency.doSomething();
            }
        }
    });

{% endhighlight %}

Estas dependencias se resolveran cuándo se instancie el componente.

A continuación, se define un componente _ViewComponent_ de tipo de `Jskeleton.ItemView`. Este componente será renderizado por la ChildApplication cuando escuche la ruta _home_.

{% highlight javascript %}

    //Itemview Component
    Jskeleton.ItemView.factory('ViewComponent', {
        template: template,
        model: model,
        events: {
            'click @ui.button': 'onActionButton',
        },
        onActionButton: function() {}
    });

    //ViewController Component
    Jskeleton.ViewController.factory('ViewControllerComponent', {
        context: {
            model: 'modelComponent'
        }
    });

    //Child Application that renders a component
    Jskeleton.ChildApplication.factory('ChildApp', {
        routes: {
            'home': {
                viewControllerClass: ViewControllerComponent,
                template: "{ {@component name='ViewComponent' model=context.model}}"
            }
        }
    });

{% endhighlight %}

Dado a que todo componente es de tipo `Jskeleton.ItemView`, `Jskeleton.CollectionView` o `Jskeleton.CompositeView`. Podrá manejar los eventos que se produzcan en su vista como si fuera una vista cualquiera de `Marionette`.

##Component.Channel
Un componente posee un canal `this.channel` de comunicación directa con su aplicación. Este canal permite modificar el estado o ruta de su aplicación.

{% highlight javascript %}
Jskeleton.ItemView.factory('ViewComponent', {
    events: {
        'click @ui.button': 'onActionButton',
    },
    onActionButton: function() {
        this.channel.trigger('come:back');
    }
});

Jskeleton.ChildApplication.factory('ChildApp', {
    routes: {
        'profile': {
            viewControllerClass: ViewControllerComponent,
            template: "{ {@component name='ViewListComponent' collection=context.collection}}",
            eventListener: 'come:back'
        }
    }
});
{% endhighlight %}