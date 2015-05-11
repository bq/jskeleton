---
layout: guide
title:  "Getting Started"
aside_order: 1
---

Lo primero que debemos hacer para empezar a crear aplicaciones con Jskeleton es descargarlo e instalarlo.

La manera mas sencilla es utilizando [el generador de Yeoman](https://github.com/bq/generator-jskeleton). Primero, debes instalar `yeoman`, `grunt-cli`, `bower` y `generator-jskeleton`:

{% highlight bash %}
$ npm install -g grunt-cli bower yo generator-jskeleton
{% endhighlight %}

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

Vamos a comprobar que todo está OK... Inicia el servidor:

{% highlight bash %}
$ grunt serve
{% endhighlight %}

Si abres tu navegador favorito con la url: [http://127.0.0.1:8080](http://127.0.0.1:8080/) deberías ver ????????????

Ya está! Tu nueva aplicación está lista para comenzar a crear sobre ella con Jskeleton!



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
