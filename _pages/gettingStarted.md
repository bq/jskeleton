---
layout: page
title: Getting started
order: 0
permalink: /getting-started/
---

After downloading [penguin](https://github.com/bq/penguin), follow these simple steps to get started:

## Customize with Sass

If you choose this way then you should build using a Task Runner. Penguin uses Grunt for compile our code.

First of all, you should install [Node](https://nodejs.org/download/) and [Grunt](http://gruntjs.com/getting-started).
If you want to build the project locally, you have to run the [Grunt](http://gruntjs.com/) task `grunt build`. This task will concat and minify the sources and create the README.md. Before all this, you do not forget to run `npm install` and `bower install`.


##Compiled and minified CSS and JavaScript.

You should add to project stylesheet and link it in the header of your HTML file, like so:

{% highlight html %}
<!-- This is how you would link your penguin stylesheet -->
<link rel="stylesheet" href="dist/css/penguin.min.css">
{% endhighlight %}

If you are using any Penguin JavaScript components, this needs to be loaded on the page. You do not forget add jQuery to project, Penguin components require jQuery to be included. We recommend at the end before your closing <body> tags like so:

{% highlight html %}
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="dist/js/penguin.min.js"></script>
<script>
    $('body').modal();
</script>
{% endhighlight %}

Also you can load only the components you need for your project:

{% highlight html %}
...
        <script src="js/jquery.min.js"></script>
        <!-- Alerts -->
        <script src="penguin/js/components/alert.js"></script>
        <!-- Dropdowns -->
        <script src="penguin/js/components/dropdown.js"></script>
        <!-- Modal -->
        <script src="penguin/js/components/modal.js"></script>
        <!-- Spinner -->
        <script src="penguin/js/components/spinner.js"></script>
</body>
{% endhighlight %}


To minimize the compiled style, we can disable the doesn't used components in /components/_variables.css 

{% highlight scss %}
$styles-alert                        : true;
$styles-banner                       : true;
$styles-breadcrumb                   : true;
$styles-button                       : true;
$styles-dropdown                     : true;
$styles-form                         : true;
$styles-icon                         : true;
$styles-modal                        : true;
$styles-navigation                   : true;
$styles-paginator                    : true;
$styles-panel                        : true;
$styles-spinner                      : true;
$styles-tab                          : true;
$styles-table                        : true;
$styles-text                         : true;
{% endhighlight %}

> Working with [RequireJS](http://requirejs.org):

{% highlight javascript %}
    'use strict'

    require.config({
        paths: {
            'penguin': 'path-to-penguin/penguin/lib/penguin.js'
        }      
    });
{% endhighlight %}

You can also add a single JavaSript component:

{% highlight javascript %}
    'use strict'

    require.config({
        paths: {
            'penguin.modal': 'path-to-penguin/penguin/src/js/modal.js'
        }      
    });
{% endhighlight %}

## How to include Penguin in your project

Quick example of how to import penguin to your project, overriding it and adding your own theme styles. The example file would be your main scss file (`main.scss`).

Note: 

* path_to_penguin: directory where penguin is (for example: app/bower_components/penguin)
* path_to_theme: directory where your project theme is (for example: app/css)

> main.scss

{% highlight scss %}
// Base: Variables
@import "path_to_penguin/base/_variables";
@import "path_to_theme/base/_variables";

// Components: Variables
@import "path_to_penguin/components/_variables";
@import "path_to_theme/components/_variables";

// Base: Scaffolding (optional)
@import "path_to_penguin/base/_scaffolding";
@import "path_to_theme/base/_scaffolding";

// Base: Mixins
@import "path_to_penguin/base/_mixins";

// Base: Reset
@import "path_to_penguin/base/_reset";

// Base: Print
@import "path_to_penguin/base/_print";

// Base: Utils
@import "path_to_penguin/base/_utils";

// Base: Responsive utilities
@import "path_to_penguin/base/_responsive";

// Base: Grid system
@import "path_to_penguin/base/_grid";

// Components: Animations
@import "path_to_penguin/base/_animations";

// Components: Alert
@import "path_to_penguin/components/alert";
@import "path_to_theme/components/alert";

// Components: Text
@import "path_to_penguin/components/text";
@import "path_to_theme/components/text";

// Components: Dropdown
@import "path_to_penguin/components/_dropdown";
@import "path_to_theme/components/_dropdown";

// Components: Button
@import "path_to_penguin/components/_button";
@import "path_to_theme/components/_button";

// Components: Navigation
@import "path_to_penguin/components/_navigation";
@import "path_to_theme/components/_navigation";

// Components: Tab
@import "path_to_penguin/components/_tab";
@import "path_to_theme/components/_tab";

// Components: Breadcumb
@import "path_to_penguin/components/_breadcrumb";
@import "path_to_theme/components/_breadcrumb";

// Components: Table
@import "path_to_penguin/components/_table";
@import "path_to_theme/components/_table";

// Components: Form
@import "path_to_penguin/components/_form";
@import "path_to_theme/components/_form";

// UI Components: Icon
@import "path_to_penguin/components/_icon";
@import "path_to_theme/components/_icon";

// UI Components: Modal
@import "path_to_penguin/components/_modal";
@import "path_to_theme/components/_modal";

// Components: Banner
@import "path_to_penguin/components/_banner";
@import "path_to_theme/components/_banner";

// Components: Spinner
@import "path_to_penguin/components/_spinner";
@import "path_to_theme/components/_spinner";

// Components: Paginator
@import "path_to_penguin/components/_paginator";
@import "path_to_theme/components/_paginator";

// Components: Panel
@import "path_to_penguin/components/_panel";
@import "path_to_theme/components/_panel";
{% endhighlight %}