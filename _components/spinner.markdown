---
layout: component
title:  "Spinner"
---

Loading spinner.

##target spinner
{% include components/spinner/spinner-simple.html %}


##fullscreen spinner
{% include components/spinner/spinner-fullscreen.html %}


##how to use

| Argument          | Type    | Description                            | Default value              |
|-------------------|---------|----------------------------------------|----------------------------|
| target            | string  | Selector where spinner will be shown   |                            |
| 'show'            | string  | Shows the spinner                      |                            |
| 'hide'            | string  | Hides the spinner                      |                            |
| text              | string  | Fallback text inside spinner           | 'Loading...'               |
| spinnerClass      | string  | Adds this class to spinner             | 'spinner__element--circle' |
| show              | boolean | Displays just after creating it        | false                      |

Target is the selector where spinner will be shown.

{% highlight js %}

// Default spinner
$('target').spinner();

// Custom spinner
$('target').spinner({
    spinnerClass: 'spinner__element--circle',
    text: 'Loading...',
    show: false
});

// Custom template
$('target').spinner({
    template: '<div>Custom Spinner</div>'
});
{% endhighlight %}

##events

The spinner's target receives the event.

| Event type   | Description                                     | Target                  |
|--------------|-------------------------------------------------|-------------------------|
| spinner:show | This event is fired when the spinner is shown.  | 'body' or custom target |
| spinner:hide | This event is fired when the spinner is hidden. | 'body' or custom target |

{% highlight js %}
// Show the created spinner
$('target').spinner('show');

// Hide the spinner
$('target').spinner('hide');
{% endhighlight %}