// READ MANIFESTS TO READ SHIT, SO MUCH EASIER THAT WAY ACTUALLY OH MY GOD THANK GOODNESS I FOUND THAT LMAOOOOO
// STEAM MANIFESTS: steamapps\appmanifest_{APPID}.acf
// EPIC MANIFESTS: C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests\{STRING}.item
//
// Images: Hopefully findable through manifests?  Steam can probably download just via IDs
// - epic dest: C:\Program Files (x86)\Epic Games\Launcher\Portal\SysFiles



// For epic:
// Managed to resolve the issue. Within the main Subnautica game folder 
// there is a folder there is a file called .egstore where the MANIFEST file is located.
// I simply renamed this folder, restarted Epic Launcher, and it gave me the option to 
// reinstall the game. All good now!
//
// Maybe try doing this with a game or just installing a free game and trying to catch something in .egstore/ during the staging phase?

// C:\Users\Nathan\AppData\Local\EpicGamesLauncher\Saved\webcache_4147\IndexedDB\https_www.epicgames.com_0.indexeddb.leveldb

const fs = require('fs');
const { resolve_epic, resolve_steam } = require(path.resolve(`${remote.app.getAppPath()}/src/js/image-resolver`));

async function scan(manifest_dir, provider) {    
    var promise = new Promise((resolve, reject) => {
        return fs.promises.readdir(manifest_dir, (err, files) => {
            if(err) reject(err);
            else resolve(files);
        })
    });

    promise.then((files) => {
        var games = [];
        files.forEach(async (file) => {
            if(provider == 'Epic' && !file.endsWith('.item'))
                return;
            if(provider == 'Steam' && !file.endsWith('.acf'))
                return;

            if(manifest_exists(path.join(manifest_dir, file)))
                return;

            var out = fs.readFileSync(path.join(manifest_dir, file)).toString();
            if(provider == 'Epic') {
                out = JSON.parse(out);
                out['name'] = out['DisplayName'];
            } else if(provider == 'Steam') {
                let _search = out.indexOf('"appid"') + 7;
                let quote_count = 0;
                let _indeces = [];
                while(quote_count < 2) {
                    _search++;
                    if(out[_search] == '"') {
                        quote_count++;
                        _indeces.push(_search);
                    }
                }

                _search = out.indexOf('"name"') + 6;
                quote_count = 0;
                let _first = -1;
                while(quote_count < 2) {
                    _search++;
                    if(out[_search] == '"') {
                        quote_count++;
                        _indeces.push(_search);
                    }
                }

                out = {
                    'appid': out.substring(_indeces[0]+1, _indeces[1]),
                    'name' : out.substring(_indeces[2]+1, _indeces[3])
                }
            }
            
            if(out['LaunchExecutable'] == "")
                return;

            var promise = (provider == 'Epic')  ? resolve_epic(out['CatalogItemId'], out['DisplayName'])
                        : (provider == 'Steam') ? resolve_steam(out['appid'], out['name'])
                        : null;
            promise.then((obj) => {
                obj['provider'] = provider;
                obj['manifest'] = path.join(manifest_dir, file);
                obj['title'] = out['name'];

                $('#found-field')[0].innerHTML = "Discovered " + obj['title'] + ' (' + obj['provider'] + ')';

                var json = JSON.parse(fs.readFileSync(path.resolve(`${remote.app.getAppPath()}/src/config/map.json`)));
                json['games'].push(obj);
                fs.writeFileSync(path.resolve(`${remote.app.getAppPath()}/src/config/map.json`), JSON.stringify(json, null, 2));
            });
        });
    })
    .catch(error => {
        console.warn("Caught error when scanning.");
        console.error(error);
    });
}

function manifest_exists(manifest) {
    var json = JSON.parse(fs.readFileSync(path.resolve(`${remote.app.getAppPath()}/src/config/map.json`)));
    for(i = 0; i < json['games'].length; i++) {
        if(json['games'][i]['manifest'] == manifest)
            return true;
    }
    return false;
}

module.exports.scan = scan;