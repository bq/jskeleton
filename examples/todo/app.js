 'use strict';

 Jskeleton.ItemView.factory('DetailBookView', {
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

 var ItemBookView = Jskeleton.ItemView.extend({
     template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
         '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
         '<strong> Identificador del libro: </strong><span class="id">{{id}}</span> <button class="view-action"> Ver detalles </button>',
     events: {
         'click .view-action': 'onActionClicked'
     },
     onActionClicked: function() {
         this.channel.trigger('book:details', {
             id: this.model.get('id'),
             title: this.model.get('title'),
             author: this.model.get('author')
         });
     }
 });


 var BookCollectionView = Jskeleton.CollectionView.factory('BookCollectionView', {
     childView: ItemBookView
 });

 Jskeleton.ViewController.factory('DetalleDeLibro', function(ServicioDeCompras, _channel) {
     return {
         events: {
             'action @component.DetailBookView': 'onActionClicked',
             'navigate @component.DetailBookView': 'onNavigateClicked'
         },
         onActionClicked: function(libro) {
             ServicioDeCompras.buy(libro);
         },
         onNavigateClicked: function() {
             _channel.trigger('book:list');
         },
         onBookShow: function(params, service) {
             this.context.bookModel = new Backbone.Model({
                 title: params.title,
                 id: params.id,
                 author: params.author || 'desconocido'
             });
         }
     };
 });

 Jskeleton.ViewController.factory('ListadoDeLibros', function(_channel) {
     return {
         events: {
             'childview:navigate @component.BookCollectionView': 'onNavigateClicked'
         },
         onNavigateClicked: function(childview, model) {
             _channel.trigger('book:details', {
                 id: model.get('id'),
                 description: model.get('description'),
                 title: model.get('title')
             });
         },
         ListBooks: function() {

             this.context.bookCollection = new Backbone.Collection([{
                 title: 'Juego de tronos',
                 id: 165
             }, {
                 title: 'El hobbit',
                 id: 170
             }, {
                 title: 'Cien años de soledad',
                 id: 14
             }]);
         }
     };
 });

 Jskeleton.ChildApplication.factory('BookCatalogue', {
     routes: {
         'book/show/:title(/:id)': {
             viewControllerClass: 'DetalleDeLibro',
             template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
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
             template: '<span> Listado de libros: </span> {{@component name="BookCollectionView" collection=context.bookCollection}}'
         }
     },
     events: {
         triggers: [
             'book:details',
             'book:list'
         ]
         // listen: [
         // 'all'
         // ]
     }
 });

 Jskeleton.Service.factory('ServicioDeCompras', {
     initialize: function() {
         console.log('Soy my servicio');
     },
     buy: function(book) {
         console.log('Libro comprado: ', book.get('title'));
     }
 });

 var Layout = Jskeleton.LayoutView.extend({
     regions: {
         headerRegion: '.header',
         contentRegion: '.content',
         footerRegion: '.footer'
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
             applicationClass: 'BookCatalogue',
             region: 'contentRegion'
         }
     }
 });

 var app = new AppMain();

 // app.router.route("*notFound", "page", function() {
 //     console.log("404 error", arguments);
 // });

 app.start();