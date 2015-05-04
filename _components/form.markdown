---
layout: component
title:  "Form"
---

A form displays a set of related fields: input, textarea, select, checkbox, radio button...

##form
{% include components/form/form-simple.html %}

{% highlight html %}
<div class="form">
    <form id="form-login">
        <fieldset>
            <legend>Sample form</legend>
            <!-- input type="email"-->
            <div class="form-control">
                <label for="email" class="invisible">Email</label>
                <span class="input input--icon">
                    <input type="email" id="email" name="email" placeholder="Email">
                    <i class="icon icon--invert" aria-hidden="true">*Your icon here*</i>
                </span>
            </div>
            <!-- input type="password" -->
            <div class="form-control">
                <label for="password" class="invisible">Password</label>
                <span class="input input--icon">
                    <input type="password" id="password" name="password" placeholder="Password">
                    <i class="icon icon--invert" aria-hidden="true">*Your icon here*</i>
                </span>
            </div>
            <!-- textarea -->
            <div class="form-control">
                <label for="textarea">Textarea</label>
                <span class="input">
                    <textarea id="textarea" name="textarea" rows="3"></textarea>
                </span>
            </div>
            <!-- select -->
            <div class="form-control">
                <label for="select" class="invisible">Select</label>
                <span class="input">
                    <select id="select" name="select">
                        <option>Item 1</option>
                        <option>Item 2</option>
                        <option>Item 3</option>
                        <option>Item 4</option>
                        <option>Item 5</option>
                    </select>
                </span>
            </div>
            <!-- select multiple -->
            <div class="form-control">
                <label for="select-multiple" class="invisible">Select</label>
                <span class="input">
                    <select id="select-multiple" multiple name="select">
                        <option>Item 1</option>
                        <option>Item 2</option>
                        <option>Item 3</option>
                        <option>Item 4</option>
                        <option>Item 5</option>
                    </select>
                </span>
            </div>
            <!-- input type="file" -->
            <div class="form-control">
                <label for="file">File</label>
                <span class="input">
                    <input id="file" type="file" name="file">
                </span>
            </div>
            <!-- input type="checkbox" -->
            <fieldset>
                <legend>Checkbox</legend>
                <div class="form-control">
                    <span class="input input--checkbox">
                        <input type="checkbox" id="remember-1" name="remember">
                    </span>
                    <label for="remember-1">Checkbox 1</label>
                </div>
                <div class="form-control">
                    <span class="input input--checkbox">
                        <input type="checkbox" id="remember-2" name="remember">
                    </span>
                    <label for="remember-2">Checkbox 2</label>
                </div>
            </fieldset>
            <!-- input type="radio" -->
            <fieldset>
                <legend>Sex</legend>
                <div class="form-control form-control--inline">
                    <span class="input input--radio">
                        <input type="radio" id="male" name="sex" value="male">
                    </span>
                    <label for="male">Male</label>
                </div>
                <div class="form-control form-control--inline">
                    <span class="input input--radio">
                        <input type="radio" id="female" name="sex" value="female">
                    </span>
                    <label for="female">Female</label>
                </div>
            </fieldset>
            <!-- single button -->
            <button class="btn btn--primary">Submit</button>
        </fieldset>
    </form>
</div>
{% endhighlight %}


##form horizontal
{% include components/form/form-horizontal.html %}

