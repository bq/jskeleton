---
layout: component
title:  "Text"
---

Styles for all of the most basic typographical elements. Remeber to use all the elements inside the .text wrapper.

{% highlight html %}
<div class="text">
    <!-- Place here the html element -->
</div>
{% endhighlight %}


##heading

| Class name | HTML                                                            |
|------------|-----------------------------------------------------------------|
| .h1        | <code class="text"><h1 class="h1">This is a h1 text</h1></code> |
| .h2        | <code class="text"><h2 class="h2">This is a h2 text</h2></code> |
| .h3        | <code class="text"><h3 class="h3">This is a h3 text</h3></code> |
| .h4        | <code class="text"><h4 class="h4">This is a h4 text</h4></code> |
| .h5        | <code class="text"><h5 class="h5">This is a h5 text</h5></code> |
| .h6        | <code class="text"><h6 class="h6">This is a h6 text</h6></code> |

<div class="penguin-example">
    <h3 class="h1">This is a h3 text with .h1 style</h3>
</div>

{% highlight html %}
<h3 class="h1">This is a h3 text with .h1 style</h3>
{% endhighlight %}

{% include components/text/text-headings.html %}

{% highlight html %}
<div class="text">
    <h1>This is a h1 text</h1>
    <h2>This is a h2 text</h2>
    <h3>This is a h3 text</h3>
    <h4>This is a h4 text</h4>
    <h5>This is a h5 text</h5>
    <h6>This is a h6 text</h6>
</div>
{% endhighlight %}




##paragraphs
{% include components/text/text-paragraphs.html %}

{% highlight html %}
<div class="text">
    <p>Default paragraph</p>
    <p class="text-large">This is a large text</p>
    <p>Default paragraph with a <strong>heavier font-weight</strong></p>
    <p>Default paragraph with a <em>snippet of text with italics</em></p>
    <p class="text-small">This is a small text</p>
    <p class="text"><small>This is a small label</small></p>
</div>
{% endhighlight %}

| Element | HTML                                                                                            |
|---------|-------------------------------------------------------------------------------------------------|
| p       | <code class="text"><p>Default paragraph</p></code>                                              |
| p.text-large  | <code class="text"><p class="text-large">This is a large text</p></code>                            |
| strong  | <code class="text"><p>Default paragraph with a <strong>heavier font-weight</strong></p></code>  |
| em      | <code class="text"><p>Default paragraph with a <em>snippet of text with italics</em></p></code> |
| p.text-small   | <code class="text"><p class="text-small"><small>This is a small text</small></p></code>                                   |
| p.text small   | <code class="text"><p class="text"><small>This is a small text</small></p></code>                                   |





##lists
{% include components/text/text-lists.html %}

{% highlight html %}
<div class="text">
    <ul>
        <li>A</li>
        <li>B</li>
        <li>
            <strong>C</strong>
            <ul>
                <li>C1</li>
                <li>C2</li>
            </ul>
        </li>
        <li>D</li>
    </ul>
    <ol>
        <li>one</li>
        <li>two</li>
        <li>three</li>
        <li>four</li>
    </ol>
    <dl>
        <dt><strong>Term A:</strong></dt>
            <dd>Definition A</dd>
        <dt><strong>Term B:</strong></dt>
            <dd>Definition B</dd>
        <dt><strong>Term C:</strong></dt>
            <dd>
                <ul>
                    <li>Definition C1</li>
                    <li>Definition C2</li>
                    <li>
                        <ol>
                            <li>Definition C3.1</li>
                            <li>Definition C3.2</li>
                        </ol>
                    </li>
                </ul>
            </dd>
    </dl>
</div>
{% endhighlight %}