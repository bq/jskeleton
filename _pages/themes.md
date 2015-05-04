---
layout: page
title: Themes
order: 2
permalink: /themes/
---

## How to create a new theme

### 1. Download the themes repository

Download the penguin themes repository [penguin-themes](https://github.com/bq/penguin-themes) and then create the following directory structure:

{% highlight html %}
penguin-themes/themes/<theme_name>/
                            └── src/
                                └── css/
                                    ├── base/
                                    │   └── _variables.scss
                                    ├── components/
                                    └── main.scss
{% endhighlight %}

### 2. Set up your theme

*Configure your theme variables in `src/css/base/_variables.scss` and `src/css/components/_variables.scss`.
*Style your theme components in `src/css/components/{component_name}`.

### 3. Build your theme

Compile your theme using the following grunt task:

{% highlight html %}
grunt build-theme:<theme_name>
{% endhighlight %}

### 4. Share your theme!

Now you have your awesome theme ready to be used for hundreds of developers :) Just make a pull request to the themes repository [penguin-themes](https://github.com/bq/penguin-themes) and we will check it as soon as possible.



