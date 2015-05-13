---
layout: api
title:  "Component"
submenu:
  - Definition: "#definition"
  - Component.ViewController: "#component.viewController"
  - Component.Channel: "#component.channel"
---

##Definition
Un componente puede ser definido como: `Jskeleton.ItemView`, `Jskeleton.CollectionView` o `Jskeleton.CompositeView`. Se inyectará en el template a través del helper `@component`. La manera de definir este componente es:

{% highlight html %}
<!--First Component receives a model-->
{ {@component name='ViewComponent' model=context.model}}

<!--Second Component receives a collection-->
{ {@component name='ViewComponent' collection=context.collection}}
{% endhighlight %}

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

##Component.ViewController

Aquellos eventos lanzados por el componente con _this.trigger_ podrán ser escuchados por su `Jskeleton.ViewController`. Para ello se recogerá este evento como '_eventName_ @component._componentName_' desde el propio ViewController.

{% highlight javascript %}
Jskeleton.ItemView.factory('ViewComponent', {
	events: {
	    'click @ui.button': 'onActionButton',
	},
	onActionButton: function() {
		this.trigger('action:component');
	}
});

Jskeleton.ViewController.factory('ViewControllerComponent', {
    events: {
        'action:component @component.ViewComponent': 'onEventComponent'
    },
    onEventComponent: function() {}
});
{% endhighlight %}

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