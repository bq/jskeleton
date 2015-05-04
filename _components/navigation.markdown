---
layout: component
title:  "Navigation"
---

Contains links to other sections of the website.

##nav inline
{% include components/nav/nav-inline.html %}

{% highlight html %}
<nav class="nav nav--inline" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item nav__menu__item--selected">
            <a href="#" class="nav__menu__link">Item 1</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 2</a>
        </li>
        <li class="nav__menu__item nav__menu__item--lead">
            <a href="#" class="nav__menu__link">Item 3</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 4</a>
        </li>
    </ul>
</nav>
{% endhighlight %}


##nav inline dropdown
{% include components/nav/nav-inline-dropdown.html %}

{% highlight html %}
<nav class="nav nav--inline" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item dropdown">
            <a href="#menu11" class="nav__menu__link" data-rel="dropdown">Item 1</a>
            <ul id="menu11" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown">
            <a href="#menu12" class="nav__menu__link" data-rel="dropdown">Item 2</a>
            <ul id="menu12" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown">
            <a href="#menu13" class="nav__menu__link" data-rel="dropdown">Item 3</a>
            <ul id="menu13" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown">
            <a href="#menu14" class="nav__menu__link" data-rel="dropdown">Item 4</a>
            <ul id="menu14" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
    </ul>
</nav>
{% endhighlight %}


##nav bar
{% include components/nav/nav-bar.html %}

{% highlight html %}
<nav class="nav nav--bar" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item nav__menu__item--selected">
            <a href="#" class="nav__menu__link">Item 1</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 2</a>
        </li>
        <li class="nav__menu__item nav__menu__item--lead">
            <a href="#" class="nav__menu__link">Item 3</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 4</a>
        </li>
    </ul>
</nav>
{% endhighlight %}


##nav fluid
{% include components/nav/nav-fluid.html %}

{% highlight html %}
<nav class="nav nav--fluid" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item nav__menu__item--selected">
            <a href="#" class="nav__menu__link">Item 1</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 2</a>
        </li>
        <li class="nav__menu__item nav__menu__item--lead">
            <a href="#" class="nav__menu__link">Item 3</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 4</a>
        </li>
    </ul>
</nav>
{% endhighlight %}


##nav bar dropdown
{% include components/nav/nav-bar-dropdown.html %}

{% highlight html %}
<div class="penguin-example">
    <nav class="nav nav--bar" role="navigation">
        <h1 class="invisible">Navigation</h1>
        <ul class="nav__menu">
            <li class="nav__menu__item dropdown">
                <a href="#menu1" class="nav__menu__link" data-rel="dropdown">Item 1</a>
                <ul id="menu1" class="nav__submenu" role="menu" data-dropdown="">
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 1</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 2</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 3</a>
                    </li>
                </ul>
            </li>
            <li class="nav__menu__item dropdown">
                <a href="#menu2" class="nav__menu__link" data-rel="dropdown">Item 2</a>
                <ul id="menu2" class="nav__submenu" role="menu" data-dropdown="">
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 1</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 2</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 3</a>
                    </li>
                </ul>
            </li>
            <li class="nav__menu__item dropdown">
                <a href="#menu3" class="nav__menu__link" data-rel="dropdown">Item 3</a>
                <ul id="menu3" class="nav__submenu" role="menu" data-dropdown="">
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 1</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 2</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 3</a>
                    </li>
                </ul>
            </li>
            <li class="nav__menu__item dropdown">
                <a href="#menu4" class="nav__menu__link" data-rel="dropdown">Item 4</a>
                <ul id="menu4" class="nav__submenu" role="menu" data-dropdown="">
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 1</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 2</a>
                    </li>
                    <li class="nav__submenu__item">
                        <a href="#" class="nav__submenu__link">Item 3</a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</div>
{% endhighlight %}


## nav stacked
{% include components/nav/nav-stacked.html %}

{% highlight html %}
<nav class="nav nav--stacked" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item nav__menu__item--selected">
            <a href="#" class="nav__menu__link">Item 1</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 2</a>
        </li>
        <li class="nav__menu__item nav__menu__item--lead">
            <a href="#" class="nav__menu__link">Item 3</a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">Item 4</a>
        </li>
    </ul>
</nav>
{% endhighlight %}


##nav stacked dropdown
{% include components/nav/nav-stacked-dropdown.html %}

{% highlight html %}
<nav class="nav nav--stacked" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item dropdown dropdown--stacked">
            <a href="#menu41" class="nav__menu__link" data-rel="dropdown">Item 1</a>
            <ul id="menu41" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown dropdown--stacked">
            <a href="#menu42" class="nav__menu__link" data-rel="dropdown">Item 2</a>
            <ul id="menu42" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown dropdown--stacked">
            <a href="#menu43" class="nav__menu__link" data-rel="dropdown">Item 3</a>
            <ul id="menu43" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
        <li class="nav__menu__item dropdown dropdown--stacked">
            <a href="#menu44" class="nav__menu__link" data-rel="dropdown">Item 4</a>
            <ul id="menu44" class="nav__submenu" role="menu" data-dropdown="">
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 1</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 2</a>
                </li>
                <li class="nav__submenu__item">
                    <a href="#" class="nav__submenu__link">Item 3</a>
                </li>
            </ul>
        </li>
    </ul>
</nav>
{% endhighlight %}


## nav bar with icons
{% include components/nav/nav-bar-icon.html %}

{% highlight html %}
<nav class="nav nav--bar" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item nav__menu__item--selected">
            <a href="#" class="nav__menu__link">
                <span class="icon-text">
                    <i class="icon">*Your icon here*</i>Item 1
                </span>
            </a>
        </li>
    <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">
                <span class="icon-text">
                    <i class="icon">*Your icon here*</i>Item 2
                </span>
            </a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">
                <span class="icon-text">
                    <i class="icon">*Your icon here*</i>Item 3
                </span>
            </a>
        </li>
        <li class="nav__menu__item">
            <a href="#" class="nav__menu__link">
                <span class="icon-text">
                    <i class="icon">*Your icon here*</i>Item 4
                </span>
            </a>
        </li>
    </ul>
</nav>
{% endhighlight %}

##how to use

| Class modifier | Description                  |
|----------------|------------------------------|
| .nav--inline   | Places items in-line.        |
| .nav--bar      | Places items in bar.         |
| .nav--stacked  | Places items in stacked.     |
| .nav--fluid    | Places nav with fluid width. |


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
.nav {
    // Common styles

    @include to(c) {
        @include nav--bar;
    }

    @include from(d) {
        @include nav--stacked;
    }

}
{% endhighlight %}


Default media query:
{% highlight scss %}
.nav {
    //Common styles

    @media (max-width: 799px) {
        @include nav--bar;
    }

    @media (min-width: 800px) {
        @include nav--stacked;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.nav {
    @include nav--bar;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom nav

You can create your own custom nav.

{% highlight scss %}
.nav--custom {
    @include nav--inline;
    // Custom styles
}
{% endhighlight %}