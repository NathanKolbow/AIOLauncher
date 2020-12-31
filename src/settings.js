const { remote } = require('electron');

function switch_to_home() {
    remote.getCurrentWindow().loadFile(path.join(__dirname, 'index.html'));
}

module.exports.switch_to_home = switch_to_home;