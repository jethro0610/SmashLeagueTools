const fs = require('fs');

var preregInfo = {
    preregTitle: undefined,
    preregDate: undefined
}

const getPreRegInfo = () => {
    return preregInfo;
}

const initInfoJson = () => {
    fs.readFile('./prereg.json', (err, data) => {
        if (err) throw err;
        const info = JSON.parse(data);
        preregInfo = info;
        console.log(preregInfo);
    })
}
initInfoJson();

const setPreRegInfo = (preregTitle, preregDate, callback) => {
    const info = {
        preregTitle, 
        preregDate
    }
    preregInfo = info;
    fs.writeFile('./prereg.json', JSON.stringify(info, null, 2), (err) => {
        if (err) throw err;

        if(callback)
            callback(info);
    });
}

module.exports = {
    setPreRegInfo,
    getPreRegInfo,
    setPreRegInfo
} 