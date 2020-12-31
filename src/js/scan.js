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
const path = require('path');
const { resolve_epic } = require('./js/image-resolver');

async function scan_epic(manifest_dir) {
    var promise = new Promise((resolve, reject) => {
        return fs.promises.readdir(manifest_dir, (err, files) => {
            if(err != null)
                reject(err);
            else 
                resolve(files);
        })
    });

    promise.then((files) => {
        var games = [];
        files.forEach(async (file) => {
            if(!file.endsWith('.item'))
                return;

            if(manifest_exists(path.join(manifest_dir, file)))
                return;

            var out = fs.readFileSync(path.join(manifest_dir, file)).toString();
            out = JSON.parse(out);
            
            if(out['LaunchExecutable'] == "")
                return;

            var epic_promise = resolve_epic(out['CatalogItemId'], out['DisplayName']);
            epic_promise.then((obj) => {
                obj['provider'] = 'epic';
                obj['manifest'] = path.join(manifest_dir, file);
                obj['title'] = out['DisplayName'];

                var json = JSON.parse(fs.readFileSync('src/config/map.json'));
                json['games'].push(obj);
                fs.writeFileSync('src/config/map.json', JSON.stringify(json, null, 2));
            })
        });
    });
}

function manifest_exists(manifest) {
    var json = JSON.parse(fs.readFileSync('src/config/map.json'));
    for(i = 0; i < json['games'].length; i++) {
        if(json['games'][i]['manifest'] == manifest)
            return true;
    }
    return false;
}