{% highlight html %}
<div class="form">
    <form>
        <fieldset>
            <legend>Sign in</legend>
            <div class="form-control form-control--warn">
                <div class="row row--inline row--collapse">
                    <div class="col-a-12 col-d-2">
                        <label for="email-horizontal">Email</label>
                    </div>
                    <div class="col-a-12 col-d-10">
                        <span class="input">
                            <input type="email" id="email-horizontal">
                        </span>
                    </div>
                </div>
            </div>
            <div class="form-control">
                <div class="row row--inline row--collapse">
                    <div class="col-a-12 col-d-2">
                        <label for="password-horizontal">Contraseña</label>
                    </div>
                    <div class="col-a-12 col-d-10">
                        <span class="input">
                            <input type="password" id="password-horizontal">
                        </span>
                    </div>
                </div>
            </div>
            <div class="row row--collapse">
                <div class="col-md-offset-2 col-lg-offset-2 col-lg-10">
                    <div class="form-control">
                        <div class="input input--checkbox">
                            <input type="checkbox" id="remember-horizontal" name="remember">
                        </div>
                        <label for="remember-horizontal">Remember me</label>
                    </div>
                    <ul class="btn-group">
                        <li class="btn-group__item">
                            <input type="submit" class="btn btn--primary" value="Login">
                        </li>
                    </ul>
                </div>
            </div>
        </fieldset>
    </form>
</div>
{% endhighlight %}


##form two columns
{% include components/form/form-2cols.html %}

{% highlight html %}
<div class="form">
    <form id="form-2col">
        <div class="row">
            <div class="col-a-6">
                <fieldset>
                    <legend>Account data</legend>
                    <div class="form-control">
                        <label for="name-2col">Username</label>
                        <span class="input">
                            <input id="name-2col" type="text" name="user">
                        </span>
                    </div>
                    <div class="form-control">
                        <label for="email-2col">Email</label>
                        <span class="input">
                            <input type="email" id="email-2col" name="email">
                        </span>
                    </div>
                    <div class="form-control">
                        <label for="password-2col">Password</label>
                        <span class="input">
                            <input type="password" id="password-2col" name="password">
                        </span>
                    </div>
                </fieldset>
            </div>
            <div class="col-a-6">
                <fieldset>
                    <legend>User data</legend>
                    <div class="form-control">
                        <label for="user-name-2col">Full name</label>
                        <span class="input">
                            <input id="user-name-2col" type="text" name="user-name">
                        </span>
                    </div>
                    <div class="form-control">
                        <label for="address-2col">Address</label>
                        <span class="input">
                            <input id="address-2col" type="text" name="address">
                        </span>
                    </div>
                    <fieldset>
                        <legend>Sex</legend>
                        <div class="form-control form-control--inline">
                            <span class="input input--radio">
                                <input type="radio" id="male-2col" name="sex" value="male">
                            </span>
                            <label for="male-2col">Male</label>
                        </div>
                        <div class="form-control form-control--inline">
                            <span class="input input--radio">
                                <input type="radio" id="female-2col" name="sex" value="female">
                            </span>
                            <label for="female-2col">Female</label>
                        </div>
                    </fieldset>
                </fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-a-12">
                <ul class="btn-group align-right">
                    <li class="btn-group__item">
                        <input type="reset" class="btn btn--secondary" value="Reset">
                    </li>
                    <li class="btn-group__item">
                        <input type="submit" class="btn btn--primary" value="Submit">
                    </li>
                </ul>
            </div>
        </div>
    </form>
</div>
{% endhighlight %}


##form four columns
{% include components/form/form-4cols.html %}

