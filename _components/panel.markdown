---
layout: component
title:  "Panel"
---

Panel is used to wrap any content inside a box and  if you need you can add dropdown funcionality transform it to dropdown only add "panel--dropdown" class modifier.

##panel
{% include components/panel/panel-simple.html %}

{% highlight html %}
<section class="panel">
    <h1 class="panel__title">Panel title</h1>
    <div class="panel__content">Panel content</div>
</section>
{% endhighlight %}


##dropdown panel
{% include components/panel/panel-dropdown.html %}

{% highlight html %}
<section class="panel panel--dropdown">
    <div class="dropdown dropdown--stacked dropdown--selected" data-selected>
        <h1 class="panel__title">Panel title</h1>
        <a data-rel="dropdown" href="#content">
            <i class="icon">*Your icon here*</i>
        </a>
        <div id="content" class="panel__content" data-dropdown>Panel content</div>
    </div>
</section>
{% endhighlight %}