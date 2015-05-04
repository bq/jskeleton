---
layout: component
title:  "Paginator"
---

Paginator is a type of navigation that lets users navigate through related pages.

##paginator inline
{% include components/paginator/paginator-inline.html %}

{% highlight html %}
<ul class="paginator paginator--inline">
    <li class="paginator__item">
        <a href="#" class="paginator__link">First</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Previous</a>
    </li>
    <li class="paginator__item paginator__item--selected">
        <a href="#" class="paginator__link">1</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">2</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">3</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">4</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Next</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Last</a>
    </li>
</ul>
{% endhighlight %}


##paginator bar
{% include components/paginator/paginator-bar.html %}

{% highlight html %}
<ul class="paginator paginator--bar">
    <li class="paginator__item">
        <a href="#" class="paginator__link">First</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Previous</a>
    </li>
    <li class="paginator__item paginator__item--selected">
        <a href="#" class="paginator__link">1</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">2</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">3</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">4</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Next</a>
    </li>
    <li class="paginator__item">
        <a href="#" class="paginator__link">Last</a>
    </li>
</ul>
{% endhighlight %}


##how to use

| Class modifier     | Description           |
|--------------------|-----------------------|
| .paginator--inline | Places items in-line. |
| .paginator--bar    | Places items in bar.  |


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
.paginator {
    // Common styles

    @include to(c) {
        @include paginator--bar;
    }

    @include from(d) {
        @include paginator--inline;
    }

}
{% endhighlight %}


Default media query:

{% highlight scss %}
.paginator {
    //Common styles

    @media (max-width: 799px) {
        @include paginator--bar;
    }

    @media (min-width: 800px) {
        @include paginator--inline;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.paginator {
    @include paginator--bar;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom paginator

You can create your own custom paginator.

{% highlight scss %}
.paginator--custom {
    @include paginator--inline;
    // Custom styles
}
{% endhighlight %}
