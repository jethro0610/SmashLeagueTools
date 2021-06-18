const fs = require('fs');

var preregInfo = {
    preregTitle: undefined,
    preregDate: undefined,
    hasReg: undefined
}

const getPreRegInfo = () => {
    return preregInfo;
}

const initInfoJson = () => {
    fs.readFile('./prereg.json', (err, data) => {
        if (err) throw err;
        const info = JSON.parse(data);
        preregInfo = info;
    })
}
initInfoJson();

const setPreRegInfo = (preregTitle, preregDate, hasReg, callback) => {
    const info = {
        preregTitle, 
        preregDate,
        hasReg
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