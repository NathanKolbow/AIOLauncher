// requires
const { resolve } = require('path');
const { games, launch_game } = require(resolve(`${remote.app.getAppPath()}/src/js/application-launcher`));

var present_letters = [];
var scrollspy_instances;

/**
 * Empties the current game collection and then loads in a new set of games based on the sort and filter functions provided.
 * 
 * @param {*} sort_function     A function of the form `(a, b) => {...}` that returns an integer used to sort games;
 *                              `a` and `b` can be assumed to be a game entry as it appears in 'config/map.json'
 * @param {*} filter_function   A function of the form `(game) => {...}` that returns true or false used to filter games;
 *                              `game` can be assumed to be a game entry as it appears in 'config/map.json'
 */
function load_library(sort_function, filter_function) {
    // Clear the collection
    $('#distributor-collection').html("");

    // Fetch the collection
    const collection = document.getElementById('distributor-collection');

    // New var so that we don't override the master ledger
    // Filter the games
    var temp_games = games.filter(filter_function);
    // Sort the games
    temp_games.sort(sort_function);

    // Right now everything is just put into a singular row
    // TODO: Make different functions for choosing different sortings,
    //       arranging into multiple rows based off of things like provider, etc.
    var row = document.createElement('div');
    row.className = 'row game-row';

    var curr_letter = -1;
    for(k = 0; k < temp_games.length; k++) {
        var game = temp_games[k];

        var col = document.createElement('div');
        col.className = 'col s2 game ' + game['provider'];
        
        var span = document.createElement('span');
        span.className = 'flow-text';

        var wrapper = document.createElement('div');
        wrapper.className = 'wrap';
        let t = k;
        wrapper.onclick = function() { launch_game(t); };
        var placeholder = document.createElement('img');
        placeholder.className = 'placeholder';
        placeholder.src = 'resources/placeholder.png';
        var img_wrap = document.createElement('div');
        img_wrap.id = 'img_wrap';

        if(game['logo-image'] != null) {
            var logo_img = document.createElement('img');
            logo_img.className = 'logo';
            logo_img.src = game['logo-image'];

            img_wrap.appendChild(logo_img);
        }
        if(game['main-image'].length != 0) {
            var over_img = document.createElement('img');
            over_img.className = 'normal';
            over_img.src = game['main-image'][0];
            img_wrap.appendChild(over_img);

            var under_img = document.createElement('img');
            under_img.className = 'blur';
            under_img.src = game['main-image'][0];
            img_wrap.appendChild(under_img);
        } else if(game['steam-tall'] != null) {
            var over_img = document.createElement('img');
            over_img.className = 'normal';
            over_img.src = game['steam-tall'];
            img_wrap.appendChild(over_img);

            var under_img = document.createElement('img');
            under_img.className = 'blur';
            under_img.src = game['steam-tall'][0];
            img_wrap.appendChild(under_img);
        } else {
            var over_text = document.createElement('span');
            over_text.className = 'flow-text theme-accent-text game-title';
            over_text.innerHTML = game['title'];
            img_wrap.appendChild(over_text);
        }

        wrapper.appendChild(placeholder);
        wrapper.appendChild(img_wrap);
        col.append(wrapper);

        row.appendChild(col);
    }

    collection.appendChild(row);
  
    document.getElementById('filter-button').onclick = function() {
        if($('#filter-box li.active')[0] != null) {
            filter_box.close();
            filter_box.options['open'] = false;
        } else {
            if(sort_box.options['open']) {
                var dur = sort_box.options['outDuration'];
                sort_box.options['outDuration'] = 0;
                sort_box.close();
                sort_box.options['outDuration'] = dur;
                sort_box.options['open'] = false;

                dur = filter_box.options['inDuration'];
                filter_box.options['inDuration'] = 0;
                filter_box.open();
                filter_box.options['inDuration'] = dur;
            } else {
                filter_box.open();
            }

            filter_box.options['open'] = true;
        }
    };
    document.getElementById('sort-button').onclick = function() {
        if($('#sort-box li.active')[0] != null) {
            sort_box.close();
            sort_box.options['open'] = false;
        } else {
            if(filter_box.options['open']) {
                var dur = filter_box.options['outDuration'];
                filter_box.options['outDuration'] = 0;
                filter_box.close();
                filter_box.options['outDuration'] = dur;
                filter_box.options['open'] = false;

                dur = sort_box.options['inDuration'];
                sort_box.options['inDuration'] = 0;
                sort_box.open();
                sort_box.options['inDuration'] = dur;
            } else {
                sort_box.open();
            }
            
            sort_box.options['open'] = true;
        }
    };
}

// Settings checkbox pressing handling
function toggle_all() {
    if($('.filter-box.all')[0].checked) {
        $('.filter-box.not-all').prop('checked', true).attr('disabled', 'disabled');
        $('.game').show();
    } else {
        $('.filter-box.not-all').removeAttr('disabled');
    }
}

function toggle_steam() {
    if($('.filter-box.steam')[0].checked) {
        $('.game.Steam').show();
    } else {
        $('.game.Steam').hide();
    }
}

function toggle_epic() {
    if($('.filter-box.epic')[0].checked) {
        $('.game.Epic').show();
    } else {
        $('.game.Epic').hide();
    }
}


module.exports.load_library = load_library;
module.exports.present_letters = present_letters;