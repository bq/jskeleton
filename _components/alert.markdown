---
layout: component
title:  "Alert"
---

Alert is a feedback message for the user. This alert can be a success, error, warning or info message.

##simple alert
{% include components/alert/alert-simple.html %}

{% highlight html %}
<div class="alert alert--success" role="alert" data-alert>
    <div class="alert__content">
        <strong>Well done!</strong> You successfully read this important alert message.
    </div>
</div>
<div class="alert alert--error" role="alert" data-alert>
    <div class="alert__content">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
    </div>
</div>
<div class="alert alert--info" role="alert" data-alert>
    <div class="alert__content">
        <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
    </div>
</div>
<div class="alert alert--warning" role="alert" data-alert>
    <div class="alert__content">
        <strong>Warning!</strong> Better check yourself, you're not looking too good.
    </div>
</div>
{% endhighlight %}





##alert inline with align
{% include components/alert/alert-inline.html %}

{% highlight html %}
<div class="alert alert--success alert--inline" role="alert" data-alert="">
    <div class="alert__content">
        <strong>Well done!</strong> You successfully read this important alert message.
    </div>
</div>

<div class="alert alert--error alert--inline alert--center" role="alert" data-alert="">
    <div class="alert__content">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
    </div>
</div>

<div class="alert alert--info alert--inline alert--right" role="alert" data-alert="">
    <div class="alert__content">
        <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
    </div>
</div>
{% endhighlight %}





##closeable alert
{% include components/alert/alert-closeable.html %}

{% highlight html %}
<div class="alert alert--modifier" role="alert" data-alert>
    <div class="alert__content">
        Alert content
        <button type="button" title="Close" data-close="alert" class="alert__close" aria-label="Close">
            <i class="icon icon--invert" aria-hidden="true">*Your icon here*</i>
            <span class="invisible">Close text</span>
        </button>
    </div>
</div>
{% endhighlight %}


##how to use

| Class modifier                                             | Description                           |
|------------------------------------------------------------|---------------------------------------|
| .alert--success .alert--info .alert--warning .alert--error | Styles for each type of alerts.       |
| .alert--inline                                             | Places alert inline with fluid width. |
| .alert--inline alert--center                               | Centers the alert.                    |
| .alert--inline alert--right                                | Align to right the alert.             |
| .alert--top                                                | Places alert on the parent's top      |


> Add [data-alert] attribute to element and [data-close="alert"] to your close button to automatically give an alert close functionality.

{% highlight js %}
// Initialize
var $alert = $('target').alert();

// Closes an alert by removing it from the DOM
$alert.hide();
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
.alert {
    // Common styles

    @include to(c) {
        @include alert--top;
    }

    @include from(d) {
        @include alert--inline;
    }

}
{% endhighlight %}


Default media query:

{% highlight scss %}
.alert {
    //Common styles

    @media (max-width: 799px) {
        @include alert--top;
    }

    @media (min-width: 800px) {
        @include alert--inline;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.alert {
    @include alert--inline;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom alert

You can create your own custom alert.

{% highlight scss %}
.alert--custom {
    @include alert--inline;
    // Custom styles
}
{% endhighlight %}
