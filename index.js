const express = require('express');
const router = express();
const rp = require('request-promise');
const port = 5903;
const address_host = `http://localhost:3000`;

const optionsAllKit = function () {
    return {
        method: 'GET',
        uri: `${address_host}/kit`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
            'content-type': 'application/json; charset=utf-8'
        },
        json: true // Automatically parses the JSON string in the response
    };
};

const optionsAddLastDataKit = function (data) {
    return {
        method: 'POST',
        uri: `${address_host}/record`,
        body: data,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
            'content-type': 'application/json; charset=utf-8'
        },
        json: true // Automatically parses the JSON string in the response
    };
};

rp(optionsAllKit()).then((result) => {
    const allkit = [];
    result.kit.forEach(kit => {
        allkit.push(kit.KitID);
    });
    setInterval(() => {
        fakeDataKitFimo(allkit);
    }, 10*1000);
});

router.listen(port, () => {
    console.log(`server: ${port}`);
});

function fakeDataKitFimo(id) {
    // console.log(fakeRecordOneKit());
    id.forEach((KitID, index) => {
        rp(optionsAddLastDataKit(fakeRecordOneKit(KitID)))
            .then(result => {
                if(index === 9)
                    console.log(`(10s) Send Data Kit FIMO Message: ${result.msg}`);
            });
    });
}

function fakeRecordOneKit(KitID) {
    let temp = getRandomInt(20, 40),
        hud = getRandomInt(40, 80);
    const data = {
        "KitID": KitID,
        "Data": {
            "PM25": getRandomInt(40, 200),
            "Temperature": temp,
            "Humidity": hud,
            "PM1": getRandomInt(40, 250),
            "PM10": getRandomInt(250, 500)
        }
    };
    return data;
}

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}