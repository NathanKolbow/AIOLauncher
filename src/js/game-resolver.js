const { readFileSync } = require('fs');

// Fetch the collection
const collection = document.getElementById('distributor-collection');

// Fetch the settings map
const map = JSON.parse(readFileSync('src/config/map.json', 'utf-8'));
const games = map['games'];


// Sort games alphabetically
games.sort((a, b) => {
    return a.title.localeCompare(b.title);
});

// Right now everything is just put into a singular row
// TODO: Make different functions for choosing different sortings,
//       arranging into multiple rows based off of things like provider, etc.
var row = document.createElement('div');
row.className = 'row';

for(k = 0; k < games.length; k++) {
    var game = games[k];

    var col = document.createElement('div');
    col.className = 'col s1';
    
    var span = document.createElement('span');
    span.className = 'flow-text';

    var wrapper = document.createElement('div');
    wrapper.id = 'wrap';
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
    if(game['main-image'] != null) {
        var over_img = document.createElement('img');
        over_img.className = 'normal';
        over_img.src = game['main-image'];

        img_wrap.appendChild(over_img);
    }
    if(game['main-image'] != null) {
        var under_img = document.createElement('img');
        under_img.className = 'blur';
        under_img.src = game['main-image'];

        img_wrap.appendChild(under_img);
    }

    var back_text = document.createElement('p');
    back_text.className = 'flow-text';
    

    wrapper.appendChild(placeholder);
    wrapper.appendChild(img_wrap);
    col.append(wrapper);
    row.appendChild(col);
}

collection.appendChild(row);