{% highlight html %}
<div class="form">
    <form>
        <fieldset>
            <legend>Legend</legend>
            <div class="row row--collapse">
                <div class="col-a-3">
                    <div class="form-control">
                        <label for="name-4col">Username</label>
                        <span class="input">
                            <input id="name-4col" type="text" name="user">
                        </span>
                    </div>
                </div>
                <div class="col-a-3">
                    <div class="form-control">
                        <label for="email-4col">Email</label>
                        <span class="input">
                            <input type="email" id="email-4col" name="email-4col">
                        </span>
                    </div>
                </div>
                <div class="col-a-3">
                    <div class="form-control">
                        <label for="password-4col">Password</label>
                        <span class="input">
                            <input type="password" id="password-4col" name="password">
                        </span>
                    </div>
                </div>
                <div class="col-a-3">
                    <div class="form-control">
                        <label for="user-name-4col">Full name</label>
                        <span class="input">
                            <input id="user-name-4col" type="text" name="user-name-4col">
                        </span>
                    </div>
                </div>
                <div class="col-a-3">
                    <div class="form-control">
                        <label for="address-4col">Address</label>
                        <span class="input">
                            <input id="address-4col" type="text" name="address-4col">
                        </span>
                    </div>
                </div>
                <div class="col-a-3">
                    <fieldset class="form-control--inline">
                        <legend>Sex</legend>
                        <div class="form-control form-control--inline">
                            <span class="input input--radio">
                                <input type="radio" id="male-4col" name="sex" value="male">
                            </span>
                            <label for="male-4col">Male</label>
                        </div>
                        <div class="form-control form-control--inline">
                            <span class="input input--radio">
                                <input type="radio" id="female-4col" name="sex" value="female">
                            </span>
                            <label for="female-4col">Female</label>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="row row--collapse">
                <div class="col-a-12">
                    <input type="submit" class="btn btn--primary" value="Submit">
                </div>
            </div>
        </fieldset>
    </form>
</div>
{% endhighlight %}

##custom elements

> You can create your own __custom form elements__. Only add the $appearance() mixin to remove default appearance and start customizing. Works in selects, radio buttons, and checkboxes.

{% highlight scss %}
.input--radio,
.input--select,
.input--checkbox {

    input {
        @include appearance(none);
       /*Your custom styles*/
    }

}
{% endhighlight %}

{% include components/form/form-custom-none.html %}

{% highlight html %}
    <div class="form">
        <form id="form-custom">
            <fieldset>
                <legend>Select</legend>
                <!-- select custom -->
                <div class="form-control">
                    <label for="select" class="invisible">Select</label>
                    <span class="input input--select">
                        <select id="select-custom" name="select-custom">
                            <option>Item 1</option>
                            <option>Item 2</option>
                            <option>Item 3</option>
                            <option>Item 4</option>
                            <option>Item 5</option>
                        </select>
                    </span>
                </div>
            </fieldset>
            <!-- input type="checkbox" -->
            <fieldset>
                <legend>Checkbox</legend>

                <div class="form-control">
                    <span class="input input--checkbox">
                        <input type="checkbox" id="checkbox-1-custom" name="remember">
                        <label for="checkbox-1-custom">Checkbox 1</label>
                    </span>
                </div>
                <div class="form-control">
                    <span class="input input--checkbox">
                        <input type="checkbox" id="checkbox-2-custom" name="remember">
                    </span>
                    <label for="checkbox-2-custom">Checkbox 2</label>
                </div>
            </fieldset>
            <!-- input type="radio" -->
            <fieldset>
                <legend>Radios</legend>
                <div class="form-control form-control--inline">
                    <span class="input input--radio">
                        <input type="radio" id="radio-1-custom" name="radio-custom" value="radio-1">
                    </span>
                    <label for="radio-1-custom">Radio 1</label>
                </div>
                <div class="form-control form-control--inline">
                    <span class="input input--radio">
                        <input type="radio" id="radio-2-custom" name="radio-custom" value="radio-2">
                    </span>
                    <label for="radio-2-custom">Radio 2</label>
                </div>
            </fieldset>
        </form>
    </div>
{% endhighlight %}


> You can create something like this. The next example don't be included in default theme, it's only a simple demo.

{% include components/form/form-custom.html %}


##How to use

| DOM structure | Description                                | Modifier class                              |
|---------------|--------------------------------------------|---------------------------------------------|
| .form         | Main container                             |                                             |
| fieldset      | Group form controls (optional)             |                                             |
| legend        | Caption for group from controls (optional) | .invisible                                  |
| label         | Label for input                            | .invisible                                  |
| span.input    | Input container                            | .input--icon               |
| input         | Element form                               |                                             |
| i.icon        | Icon element                               | .icon--type + aria-hidden="true" attribute. |
