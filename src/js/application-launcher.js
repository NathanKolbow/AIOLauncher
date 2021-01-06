const fs = require('fs');
const { tmpdir } = require('os');
const path = require('path');
const { exec } = require('child_process');

var map, games;

function reload_map() {
    map = JSON.parse(fs.readFileSync('src/config/map.json').toString());
    games = map['games'];
}
reload_map();

let tempfile = "";
function launch_game(index) {
    if(tempfile == "") {
        fs.mkdtemp(path.join(tmpdir(), 'aiol-'), (err, directory) => {
            if(err) throw err;
            tempfile = directory;
        });
    }

    var game = module.exports.games[index];
    if(game['provider'] == 'Epic') {
        var appId = JSON.parse(fs.readFileSync(game['manifest']).toString())['MainGameAppName'];

        var data = "[{000214A0-0000-0000-C000-000000000046}]\n" +
                    "Prop3=19,0\n" +
                    "[InternetShortcut]\n" +
                    "IDList=\n" +
                    "IconIndex=0\n" +
                    "URL=com.epicgames.launcher://apps/" + appId + "?action=launch&silent=true";

        fs.writeFileSync(path.join(tempfile, index.toString() + '.url'), data, (err) => {
            if(err) throw err;
        });
    } else if(game['provider'] == 'Steam') {
        var appId = game['manifest'].substring(game['manifest'].lastIndexOf('_')+1, game['manifest'].lastIndexOf('.acf'));

        var data = "[{000214A0-0000-0000-C000-000000000046}]\n" +
                "Prop3=19,0\n" +
                "[InternetShortcut]\n" +
                "IDList=\n" +
                "IconIndex=0\n" +
                "URL=steam://rungameid/" + appId;
        
        fs.writeFileSync(path.join(tempfile, index.toString() + '.url'), data, (err) => {
            if(err) throw err;
        });
    }

    exec(path.join(tempfile, index.toString() + '.url'));
}

module.exports.reload_map = reload_map;
module.exports.launch_game = launch_game;
module.exports.games = games;
module.exports.map = map;