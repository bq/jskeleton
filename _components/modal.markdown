---
layout: component
title:  "Modal"
---

A modal is a dialog prompt, like a pop-up window, that temporarily blocks interactions with the site.

##Full screen modal
{% include components/modal/modal-full.html %}

{% highlight html %}
<button class="btn btn--primary" data-rel="modal" data-modal="{title: 'Modal', content: 'Content', closeable: true, buttons: {align: 'right', btn: [{text: 'Accept', className: 'btn btn--primary'}]}}">
	Modal
</button>
{% endhighlight %}


##Target modal
{% include components/modal/modal-target.html %}

{% highlight html %}
<button class="btn btn--primary" data-rel="modal" data-target=".demo--target" data-modal="{title: 'Modal', content: 'Content', buttons: {btn: [{text: 'Accept', className: 'btn btn--primary'}]}}">
	Target modal
</button>
{% endhighlight %}


##How to use

###Show modal by click event

{% highlight html %}
<button data-rel="modal" data-target="selector" data-modal="{options}" data-ajax="{ajaxSettings}">Modal</button>
{% endhighlight %}

###Show modal in loaded page

{% highlight html %}
<div data-rel="modal-init" data-modal="{options}" data-ajax="{ajaxSettings}"></div>
{% endhighlight %}

> Don't forget to add [data-rel] attribute.

| data-rel   | Description                                                     |
|------------|-----------------------------------------------------------------|
| modal      | Shows the content in a modal component                          |
| modal-init | Shows the content in a modal component when the page is loaded. |



| data-target (optional) | Description                            | Default |
|------------------------|----------------------------------------|---------|
| selector               | Shows the content in a modal component | 'body'  |


| data-modal            | Type             | Description                                                  | Default value     |
|-----------------------|------------------|--------------------------------------------------------------|-------------------|
| classModifier         | string           | Adds a class modifier in the modal component.                | ''                |
| title                 | string           | Modal title in top.                                          | ''                |
| backdrop              | boolean          | Adds a overlay behind to the modal.                          | true              |
| backdropClassName     | string           | Set this class to backdrop                                   | 'modal--backdrop' |
| show                  | boolean          | Shows the component after creating the model object.         | false             |
| closeable             | boolean          | The modal can be closed by clicking out of it.               | true              |
| closeIcon             | boolean          | Shows/hides the close icon.                                  | true              |
| closeText             | string           | Close icon text and tooltip(title) text.                     | 'close'           |
| buttons.align         | string           | Adds classes to align the buttons. 'left', 'center', 'right' | 'right'           |
| buttons.btn           | Array of objects | Settings of each button.                                     |                   |
| buttons.btn.text      | string           | Button text.                                                 | ''                |
| buttons.btn.className | string           | Class name ('btn btn--primary' ).                            | ''                |
| buttons.btn.url       | string(optional) | Adds a link element with the url value in its hrefattribute. | undefined         |
| template              | string           | Replace modal content with custom html                       |                   |


| data-ajax (optional) | Type   | Description               | Default value |
|----------------------|--------|---------------------------|---------------|
| ajaxSettings         | object | Sets jQuery ["ajaxSettings"](http://api.jquery.com/jquery.ajax) | jquery.ajax   |


##javaScript

> $('target').modal({options});

{% highlight js %}
$('body').modal({
    backdrop      : true,
    closeable     : true,
    title         : 'My modal',
    content       : 'Message',
    ajaxSettings  : {
      url: 'content.html'
    },
    buttons       : {
        align: 'right',
        btn: [{
            text: 'Accept',
            className: 'btn btn--primary'
        }]
    }
});
{% endhighlight %}

<div class="penguin-example">
$('target').modal('show');
</div>
{% highlight js %}
$('body').modal('show');
{% endhighlight %}

<div class="penguin-example">
$('target').modal('hide');
</div>
{% highlight js %}
$('body').modal('hide');
{% endhighlight %}

###events

The modal's target which receives the event.

| Event type       | Description                                          | Target                    |
|------------------|------------------------------------------------------|---------------------------|
| modal:show       | This event is fired when the modal is shown.         | relatedTarget or document |
| modal:hide       | This event is fired when the modal is hidden.        | relatedTarget or document |
| modal:ajaxLoaded | This event is fired when the ajax content is loaded. | relatedTarget or document |

{% highlight js %}
// Create a modal
var myModal = $.penguin.modal({title: 'My modal'}, '.panel');

// Show the created modal
myModal.show();

// Hide the created modal
myModal.hide();
{% endhighlight %}


###creating modal objects
> $.penguin.modal({options}, [target]);

###Theme definition

{% highlight scss %}
.modal {   
  &.modal--backdrop {} 
}

  .modal__dialog {}
  
    .modal__dialog__content {}
   
    
  .modal__header {}
    
      .modal__header__title {}
      
  .modal__body {}
  
  .modal__footer {}
  
{% endhighlight %}