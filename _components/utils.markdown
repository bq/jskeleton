---
layout: component
title:  "Utils"
---
Penguin has defined default classes to help you in common cases

##floating content
{% include components/utils/utils-floating.html %}

{% highlight html %}
<div class="clearfix">
    <div class="box center-block">Center block</div>
</div>
<div class="clearfix">
    <div class="box pull-right">Pull right</div>
    <div class="box pull-left">Pull left</div>
    <div class="box pull-left">Pull left</div>
</div>
<div class="clearfix">
    <div class="box pull-left">Pull left</div>
</div>
{% endhighlight %}

<table>
    <thead>
        <tr>
            <th>Class name</th>
            <th>Property</th>
        </tr>
    </thead>
	<tr>
		<td>.clearfix</td>
		<td>Apply clearfix hack</td>
	</tr>
	<tr>
		<td>.center-block</td>
		<td>Center-align a block level element</td>
	</tr>
	<tr>
		<td>.pull-right</td>
		<td>Add float right</td>
	</tr>
	<tr>
		<td>.pull-left</td>
		<td>Add float left</td>
	</tr>
</table>

##visibility
{% include components/utils/utils-visibility.html %}

<table>
    <thead>
        <tr>
            <th>Class name</th>
            <th>Property</th>
        </tr>
    </thead>
	<tr>
		<td>.hide</td>
		<td>Hide element for screenreaders and browsers (display: none)</td>
	</tr>
	<tr>
		<td>.show</td>
		<td>Show element, (display: block)</td>
	</tr>
	<tr>
		<td>.invisible</td>
		<td>Hide for browser while still making it readable by screen readers</td>
	</tr>
</table>

###responsive visibility

> We can define a list of classes to show or hide content depending the resolution, breakpoint-names are defined in /base/_variables.scss, more info in <a href="/components/grid">grid component page</a>


{% highlight scss %}
.visible-[breakpoint-name]
.hidden-[breakpoint-name]
{% endhighlight %}

{% include components/utils/utils-responsive.html %}

{% highlight html %}
<div class="row">
    <div class="col-a-12 col-b-6">
        <div class="box hidden-a">Box hidden at 'a' breakpoint</div>
    </div>
    <div class="col-a-12 col-b-6">
        <div class="box visible-a">Box visible at 'a' breakpoint</div>
    </div>
</div>
<div class="row">
    <div class="col-a-12 col-b-6">
        <div class="box hidden-b">Box hidden at 'b' breakpoint</div>
    </div>
    <div class="col-a-12 col-b-6">
        <div class="box visible-b">Box visible at 'b' breakpoint</div>
    </div>
</div>
<div class="row">
    <div class="col-a-12 col-b-6">
        <div class="box hidden-c">Box hidden at 'c' breakpoint</div>
    </div>
    <div class="col-a-12 col-b-6">
        <div class="box visible-c">Box visible at 'c' breakpoint</div>
    </div>
</div>
<div class="row">
    <div class="col-a-12 col-b-6">
        <div class="box hidden-d">Box hidden at 'd' breakpoint</div>
    </div>
    <div class="col-a-12 col-b-6">
        <div class="box visible-d">Box visible at 'd' breakpoint</div>
    </div>
</div>
<div class="row">
    <div class="col-a-12 col-b-6">
        <div class="box hidden-e">Box hidden at 'e' breakpoint</div>
    </div>
    <div class="col-a-12 col-b-6">
        <div class="box visible-e">Box visible at 'e' breakpoint</div>
    </div>
</div>
{% endhighlight%}

##text
{% include components/utils/utils-text.html %}

{% highlight html %}
<div class="clearfix">
    <div class="box pull-left align-left">Align left</div>
    <div class="box pull-right align-right">Align right</div>
    <div class="box center-block align-center">Align center</div>
</div>
<p class="align-justify">This fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified this fake text is justified and <span class="text-small">I can</span> <span class="text-medium">change</span> <span class="text-large">font size</span>. </p>
{% endhighlight %}

<table>
    <thead>
        <tr>
            <th>Class name</th>
            <th>Property</th>
        </tr>
    </thead>
	<tr>
		<td>.align-left</td>
		<td>Align element to left</td>
	</tr>
	<tr>
		<td>.align-right</td>
		<td>Align element to right</td>
	</tr>
	<tr>
		<td>.align-center</td>
		<td>Align element to center</td>
	</tr>
	<tr>
		<td>.align-justify</td>
		<td>Justify element</td>
	</tr>
</table>

##format
{% include components/utils/utils-format.html %}

{% highlight html %}
<p>You can modify <span class="underline">text</span> <strong class="bold">format</strong> <em class="cursive">easily</em></p>
{% endhighlight %}
<table>
    <thead>
        <tr>
            <th>Class name</th>
            <th>Property</th>
        </tr>
    </thead>
	<tr>
		<td>.bold</td>
		<td>Set font weight to bold</td>
	</tr>
	<tr>
		<td>.normal</td>
		<td>Set font weight to normal</td>
	</tr>
	<tr>
		<td>.cursive</td>
		<td>Set font style to italic</td>
	</tr>
	<tr>
		<td>.underline</td>
		<td>Set text decoration to underline</td>
	</tr>
</table>


