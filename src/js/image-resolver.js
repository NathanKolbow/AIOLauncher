const fetch = require('node-fetch');
const pako  = require('pako');

// This DB doesn't have every game's icon info, but it has a lot
async function resolve_epic(itemId, name) {
    var url = 'https://raw.githubusercontent.com/EpicData-info/items-tracker/master/database/items/' + itemId + '.json'
    
    var promise = new Promise((resolve, _) => {
        fetch(url).then(response => response.json())
        .then(json => {
            var returnData = {};
            var images = json['keyImages'];
            var item;
            for(i = 0; i < images.length; i++) {
                item = images[i];
                if(item['type'] == 'DieselGameBoxTall') {
                    returnData['main-image'] = item['url'];
                } else if(item['type'] == 'DieselGameBoxLogo') {
                    returnData['logo-image'] = item['url'];
                } else if(item['type'] == 'DieselGameBox') {
                    returnData['wide-image'] = item['url'];
                } else {
                    returnData['fake'] = "";
                }
            }

            resolve(returnData);
        })
        .catch(err => {
            resolve(resolve_epic_backup(name));
        });
    });

    return promise;
}

// If we couldn't get the game icons from the function above, we try to swipe
// them from Steam instead
async function resolve_epic_backup(name) {
    var tall_url = "https://www.steamgriddb.com/search/grids/600x900/all/all?term=" + name;
    var wide_url = "https://www.steamgriddb.com/search/grids/920x430/all/all?term=" + name;
    
    // Fetch the tall image
    var parser = new DOMParser();
    let doc;
    var tall_promise = new Promise((resolve, _) => {
        fetch(tall_url).then(response => response.blob())
        .then(blob => blob.text())
        .then(text => {
            doc = parser.parseFromString(text, 'text/html');
            text = doc.getElementsByClassName('thumb')[0].innerHTML;
            var _start = -1;
            for(var _end = 0; _end < text.length; _end++) {
                if(text[_end] == '"') {
                    if(_start == -1)
                        _start = _end + 1;
                    else
                        break;
                }
            }

            return fetch("https://www.steamgriddb.com" + text.substring(_start, _end));
        })
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(text => {
            doc = parser.parseFromString(text, 'text/html');
            resolve(doc.getElementsByClassName('btn dload')[0].href);
        });
    });

    // Fetch the wide image
    var wide_promise = new Promise((resolve, _) => {
        fetch(wide_url).then(response => response.blob())
        .then(blob => blob.text())
        .then(text => {
            doc = parser.parseFromString(text, 'text/html');
            text = doc.getElementsByClassName('thumb')[0].innerHTML;
            var _start = -1;
            for(var _end = 0; _end < text.length; _end++) {
                if(text[_end] == '"') {
                    if(_start == -1)
                        _start = _end + 1;
                    else
                        break;
                }
            }

            return fetch("https://www.steamgriddb.com" + text.substring(_start, _end));
        })
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(text => {
            doc = parser.parseFromString(text, 'text/html');
            resolve(doc.getElementsByClassName('btn dload')[0].href);
        });
    });

    return Promise.all([tall_promise, wide_promise]).then((values) => {
        return {
            "main-image": values[0],
            "wide-image": values[1]
        };
    });
}

exports.resolve_epic = resolve_epic;