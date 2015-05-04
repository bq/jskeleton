---
layout: component
title:  "Icon"
---

Icons can be handled in different ways: sprite, iconic fonts, inline svg, css background

###how to use

| Class name                     | Description                                                   |
| ----------                     | -----------                                                   |
| icon              | Adds base styles                                              |
| icon--{icon-name} | Class for desired icon. Icon name will be the image file name |

{% include components/icon/icon-simple.html %}

{% highlight html %}
<i class="icon icon--bell" aria-hidden="true"></i>
{% endhighlight %}

##icon with text

> If icon have text, add a parent span with class "icon-text"

{% include components/icon/icon-text.html %}

{% highlight html %}
<span class="icon-text">
    <i class="icon icon--invert" aria-hidden="true">
        *Your icon here*
    </i>
    Button 1
</span>
{% endhighlight %}

{% include components/icon/icon-button.html %}

{% highlight html %}
<button class="btn btn--primary">
    <span class="icon-text"><i class="icon" aria-hidden="true"></i>Button 1</span>
</button>
{% endhighlight %}

##iconic fonts

penguin can use iconic fonts like [font awesome](http://fortawesome.github.io/Font-Awesome/ "font awesome web"), gives you scalable vector icons that can instantly be customized — size, color, drop shadow, and anything that can be done with CSS. [Documentation for installation](http://fortawesome.github.io/Font-Awesome/get-started/ "font awesome web")

{% include components/icon/icon-font.html %}

{% highlight html %}
<i class="fa fa-check"></i>
{% endhighlight %}

{% include components/icon/icon-font-text.html %}

{% highlight html %}
<span class="icon-text"><i class="fa fa-check"></i>Accept terms</span>
{% endhighlight %}


Other iconic font system recomended is [fontello](http://fontello.com/ "fontello web")

##inline svg

We can add directly svg code inside the <i> tag.

{% include components/icon/icon-svg-inline.html %}

{% highlight html %}
<i class="icon" aria-hidden="true">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
        <path d="M160.879,312.387V205.609h117.064v-39.627l93.178,93.016l-93.178,93.018v-39.629H160.879z M90,256
            c0,91.756,74.258,166,166,166c91.755,0,166-74.258,166-166c0-91.755-74.258-166-166-166C164.245,90,90,164.259,90,256z M462,256
            c0,113.771-92.229,206-206,206S50,369.771,50,256c0-113.771,92.229-206,206-206S462,142.229,462,256z"></path>
    </svg>
</i>
{% endhighlight %}

##css background

In this option, we call icon directly 
{% include components/icon/icon-background.html %}

{% highlight css %}
.icon-star {
  width: 32px;
  height: 32px;
  color: red;
  background: url(path/star.svg);
  background-size: 32px 32px;
}

<i class="icon icon-star"></i>
{% endhighlight %}


##sprite svg

SVG sprites are great. They follow this same logic of putting a bunch of images(svg in this case) in one document. You can open up your text editor and place all the SVG icons in that one file.
{% include components/icon/icon-svg-sprite.html %}

{% highlight html %}
<!-- svg sprite -->
<svg display="none" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<symbol id="icon-github" viewBox="0 0 1024 1024">
    <title>github</title>
    <path class="path1" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM816.056 816.056c-39.518 39.516-85.512 70.532-136.708 92.186-13.006 5.5-26.214 10.328-39.6 14.492v-76.734c0-40.334-13.834-70-41.5-89 17.334-1.666 33.25-4 47.75-7s29.834-7.334 46-13 30.666-12.416 43.5-20.25 25.166-18 37-30.5 21.75-26.666 29.75-42.5 14.334-34.834 19-57 7-46.584 7-73.25c0-51.666-16.834-95.666-50.5-132 15.334-40 13.666-83.5-5-130.5l-12.5-1.5c-8.666-1-24.25 2.666-46.75 11s-47.75 22-75.75 41c-39.666-11-80.834-16.5-123.5-16.5-43 0-84 5.5-123 16.5-17.666-12-34.416-21.916-50.25-29.75s-28.5-13.166-38-16-18.334-4.584-26.5-5.25-13.416-0.834-15.75-0.5-4 0.666-5 1c-18.666 47.334-20.334 90.834-5 130.5-33.666 36.334-50.5 80.334-50.5 132 0 26.666 2.334 51.084 7 73.25s11 41.166 19 57 17.916 30 29.75 42.5 24.166 22.666 37 30.5 27.334 14.584 43.5 20.25 31.5 10 46 13 30.416 5.334 47.75 7c-27.334 18.666-41 48.334-41 89v78.23c-15.098-4.494-29.98-9.804-44.6-15.988-51.194-21.654-97.188-52.67-136.706-92.186-39.516-39.518-70.534-85.512-92.186-136.708-22.398-52.958-33.756-109.262-33.756-167.348s11.358-114.39 33.758-167.35c21.654-51.194 52.67-97.188 92.186-136.706s85.512-70.534 136.706-92.186c52.96-22.4 109.264-33.758 167.35-33.758s114.39 11.358 167.35 33.758c51.196 21.654 97.19 52.67 136.708 92.186 39.516 39.516 70.532 85.512 92.186 136.706 22.398 52.96 33.756 109.264 33.756 167.35s-11.358 114.39-33.758 167.35c-21.654 51.194-52.67 97.19-92.186 136.706z"></path>
</symbol>
<symbol id="icon-html5" viewBox="0 0 1024 1024">
    <title>html5</title>
    <path class="path1" d="M60.538 0l82.144 921.63 368.756 102.37 369.724-102.524 82.3-921.476h-902.924zM810.762 862.824l-297.226 82.376v0.466l-0.776-0.234-0.782 0.234v-0.466l-297.222-82.376-70.242-787.486h736.496l-70.248 787.486zM650.754 530.204l-13.070 146.552-126.21 34.070-125.862-33.916-8.050-90.234h-113.49l15.83 177.512 232.076 64.176 231.342-64.176 31.040-347.012h-411.966l-10.302-115.748h432.534l10.112-113.026h-566.218l30.498 341.802z"></path>
</symbol>
<symbol id="icon-css3" viewBox="0 0 1024 1024">
    <title>css3</title>
    <path class="path1" d="M152.388 48.522l-34.36 171.926h699.748l-21.884 111.054h-700.188l-33.892 171.898h699.684l-39.018 196.064-282.012 93.422-244.4-93.422 16.728-85.042h-171.898l-40.896 206.352 404.226 154.704 466.006-154.704 153.768-772.252z"></path>
</symbol>
<symbol id="icon-git" viewBox="0 0 1024 1024">
    <title>git</title>
    <path class="path1" d="M1004.692 466.394l-447.096-447.080c-25.738-25.754-67.496-25.754-93.268 0l-103.882 103.876 78.17 78.17c12.532-5.996 26.564-9.36 41.384-9.36 53.020 0 96 42.98 96 96 0 14.82-3.364 28.854-9.362 41.386l127.976 127.974c12.532-5.996 26.566-9.36 41.386-9.36 53.020 0 96 42.98 96 96s-42.98 96-96 96-96-42.98-96-96c0-14.82 3.364-28.854 9.362-41.386l-127.976-127.974c-3.042 1.456-6.176 2.742-9.384 3.876v266.968c37.282 13.182 64 48.718 64 90.516 0 53.020-42.98 96-96 96s-96-42.98-96-96c0-41.796 26.718-77.334 64-90.516v-266.968c-37.282-13.18-64-48.72-64-90.516 0-14.82 3.364-28.852 9.36-41.384l-78.17-78.17-295.892 295.876c-25.75 25.776-25.75 67.534 0 93.288l447.12 447.080c25.738 25.75 67.484 25.75 93.268 0l445.006-445.006c25.758-25.762 25.758-67.54-0.002-93.29z"></path>
</symbol>
</defs>
</svg>

<div class="sprite-svg">
    <svg class="icon icon--github"><use xlink:href="#icon-github"></use></svg>
</div>
<div class="sprite-svg">
    <svg class="icon icon--html5"><use xlink:href="#icon-html5"></use></svg>
</div>
<div class="sprite-svg">
    <svg class="icon icon--css3"><use xlink:href="#icon-css3"></use></svg>
</div>
<div class="sprite-svg">
    <svg class="icon icon--git"><use xlink:href="#icon-git"></use></svg>
</div>
{% endhighlight %}