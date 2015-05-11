---
layout: guide
title:  "Getting Started"
aside_order: 1
---

Lo primero que debes hacer para empezar a crear aplicaciones con Jskeleton es descargarlo e instalarlo.

La forma mas sencilla de hacerlo es con el [generador de Yeoman](https://github.com/bq/generator-jskeleton). Debes instalar `yeoman`, `grunt-cli`, `bower` y `generator-jskeleton`:

{% highlight bash %}
$  npm install -g grunt-cli bower yo generator-jskeleton
{% endhighlight %}

Crea un nuevo directorio para tu aplicación:

{% highlight bash %}
mkdir my-new-project && cd $_
{% endhighlight %}

Ejecuta el generador de yeoman con el nombre de tu aplicación:

{% highlight bash %}
yo jskeleton [app-name]
{% endhighlight %}
