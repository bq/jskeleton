---
layout: component
title:  "Tab"
---

Tabs help you organize and navigate multiple sections of content in a single container.

##tab inline
{% include components/tab/tab-inline.html %}

{% highlight html %}
<div class="tab tab--inline" data-tab>
    <ul class="tab__block" role="tablist">
        <li class="tab__block__item tab__block__item--selected" role="tab">
            <a href="#tab1-inline" class="tab__block__link">Tab 1</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab2-inline" class="tab__block__link">Tab 2</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab3-inline" class="tab__block__link">Tab 3</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab4-inline" class="tab__block__link">Tab 4</a>
        </li>
    </ul>
    <div class="tab__content">
        <div class="tab__content__item tab__content__item--selected" id="tab1-inline" role="tabpanel">Tab 1 content</div>
        <div class="tab__content__item" id="tab2-inline" role="tabpanel">Tab 2 content</div>
        <div class="tab__content__item" id="tab3-inline" role="tabpanel">Tab 3 content</div>
        <div class="tab__content__item" id="tab4-inline" role="tabpanel">Tab 4 content</div>
    </div>
</div>
{% endhighlight %}


##tab inline reverse
{% include components/tab/tab-inline-reverse.html %}

{% highlight html %}
<div class="tab tab--inline tab--reverse" data-tab>
    <ul class="tab__block" role="tablist">
        <li class="tab__block__item tab__block__item--selected" role="tab">
            <a href="#tab1-inline-reverse" class="tab__block__link">Tab 1</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab2-inline-reverse" class="tab__block__link">Tab 2</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab3-inline-reverse" class="tab__block__link">Tab 3</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab4-inline-reverse" class="tab__block__link">Tab 4</a>
        </li>
    </ul>
    <div class="tab__content">
        <div class="tab__content__item tab__content__item--selected" id="tab1-inline-reverse" role="tabpanel">Tab 1 content</div>
        <div class="tab__content__item" id="tab2-inline-reverse" role="tabpanel">Tab 2 content</div>
        <div class="tab__content__item" id="tab3-inline-reverse" role="tabpanel">Tab 3 content</div>
        <div class="tab__content__item" id="tab4-inline-reverse" role="tabpanel">Tab 4 content</div>
    </div>
</div>
{% endhighlight %}


##tab bar
{% include components/tab/tab-bar.html %}

{% highlight html %}
<div class="tab tab--bar" data-tab>
    <ul class="tab__block" role="tablist">
        <li class="tab__block__item tab__block__item--selected"  role="tab">
            <a href="#tab1-bar" class="tab__block__link">Tab 1</a>
        </li>
        <li class="tab__block__item"  role="tab">
            <a href="#tab2-bar" class="tab__block__link">Tab 2</a>
        </li>
        <li class="tab__block__item"  role="tab">
            <a href="#tab3-bar" class="tab__block__link">Tab 3</a>
        </li>
        <li class="tab__block__item"  role="tab">
            <a href="#tab4-bar" class="tab__block__link">Tab 4</a>
        </li>
    </ul>
    <div class="tab__content">
        <div class="tab__content__item tab__content__item--selected" id="tab1-bar" role="tabpanel">Tab 1 content</div>
        <div class="tab__content__item" id="tab2-bar" role="tabpanel">Tab 2 content</div>
        <div class="tab__content__item" id="tab3-bar" role="tabpanel">Tab 3 content</div>
        <div class="tab__content__item" id="tab4-bar" role="tabpanel">Tab 4 content</div>
    </div>
</div>
{% endhighlight %}


##tab stacked
{% include components/tab/tab-stacked.html %}

{% highlight html %}
<div class="tab tab--stacked" data-tab>
    <ul class="tab__block" role="tablist">
        <li class="tab__block__item" role="tab">
            <a href="#tab1-stacked" class="tab__block__link">Tab 1</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab2-stacked" class="tab__block__link">Tab 2</a>
        </li>
        <li class="tab__block__item" role="tab">
            <a href="#tab3-stacked" class="tab__block__link">Tab 3</a>
        </li>
        <li class="tab__block__item tab__block__item--selected" role="tab">
            <a href="#tab4-stacked" class="tab__block__link">Tab 4</a>
        </li>
    </ul>
    <div class="tab__content">
        <div class="tab__content__item" id="tab1-stacked" role="tabpanel">Tab 1 content</div>
        <div class="tab__content__item" id="tab2-stacked" role="tabpanel">Tab 2 content</div>
        <div class="tab__content__item" id="tab3-stacked" role="tabpanel">Tab 3 content</div>
        <div class="tab__content__item tab__content__item--selected" id="tab4-stacked" role="tabpanel">Tab 4 content</div>
    </div>
</div>
{% endhighlight %}


##tab stacked reverse
{% include components/tab/tab-stacked-reverse.html %}

{% highlight html %}
<div class="tab tab--stacked tab--reverse" data-tab>
    <ul class="tab__block" role="tablist">
        <li class="tab__block__item"><a href="#tab1-stacked-reverse" class="tab__block__link" role="tab">Tab 1</a></li>
        <li class="tab__block__item"><a href="#tab2-stacked-reverse" class="tab__block__link" role="tab">Tab 2</a></li>
        <li class="tab__block__item"><a href="#tab3-stacked-reverse" class="tab__block__link" role="tab">Tab 3</a></li>
        <li class="tab__block__item tab__block__item--selected"><a href="#tab4-stacked-reverse" class="tab__block__link">Tab 4</a></li>
    </ul>
    <div class="tab__content">
        <div class="tab__content__item" id="tab1-stacked-reverse" role="tabpanel">Tab 1 content</div>
        <div class="tab__content__item" id="tab2-stacked-reverse" role="tabpanel">Tab 2 content</div>
        <div class="tab__content__item" id="tab3-stacked-reverse" role="tabpanel">Tab 3 content</div>
        <div class="tab__content__item tab__content__item--selected" id="tab4-stacked-reverse" role="tabpanel">Tab 4 content</div>
    </div>
</div>
{% endhighlight %}



##how to use

| Class modifier | Description              |
|----------------|--------------------------|
| .tab--inline   | Places items in-line.    |
| .tab--bar      | Places items in bar.     |
| .tab--stacked  | Places items in stacked. |


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
.tab {
    // Common styles

    @include to(c) {
        @include tab--bar;
    }

    @include from(d) {
        @include tab--stacked;
    }

}
{% endhighlight %}


Default media query:
{% highlight scss %}
.tab {
    //Common styles

    @media (max-width: 799px) {
        @include tab--bar;
    }

    @media (min-width: 800px) {
        @include tab--stacked;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.tab {
    @include tab--bar;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom tab

You can create your own custom tab.

{% highlight scss %}
.tab--custom {
    @include tab--inline;
    // Custom styles
}
{% endhighlight %}
