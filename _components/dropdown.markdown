---
layout: component
title:  "Dropdown"
---

A dropdown is used to show/hide additional content.

##single dropdown
{% include components/dropdown/dropdown-simple.html %}

{% highlight html %}
<div class="dropdown dropdown--modifier">
    <a href="#single_dropdown" class="dropdown__link" data-rel="dropdown">Item 1</a>
    <ul id="single_dropdown" class="dropdown__menu" role="menu" data-dropdown>
        <li class="dropdown__menu__item">
            <a href="#" class="dropdown__menu__link">Item 1</a>
        </li>
        <li class="dropdown__menu__item">
            <a href="#" class="dropdown__menu__link">Item 2</a>
        </li>
        <li class="dropdown__menu__item">
            <a href="#" class="dropdown__menu__link">Item 3</a>
        </li>
    </ul>
</div>
{% endhighlight %}


##icon dropdown
{% include components/dropdown/dropdown-icon.html %}

{% highlight html %}
<div class="penguin-example">
    <div class="dropdown">
        <a href="#icon_dropdown" class="dropdown__link" data-rel="dropdown">
            <span class="icon-text">
                <i class="icon" aria-hidden="true">*Your icon here*</i>Item 1
            </span>
        </a>
        <ul id="icon_dropdown" class="dropdown__menu" role="menu" data-dropdown>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 1</a>
            </li>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 2</a>
            </li>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 3</a>
            </li>
        </ul>
    </div>
</div>
{% endhighlight %}


##fluid dropdown
{% include components/dropdown/dropdown-fluid.html %}

{% highlight html %}
<div class="penguin-example">
    <div class="dropdown  dropdown--fluid">
        <a href="#menu211" class="dropdown__link" data-rel="dropdown">
            <span class="icon-text">
                <i class="icon" aria-hidden="true">*Your icon here*</i>Item 1
            </span>
        </a>
        <ul id="menu211" class="dropdown__menu" role="menu" data-dropdown>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 1</a>
            </li>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 2</a>
            </li>
            <li class="dropdown__menu__item">
                <a href="#" class="dropdown__menu__link">Item 3</a>
            </li>
        </ul>
    </div>
</div>
{% endhighlight %}


##dropdown menu
{% include components/dropdown/dropdown-menu.html %}

{% highlight html %}
<nav class="nav nav--inline" role="navigation">
    <h1 class="invisible">Navigation</h1>
    <ul class="nav__menu">
        <li class="nav__menu__item dropdown">
            <a href="#menu1" class="nav__menu__link" data-rel="dropdown">Item 1</a>
            <ul id="menu1" class="nav__submenu" role="menu" data-dropdown>
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
            <ul id="menu2" class="nav__submenu" role="menu" data-dropdown>
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
            <ul id="menu3" class="nav__submenu" role="menu" data-dropdown>
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
            <ul id="menu4" class="nav__submenu" role="menu" data-dropdown>
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

##How to use

> Just add [data-rel="dropdown"] to a link or any element with the [src] attribute and link to element who want toggles hidden it.
The dropdown plugin toggling the '.dropdown--selected' class and [data-selected] attribute on dropdown element.


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
.dropdown {
    // Common styles

    @include to(c) {
        @include dropdown--stacked;
    }

    @include from(d) {
        @include dropdown--fluid;
    }

}
{% endhighlight %}


Default media query:

{% highlight scss %}
.dropdown {
    //Common styles

    @media (max-width: 799px) {
        @include dropdown--stacked;
    }

    @media (min-width: 800px) {
        @include dropdown--fluid;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.dropdown {
    @include dropdown--stacked;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom dropdown

You can create your own custom dropdown.

{% highlight scss %}
.dropdown--custom {
    @include dropdown--fluid;
    // Custom styles
}
{% endhighlight %}
