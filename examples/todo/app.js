var Layout = Marionette.LayoutView.extend({
    regions: {
        headerRegion: '.header',
        contentRegion: '.content',
        footerRegion: '.footer'
    }
});

var Controller = Marionette.Controller.extend({
    navigate: function() {
        console.log('navigate controller');
    }
});


var ExampleItemView = Marionette.ItemView.extend({
    template: '<strong> Título del libro: <span class="title">{{title}}</span> </strong> <strong> Identificador del libro: {{id}} </strong>',
    events: {
        'click .title': 'onTitleClicked'
    },
    onTitleClicked: function() {
        window.alert('pene');
    }
});

Jskeleton.factory.add('ExampleItemView', ExampleItemView);

var ViewController = Jskeleton.ViewController.extend({
    onBookShow: function(params, service) {
        this.context.testModel = new Backbone.Model({
            title: params.title,
            id: params.id
        });
    }
});

var BookCatalogue = Jskeleton.ChildApplication.extend({
    //ServiceClass: Service,
    routes: {
        'book/show/:title(/:id)': {
            viewControllerClass: ViewController,
            // handlerName: 'onStateChange',
            // name: 'home:navigate',
            // triggerEvent: ''
            // viewControllerOptions: {
            //     model: MiModel
            // },
            template: '<span> Vista de libro: </span> {{@component name="ExampleItemView" model=context.testModel}}',
            eventListener: 'book:details'
        }
    }
});


var AppMain = Jskeleton.Application.extend({
    rootEl: '.app-container',
    layout: {
        layoutClass: Layout,
        template: '<div class="hero-unit">' +
            '<h1>Aplicación de libros</h1>' +
            '<h3> Header: </h3>' +
            '<div class="header"></div>' +
            '<h3> Contenido: </h3>' +
            '<div class="content"></div>' +
            '<h3> Footer: </h3>' +
            '<div class="footer"></div>' +
            '</div>'
        // TODO:
        //regions: {
        //}
    },
    applications: {
        'bookCatalogue': {
            appClass: BookCatalogue,
            region: 'contentRegion'
        }
    }
});

var app = new AppMain();

app.start();