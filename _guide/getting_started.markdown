---
layout: guide
title:  "Getting Started"
aside_order: 1
---
#Primeros pasos

Poner a punto un proyecto Jskeleton para el desarrollo es realmente sencillo, simplemente basta con seguir las siguientes indicaciones:

##Obtener Jskeleton

Jskeleton está disponible como paquete bower y como paquete npm.

###Bower:

    {% highlight javascript %}

        bower install jskeleton --save

    {% endhighlight %}


###Npm:

    {% highlight javascript %}

        npm install jskeleton --save
        
    {% endhighlight %}

##Jskeleton generator

Existe un generador de Yeoman para Jskeleton [generator-jskeleton](https://github.com/bq/generator-jskeleton). Primero, debes instalar `yeoman`, `grunt-cli`, `bower` y `generator-jskeleton`:

{% highlight bash %}
$ npm install -g grunt-cli bower yo generator-jskeleton
{% endhighlight %}

El generador de jskeleton proporciona un esqueleto de aplicación e incluye una serie de buenas prácticas y el workflow necesario empezar el desarrollo de una aplicación incluyendo:

    -automatización
        -deploy
        -server y watch
    -testing
        -unitarios
        -funcionales

##Prepara el entorno

Crea un nuevo directorio para tu aplicación:

{% highlight bash %}
$ mkdir my-new-project && cd $_
{% endhighlight %}

Ejecuta el generador con el nombre de tu nueva aplicación:

{% highlight bash %}
$ yo jskeleton [app-name]
{% endhighlight %}

Por último, instala todas las dependencias de Jskeleton:

{% highlight bash %}
$ npm install && bower install
{% endhighlight %}

Para comprobar que todo está OK... Inicia el servidor:

{% highlight bash %}
$ grunt serve
{% endhighlight %}

Puedes abrir tu navegador favorito con la url: [http://127.0.0.1:8080](http://127.0.0.1:8080/) 

Ya está! Tu nueva aplicación está lista para ser desarrollada con Jskeleton!

##Empieza a desarrollar

<!---
First thing you should do to start creating apps with Jskeleton is download and install.

Easiest way to do that is throught [our Yeoman generator](https://github.com/bq/generator-jskeleton). First, you must install `yeoman`, `grunt-cli`, `bower` and `generator-jskeleton`:

{% highlight bash %}
$ npm install -g grunt-cli bower yo generator-jskeleton
{% endhighlight %}

Create a new folder to your app:

{% highlight bash %}
$ mkdir my-new-project && cd $_
{% endhighlight %}

Run the generator with your new app name:

{% highlight bash %}
$ yo jskeleton [app-name]
{% endhighlight %}

Now, install all Jskeleton dependecies:

{% highlight bash %}
$ npm install && bower install
{% endhighlight %}

Let's start our server to see if all it's ok:

{% highlight bash %}
$ grunt serve
{% endhighlight %}

You should see ????????????????

That's it!, you have your new app up and running and you are ready to build awesome things with Jskeleton!

--->
