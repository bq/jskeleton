---
layout: component
title:  "Breadcrumb"
---

A breadcrumb display the current page's location within a navigation trail.

##simple breadcrumb
{% include components/breadcrumb/breadcrumb-simple.html %}

{% highlight html %}
<nav class="breadcrumb" role="navigation">
    <h1 class="invisible">Breadcrumb title</h1>
    <ol class="breadcrumb__menu" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
        <li class="breadcrumb__menu__item" itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            <a class="breadcrumb__menu__link" itemprop="url" href="url">
                <span itemprop="title">Home</span>
            </a>
        </li>
        <li class="breadcrumb__menu__item" itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            <a class="breadcrumb__menu__link" itemprop="url" href="url">
                <span itemprop="title">Category</span>
            </a>
        </li>
        <li class="breadcrumb__menu__item" itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            <a class="breadcrumb__menu__link" itemprop="url" href="url">
                <span itemprop="title">Page</span>
            </a>
        </li>
    </ol>
</nav>
{% endhighlight %}