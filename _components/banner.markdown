---
layout: component
title:  "Banner"
---

A banner show an image or group of them.

##simple banner
{% include components/banner/banner-simple.html %}

{% highlight html %}
<section class="banner">
    <h1 class="invisible">Banner title</h1>
    <p class="banner__content">
        <a class="banner__content__link" href="url">
            <img src="url" alt="Alternative text">
        </a>
    </p>
</section>
{% endhighlight %}





##banners group
{% include components/banner/banner-group.html %}

{% highlight html %}
<section class="banner">
    <h1 class="invisible">Banners</h1>
    <ul class="banner__content">
        <li class="banner__content__item">
            <a class="banner__content__link" href="#">
                <img src="url" alt="Alternative text">
            </a>
        </li>
        <li class="banner__content__item">
            <a class="banner__content__link" href="#">
                <img src="url" alt="Alternative text">
            </a>
        </li>
        <li class="banner__content__item">
            <a class="banner__content__link" href="#">
                <img src="url" alt="Alternative text">
            </a>
        </li>
        <li class="banner__content__item">
            <a class="banner__content__link" href="#">
                <img src="url" alt="Alternative text">
            </a>
        </li>
        <li class="banner__content__item">
            <a class="banner__content__link" href="#">
                <img src="url" alt="Alternative text">
            </a>
        </li>
    </ul>
</section>
{% endhighlight %}


##responsive

You can get more info about $slicer-breakpoints and $slicer-breakpoint-names in [grid components section](../grid/).

{% highlight scss %}
// Breakpoints
$slicer-breakpoints       : 0   400px   600px   800px   1050px;
$slicer-breakpoint-names  :  'a'     'b'     'c'     'd'      'e';
{% endhighlight %}



> To use this component in a responsive project you have different options:

[Breakpoint-slicer](https://github.com/lolmaus/breakpoint-slicer):
{% highlight scss %}
.banner {
    // Common styles

    @include to(c) {
        @include banner--stacked;
    }

}
{% endhighlight %}


Default media query:

{% highlight scss %}
.banner {
    //Common styles

    @media (max-width: 799px) {
        @include banner--stacked;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.banner {
    @include banner--stacked;

    @mixin media-minwidth(d) {
    	// Custom styles
    }
}
{% endhighlight %}

##custom banner

You can create your own custom banner.

{% highlight scss %}
.banner--custom {
    @include banner--stacked;
    // Custom styles
}
{% endhighlight %}
