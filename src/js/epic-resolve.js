const fetch = require('node-fetch');

async function resolve_epic(itemId) {
    var url = 'https://raw.githubusercontent.com/EpicData-info/items-tracker/master/database/items/' + itemId + '.json'
    
    var response = await fetch(url);
    var data = await response.json();

    var returnData = {};
    var images = data['keyImages'];
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

    return returnData;
}

console.log(resolve_epic('25b771db01554b1bb40c5617b663d17e'));