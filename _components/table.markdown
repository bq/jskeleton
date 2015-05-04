---
layout: component
title:  "Table"
---

A classic. A table displays a collections of tabular data grouped into rows and cols.

##table simple
{% include components/table/table-simple.html %}

{% highlight html %}
<table class="table">
    <thead>
        <tr>
            <th>#</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <td colspan="5">table footer</td>
        </tr>
    </tfoot>
    <tbody>
        <tr>
            <td><a href="">1</a></td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr>
            <td><a href="">2</a></td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr><td><a href="">3</a></td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr><td><a href="">4</a></td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
        <tr><td><a href="">5</a></td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
        </tr>
    </tbody>
</table>
{% endhighlight %}


##table stacked
{% include components/table/table-stacked.html %}

<div class="penguin-example">
    <table class="table table--stacked">
        <thead>
            <tr>
                <th>Heading 1</th>
                <th>Heading 2</th>
                <th>Heading 3</th>
                <th>Heading 4</th>
                <th>Heading 5</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td colspan="5">table footer</td>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td data-header="Heading 1"><a href="">Cell 1.1</a></td>
                <td data-header="Heading 2">Cell 1.2</td>
                <td data-header="Heading 3">Cell 1.3</td>
                <td data-header="Heading 4">Cell 1.4</td>
                <td data-header="Heading 5">Cell 1.5</td>
            </tr>
            <tr>
                <td data-header="Heading 1"><a href="">Cell 2.1</a></td>
                <td data-header="Heading 2">Cell 2.2</td>
                <td data-header="Heading 3">Cell 2.3</td>
                <td data-header="Heading 4">Cell 2.4</td>
                <td data-header="Heading 5">Cell 2.5</td>
            </tr>
        </tbody>
    </table>
</div>

{% highlight html %}
<table class="table table--stacked">
    <thead>
        <tr>
            <th>Heading 1</th>
            <th>Heading 2</th>
            <th>Heading 3</th>
            <th>Heading 4</th>
            <th>Heading 5</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <td colspan="5">table footer</td>
        </tr>
    </tfoot>
    <tbody>
        <tr>
            <td data-header="Heading 1"><a href="">Cell 1.1</a></td>
            <td data-header="Heading 2">Cell 1.2</td>
            <td data-header="Heading 3">Cell 1.3</td>
            <td data-header="Heading 4">Cell 1.4</td>
            <td data-header="Heading 5">Cell 1.5</td>
        </tr>
        <tr>
            <td data-header="Heading 1"><a href="">Cell 2.1</a></td>
            <td data-header="Heading 2">Cell 2.2</td>
            <td data-header="Heading 3">Cell 2.3</td>
            <td data-header="Heading 4">Cell 2.4</td>
            <td data-header="Heading 5">Cell 2.5</td>
        </tr>
    </tbody>
</table>
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
.table {
    // Common styles

    @include to(c) {
        @include table--stacked;
    }

}
{% endhighlight %}


Default media query:

{% highlight scss %}
.table {
    //Common styles

    @media (max-width: 799px) {
        @include table--stacked;
    }

}
{% endhighlight %}

@include media-minwidth, a penguin mixin:

{% highlight scss %}
.table {
    @include table--stacked;

    @mixin media-minwidth(d) {
        // Custom styles
    }
}
{% endhighlight %}

##custom table

You can create your own custom table.

{% highlight scss %}
.table--custom {
    @include table--stacked;
    // Custom styles
}
{% endhighlight %}