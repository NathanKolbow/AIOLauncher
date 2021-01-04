const fetch = require('node-fetch');
const pako  = require('pako');

async function resolve_steam(appid, name) {
    var tall_url  = 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + appid + '/library_600x900_2x.jpg';
    var wide_url  = 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + appid + '/library_hero.jpg'
    var wide_logo = 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + appid + '/logo.png';

    return resolve_steamgrid(name)
    .then(obj => {
        obj['steam-tall'] = tall_url;
        obj['steam-wide'] = wide_url;
        obj['steam-wide-logo'] = wide_logo;
      
        return obj;
    })
    .catch(error => {
        console.error("Failed while fetching images for " + name);
        return {};
    });
}

// This DB doesn't have every game's icon info, but it has a lot
async function resolve_epic(itemId, name) {
    return resolve_steamgrid(name);

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
            resolve(resolve_steamgrid(name));
        });
    });

    return promise;
}

/**
 * Fetches game icons from SteamGridDB
 * 
 * @param {*} name  The name of the game
 * @param {*} type  'all', 'static', or 'animated'; defines which types of images are filtered for
 *                  in SteamGridDB
 */
async function resolve_steamgrid(name, type='static') {
    var tall_url = "https://www.steamgriddb.com/search/grids/600x900/all/" + type + "?term=" + name;
    var wide_url = "https://www.steamgriddb.com/search/grids/920x430/all/" + type + "?term=" + name;

    // Fetch the tall images
    var parser = new DOMParser();
    var tall_promise = fetch_grid_hrefs(tall_url);

    // Fetch the wide images
    var wide_promise = fetch_grid_hrefs(wide_url);

    return Promise.all([tall_promise, wide_promise]).then((values) => {
        return {
            "main-image": values[0],
            "wide-image": values[1]
        };
    });
}

/**
 * Returns a promise that resolves with a list image links
 * 
 * @param {string}  url         The url corresponding to the SteamGridDB to fetch icon hrefs from
 * @param {boolean} nsfw        Whether or not nsfw content should be allowed
 * @param {boolean} strict      Whether or not icons should be limited to grids with title that exactly
 *                              contain the name of the game; TODO: Implement this
 * @param {int}     n_grids     If not -1, we check the first `n_grids` grids; `strict` takes priority
 *                              over this and this takes priority over `n_titles`; TODO: Implement this
 * @param {int}     n_titles    If not -1, we check the first `n_titles` title containers; `strict` and
 *                              `n_grids` both take priority over this; TODO: Implement this
 */
function fetch_grid_hrefs(url, nsfw=false, strict=true, n_grids=-1, n_titles=-1) {
    var parser = new DOMParser();
    return new Promise((resolve, _) => {
        fetch(url).then(response => response.blob())
        .then(blob => blob.text())
        .then(text => {
            var doc = parser.parseFromString(text, 'text/html');
            var elems = doc.getElementsByClassName('thumb');
            var hrefs = [];
            text = "";

            if(!nsfw) {
                // IF NSFW CONTENT IS DISABLED
                for(i = 0; i < elems.length; i++) {
                    if(elems[i].innerHTML.indexOf('nsfw') == -1) {
                        for(j = 0; j < elems[i].children.length; j++) {
                            if(elems[i].children[j].tagName == "A") {
                                hrefs.push(elems[i].children[j].href);
                            }
                        }
                    }
                }
            } else {
                // IF NSFW CONTENT IS ENABLED
                for(i = 0; i < elems.length; i++) {
                    for(j = 0; j < elems[i].children.length; j++) {
                        if(elems[i].children[j].tagName == "A") {
                            hrefs.push(elems[i].children[j].href);
                        }
                    }
                }
            }

            var promises = [];
            for(i = 0; i < hrefs.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    fetch("https://www.steamgriddb.com" + hrefs[i].substring(hrefs[i].indexOf('/grid/'), hrefs[i].length))
                    .then(response => response.blob())
                    .then(blob => blob.text())
                    .then(text => {
                        var doc = parser.parseFromString(text, 'text/html')
                        resolve(doc.getElementsByClassName('btn dload')[0].href);
                    }).catch((error) => {
                        // Reject any single promise rejects every single promise in Promise.all(...), so
                        // we don't actually want to reject here
                        console.warn("Failed to fetch images at " + url);
                        resolve("");
                    });
                }));
            }

            Promise.all(promises).then((values) => {
                resolve(values);
            });
        });
    });
}

exports.resolve_epic = resolve_epic;
exports.resolve_steam = resolve_steam;