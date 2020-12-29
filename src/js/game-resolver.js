const { readFileSync } = require('fs');

// Fetch the collection
const collection = document.getElementById('distributor-collection');

// Fetch the settings map
const map = JSON.parse(readFileSync('src/config/map.json', 'utf-8'));
const distributors = map['distributor'];

for(i = 0; i < distributors.length; i++) {
    var provider = distributors[i]['name'];
    var libraries = distributors[i]['libraries'];

    for(j = 0; j < libraries.length; j++) {
        var lib = libraries[j];
        var games = lib['games'];
        var row = document.createElement('div');
        row.className = 'row';

        for(k = 0; k < games.length; k++) {
            var game = games[k];

            var col = document.createElement('div');
            col.className = 'col s2';
            
            var span = document.createElement('span');
            span.className = 'flow-text';

            var wrapper = document.createElement('div');
            wrapper.id = 'wrap';
            var placeholder = document.createElement('img');
            placeholder.className = 'placeholder';
            placeholder.src = 'resources/placeholder.png';
            var img_wrap = document.createElement('div');
            img_wrap.id = 'img_wrap';
            var over_img = document.createElement('img');
            over_img.className = 'normal';
            over_img.src = game['main-image'];

            var under_img = document.createElement('img');
            under_img.className = 'blur';
            under_img.src = game['main-image'];

            if(game['logo-image'] != "null") {
                var logo_img = document.createElement('img');
                logo_img.className = 'logo';
                logo_img.src = game['logo-image'];

                img_wrap.appendChild(logo_img);
            }

            img_wrap.appendChild(over_img);
            img_wrap.appendChild(under_img);
            wrapper.appendChild(placeholder);
            wrapper.appendChild(img_wrap);
            col.append(wrapper);
            row.appendChild(col);
        }

        var header = document.createElement('h2');
        header.innerHTML = provider.toUpperCase();
        header.className = 'dist-title';

        var divider = document.createElement('div');
        divider.className = 'divider';
        collection.append(header);
        collection.appendChild(divider);

        collection.appendChild(row);
    }
}