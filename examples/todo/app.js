/* globals JSkeleton, Backbone */

'use strict';

JSkeleton.ItemView.factory('DetailBookView', {
    initialize: function() {},
    template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
        '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
        '<strong> Identificador del libro: </strong><span class="id">{{id}}</span> <button class="view-action"> Comprar </button> <button class="view-back"> Volver al listado </button>',
    events: {
        'click .view-action': 'onActionClicked',
        'click .view-back': 'onBackClicked'
    },
    onActionClicked: function() {
        this.trigger('action', this.model);
    },
    onBackClicked: function() {
        this.trigger('navigate');
    }
});

JSkeleton.ItemView.factory('ListItemViewBook', {
    template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
        '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
        '<strong> Identificador del libro: </strong><span class="id">{{id}}</span> <button class="view-action"> Ver detalles </button>',
    events: {
        'click .view-action': 'onActionClicked'
    },
    onActionClicked: function() {
        this.trigger('action', this.model);
    }
});

JSkeleton.CollectionView.factory('BookCollectionView', {
    childView: 'ListItemViewBook'
});

JSkeleton.ViewController.factory('DetalleDeLibro', ['ServicioDeLibros'], function(servicioDeLibros) {
    return {
        template: '<span> Detalle de libro: </span> {{@component "DetailBookView" model=context.bookModel}}',
        events: {
            'action @component.DetailBookView': 'onActionClicked',
            'navigate @component.DetailBookView': 'onNavigateClicked'
        },
        onActionClicked: function(libro) {
            servicioDeLibros.buy(libro);
        },
        onNavigateClicked: function() {
            JSkeleton.globalChannel.trigger('book:list');
            // channel.trigger('book:list');
        },
        onStateChange: function(params) {
            this.context.bookModel = new Backbone.Model({
                title: params.title,
                id: params.id,
                author: params.author || 'desconocido'
            });
        }
    };
});

JSkeleton.ViewController.factory('ListadoDeLibros', {
    events: {
        'childview:action @component.BookCollectionView': 'onNavigateClicked'
    },
    onNavigateClicked: function(childview, model) {
        JSkeleton.globalChannel.trigger('book:details', {
            id: model.get('id'),
            description: model.get('description'),
            title: model.get('title')
        });

    },
    onStateChange: function() {
        var def = $.Deferred();
        var self = this;

        setTimeout(function() {
            def.resolve();
        }, 2000);

        return def.promise().then(function() {

            self.context.bookCollection = new Backbone.Collection([{
                title: 'Juego de tronos',
                id: 165
            }, {
                title: 'El hobbit',
                id: 170
            }, {
                title: 'Cien años de soledad',
                id: 14
            }]);

        });
    }

});

// {{@component name="BookCollectionView" collection=context.bookCollection}}
//{{#each "model" in context.bookCollection}} <span> Titulo del libro: {{model.title}} Posicion en el listado: {{model.count}} </span> {{/each}}
//
JSkeleton.Application.factory('BookCatalogue', {
    routes: {
        'book/show/:title(/:id)': {
            viewControllerClass: 'DetalleDeLibro',
            // name: 'home:navigate',
            // triggerEvent: ''
            // viewControllerOptions: {
            //     model: MiModel
            // },
            eventListener: 'book:details'
        },
        'book/list': {
            handlerName: 'ListBooks',
            viewControllerClass: 'ListadoDeLibros',
            eventListener: 'book:list',
            template: '{{#if context.isPromise }} <span> spinner </span> {{else}} <span> Listado de libros: </span>  {{@component "BookCollectionView" collection=context.bookCollection}} {{/if}}'
        }
    }
});

JSkeleton.Service.factory('ServicioDeLibros', {
    initialize: function() {
        console.log('Soy my servicio');
    },
    buy: function(book) {
        console.log('Libro comprado: ', book.get('title'));
    }
});

var Layout = JSkeleton.ViewController.factory('MainViewController', {
    regions: {
        headerRegion: '.header',
        contentRegion: '.content',
        footerRegion: '.footer'
    },
    onStart: function() {

    }
});

var AppMain = JSkeleton.Application.extend({
    el: '.app-container',
    layout: {
        layoutClass: 'MainViewController',
        template: '<div class="hero-unit">' +
            '<h1>Aplicación de libros</h1>' +
            '<h3> Header: </h3>' +
            '<div class="header"></div>' +
            '<h3> Contenido: </h3>' +
            '<div class="content"></div>' +
            '<h3> Footer: </h3>' +
            '<div class="footer"></div>' +
            '</div>'
    },
    applications: {
        'bookCatalogue': {
            applicationClass: 'BookCatalogue',
            region: 'contentRegion'
        }
    },
    routeFilters: function(_routeParams) {
        console.log('params: ', _routeParams);
        //return {error : "error"};
    },
    onFilterError: function(err, _routeParams) {
        if (err) console.log(err);
    },
    middlewares: function(_routeParams) {
        console.log("middleware ejecutado");
    }
});

// var Login = JSkeleton.Component.factory('LoginComponent', ['LoginService'], function(login) {
//     return {
//         defaults: {

//         },
//         itemView: ,
//         collectionView: ,
//         regions: {
//             'aside': '.login-aside',
//             'content': '.login-content'
//         },
//         template: '<div class="login"> User-login <div class="login-aside"></div> <div class="login-content"></div>',
//         initialize: function(options) {
//             options = options || {};

//             if (!options.userModel) {
//                 throw new Error('');
//             }
//         },
//         context: function() {
//             this.context = this.options.userModel;
//         }
//     };
// });

var app = new AppMain();

// app.router.route("*notFound", "page", function() {
//     console.log("404 error", arguments);
// });

app.start();