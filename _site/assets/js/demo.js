//Spinner
$('.btn--spinner-demo--a').on('click', function() {
    $('.demo--a').spinner('show');
});

$('.btn--spinner-clear-a').on('click', function() {
    $('.demo--a').spinner('hide');
});

$('.btn--spinner-demo--b').on('click', function() {
    $('.demo--b').spinner({
        text: 'Loading...',
        spinnerClass: 'spinner__element--simple'
    });

    $('.demo--b').spinner('show');
});

$('.btn--spinner-clear-b').on('click', function() {
    $('.demo--b').spinner('hide');
});

$('.btn--spinner-body').on('click', function() {
    $('body').spinner({
        text: 'Loading...',
        show: true,
        closeable: true
    });
    setTimeout(function () { $('body').spinner('hide') }, 2000);
});

// Utils
$(document).on('click', '[data-toggle]', function() {
    var target = $($(this).attr('data-toggle'))
    actualText = ''
    newText = '';

    if (target.hasClass('show')) {
        actualText = "box show";
        newText = "box hide";
    } else {
        actualText = "box hide";
        newText = "box show";
    }

    $('#toggling-content span.s').each(function() {
        var text = $(this).text();
        text = text.replace(actualText, newText);
        $(this).text(text);
    });

    $($(this).attr('data-toggle')).toggleClass('hide').toggleClass('show');

});