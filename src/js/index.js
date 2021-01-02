// requires
const { remote } = require('electron');
const $ = require('jquery');

var window = remote.getCurrentWindow();

remote.getCurrentWindow().setMinimumSize(500, 200);
remote.getCurrentWindow().on('resize', (size) => {
    var width = remote.getCurrentWindow().getSize()[0];
    console.log(width);
    if(width > 1550) {
        $('.col').removeClass('s1').removeClass('s2').removeClass('s3').addClass('s1');
    } else if(width > 1000) {
        $('.col').removeClass('s1').removeClass('s2').removeClass('s3').addClass('col s2');
    } else if(width > 900) {
        $('.col').removeClass('s1').removeClass('s2').removeClass('s3').addClass('col s3');
    }
});

function set_light_theme() {
    $('.theme-secondary').removeClass('grey darken-3').addClass('grey lighten-3');
    $('.theme-primary').removeClass('grey darken-4').addClass('white');
    $('.theme-accent-text').removeClass('white-text').addClass('black-text');
}

function set_dark_theme() {
    $('.theme-secondary').removeClass('grey lighten-3').addClass('grey darken-3');
    $('.theme-primary').removeClass('white').addClass('grey darken-4');
    $('.theme-accent-text').removeClass('black-text').addClass('white-text');
}

function game_sort_abc(a, b) {
    var a_t = (a.title.substring(0, 3).toLowerCase() == 'the')
            ? a.title.substring(4, a.title.length-1)
            : a.title;
    var b_t = (b.title.substring(0, 3).toLowerCase() == 'the')
            ? b.title.substring(4, b.title.length-1)
            : b.title;

    return a_t.localeCompare(b_t);
}

// Code for making everything visible after doc is loaded
$(() => {
    load_library(game_sort_abc, (game) => { return true; });
    set_dark_theme();
});

module.exports.set_dark_theme = set_dark_theme;
module.exports.set_light_theme = set_light_theme;