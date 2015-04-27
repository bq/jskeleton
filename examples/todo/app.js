var Layout = Marionette.LayoutView.extend({
    regions: {
        contentRegion: '.content',
        footerRegion: '.footer'
    }
});

var Controller = Marionette.Controller.extend({
    navigate: function() {
        console.log('navigate controller');
    }
});


var ViewController = Jskeleton.ViewController.extend({
    onStateChange: function(params, service) {
        this.context.ViewControllerData = 'ViewControllerData';
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
            template: '<h5> AppHero route handler {{example}} </h5>',
            eventListener: 'book:details'
        }
    }
});


var AppMain = Jskeleton.Application.extend({
    rootEl: '.app-container',
    template: '<h3> Content: </h3> <div class="content"></div> <h3> Footer: </h3> <div class="footer"></div>',
    layout: Layout,
    applications: {
        'bookCatalogue': {
            appClass: BookCatalogue,
        }
    }
});

var app = new AppMain();

app.start();