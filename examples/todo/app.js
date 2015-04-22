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
    onStateChange: function( /*Service, route*/ ) {
        this.context.ViewControllerData = 'ViewControllerData';
    },
    pepe: function() {

    }
});

var AppHero = Jskeleton.Application.extend({
    //ServiceClass: Service,
    routes: {
        'home': {
            viewControllerClass: ViewController,
            // viewControllerOptions: {
            //     model: MiModel
            // },
            template: '<h5> AppHero route handler {{example}} </h5>'
        }
    },
    events: {
        'app:hero:show': {
            viewControllerClass: ViewController,
            template: '<h5> AppHero event handler </h5>'
        }
    }
});


var AppMain = Jskeleton.Application.extend({
    rootEl: '.app-container',
    layout: {
        template: '<h3> Content: </h3> <div class="content"></div> <h3> Footer: </h3> <div class="footer"></div>',
        layoutClass: Layout
    },
    applications: {
        'hero': {
            appClass: AppHero,
            region: 'contentRegion'
        }
    }
});

var app = new AppMain();

app.start();
