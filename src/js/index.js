// requires
const { remote, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { set_theme } = require(path.resolve(`${remote.app.getAppPath()}/src/js/theme-handler`));
const $ = require('jquery');
const coll = require(path.resolve(`${remote.app.getAppPath()}/src/js/collection-manager`));
const { map, reload_map } = require(path.resolve(`${remote.app.getAppPath()}/src/js/application-launcher`));
const { scan } = require(path.resolve(`${remote.app.getAppPath()}/src/js/scan`));


var window = remote.getCurrentWindow();

remote.getCurrentWindow().setMinimumSize(500, 200);
function game_sort_abc(a, b) {
    // a_t = a.title.trim();
    // if(a_t.substring(0, 3).toLowerCase() == 'the')
    //     a_t = a_t.substring(4, a_t.length - 1).trim();
    // if(a_t.substring(0, 11).toLowerCase() == 'sid meier\'s')
    //     a_t = a_t.substring(11, a_t.length - 1).trim();

    // b_t = b.title.trim();
    // if(b_t.substring(0, 3).toLowerCase() == 'the')
    //     b_t = b_t.substring(4, b_t.length - 1).trim();
    // if(b_t.substring(0, 11).toLowerCase() == 'sid meier\'s')
    //     b_t = b_t.substring(12, b_t.length).trim();

    return a.title.localeCompare(b.title);
}

function goto(page) {
    // Hide content not on the page we just went to
    if(page != 'library') {
        $('.library').hide();
        filter_box.close();
        sort_box.close();
        filter_box.options['open'] = false;
        sort_box.options['open'] = false;
        $('.tabs.library .tab a').removeClass('live');
    }
    if(page != 'settings') {
        $('.settings').hide();
    }

    // Show all the content on the page we're accessing
    $('.' + page).show();
    // Change buttons
    $('.btn-large').removeClass('current').addClass('not-current');
    $('.btn-' + page).removeClass('not-current').addClass('current');

    if(page == 'settings') {
        $('.settings.manifests').hide();
        $('.settings.general').show();

        $('.live').removeClass('live');
        $('#general-button').addClass('live');
    } else if(page == 'library') {
        coll.load_library(game_sort_abc, (game) => { return true; });
    }
}

function tab_click(tab) {
    $('.tab a.live').removeClass('live');
    $('.tab.' + tab + ' a').addClass('live');

    if(tab == 'filter') {
        if($('#filter-box li.active')[0] != null) {
            filter_box.close();
            $('.tab.filter a').removeClass('live');
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
    } else if(tab == 'sort') {
        if($('#sort-box li.active')[0] != null) {
            sort_box.close();
            $('.tab.sort a').removeClass('live');
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
    } else if(tab == 'general') {
        $('#settings-manifests').hide();
        $('#settings-general').show();
    } else if(tab == 'manifests') {
        $('#settings-general').hide();
        $('#settings-manifests').show();
    }
}

function write_map_sync() {
    fs.writeFileSync(path.resolve(`${remote.app.getAppPath()}/src/config/map.json`), JSON.stringify(map, null, 2), (err) => {
        if(err) throw err;
    });
}

// Toggle enabling static grid images
function toggle_static() {
    if($('#static-check')[0]['checked'] && !$('#animated-check')[0]['checked']) return;
    $('#animated-check').attr('disabled', $('#static-check')[0]['checked'])
    map['settings']['grids']['static'] = !$('#static-check')[0]['checked'];
    write_map_sync();
}

// Toggle enabling animated grid images
function toggle_animated() {
    if(!$('#static-check')[0]['checked'] && $('#animated-check')[0]['checked']) return;
    $('#static-check').attr('disabled', $('#animated-check')[0]['checked'])
    map['settings']['grids']['animated'] = !$('#animated-check')[0]['checked'];
    write_map_sync();
}

// Toggle NSFW content
function toggle_nsfw() {
    map['settings']['grids']['nsfw'] = $('#nsfw-check')[0]['checked'];
    write_map_sync();
}

// Open map.json
function open_config() {
    shell.openPath(path.resolve(`${__dirname}/config/map.json`));
}

// Do a full manifest scan
function full_scan() {
    $('#found-field')[0].innerHTML = "Scanning...";

    reload_map();
    var dirs = map['manifest-directories'];
    for(i = 0; i < dirs.length; i++) {
        scan(dirs[i]['directory'], dirs[i]['provider']);
    }
}


// Code for making everything visible after doc is loaded
$(() => {
    $('#animated-check').prop('checked', map['settings']['grids']['animated']);
    $('#static-check').prop('checked', map['settings']['grids']['static']);
    if(!(map['settings']['grids']['static'] && map['settings']['grids']['animated'])) {
        if(map['settings']['grids']['static'])
            $('#static-check').attr('disabled', true);
        else
            $('#animated-check').attr('disabled', true);
    }
    $('#nsfw-check').prop('checked', map['settings']['grids']['nsfw']);

    $('.settings').hide();
    coll.load_library(game_sort_abc, (game) => { return true; });
});