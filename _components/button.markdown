---
layout: component
title:  "Button"
---

Usually a button indicates a user action.

##simple button
{% include components/button/button-simple.html %}

{% highlight html %}
<button class="btn btn--primary">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--disabled">Disabled</button>
<button class="btn btn--custom-name">Custom button</button>
{% endhighlight %}


##fluid button
{% include components/button/button-fluid.html %}

{% highlight html %}
<button class="btn btn--primary btn--fluid">Fluid</button>
{% endhighlight %}


##buttons group
{% include components/button/button-group.html %}

{% highlight html %}
<ul class="btn-group">
    <li class="btn-group__item">
         <button class="btn">Button</button>
    </li>
    <li class="btn-group__item">
         <button class="btn">Button</button>
    </li>
    <li class="btn-group__item">
         <button class="btn btn--disabled">Disabled</button>
    </li>
</ul>
{% endhighlight %}

##fluid buttons group
{% include components/button/button-group-fluid.html %}

{% highlight html %}
<ul class="btn-group btn-group--fluid">
    <li class="btn-group__item">
         <button class="btn">Button</button>
    </li>
    <li class="btn-group__item">
         <button class="btn">Button</button>
    </li>
    <li class="btn-group__item">
         <button class="btn btn--disabled">Disabled</button>
    </li>
</ul>
{% endhighlight %}

##text &amp; icon buttons
{% include components/button/button-icon.html %}

{% highlight html %}
<ul class="btn-group">
    <li class="btn-group__item">
        <button class="btn btn--modifier">
            <span class="icon-text">
                <i class="icon" aria-hidden="true">*Your icon here*</i>Button 1
            </span>
        </button>
    </li>
    <li class="btn-group__item">
        <button class="btn btn--modifier">
            <span class="icon-text">
                <i class="icon" aria-hidden="true">*Your icon here*</i>Button 2
            </span>
        </button>
    </li>
</ul>
{% endhighlight %}

##just icon buttons
{% include components/button/button-just-icon.html %}

{% highlight html %}
<ul class="btn-group">
    <li class="btn-group__item">
        <button class="btn btn--modifier btn--icon">
            <i class="icon" aria-hidden="true">*Your icon here*</i>
            <span class="invisible">text</span>
        </button>
    </li>
    <li class="btn-group__item">
        <button class="btn btn--modifier btn--icon">
            <i class="icon" aria-hidden="true">*Your icon here*</i>
            <span class="invisible">text</span>
        </button>
    </li>
</ul>
{% endhighlight %}

##How to use

| Modifier class    | Description                      |
|-------------------|----------------------------------|
| .btn--primary     | Adds primary styles.             |
| .btn--secondary   | Adds secondary styles.           |
| .btn--disabled    | Adds styles to disabled buttons. |
| .btn--custom-name | Any name for your custom button. |


##Sass mixins

You can create your own buttons using our Sass mixins:

{% highlight scss %}
@mixin button($color, $background, $border, $border-color) {
    color: $color;
    background-color: $background;
    @if $border != none {
        border: $border $border-color;
    }
}

@mixin button-events($color-hover, $background-hover, $border-color-hover, $background-active) {
    &:hover,
    &:focus {
        color: $color-hover;
        background-color: $background-hover;
        text-decoration: $button-text-decoration;
        @if $border-color-hover != none {
            border-color: $border-color-hover;
        }
    }
    &:active {
        background-color: $background-active;
    }
}
{% endhighlight %}

###example

{% highlight scss %}
.btn--penguin {
    @include button(#fff, #000, 1px solid, #FA8500);
    @include button-events(#fff, #333, #FFA947, #000);
}
{% endhighlight %}

