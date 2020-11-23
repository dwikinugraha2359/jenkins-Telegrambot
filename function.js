const fs = require('fs');

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const writeFileJSON = (data) => {
    try {
        let object = readFileJSON();
        object.push(data); //add some data
        let json = JSON.stringify(object); //convert it back to json
        fs.writeFileSync('myjsonfile.json', json, 'utf8'); // write it back 
        return "Saved!"
    } catch (err) {
        // console.error(err)
        return err
    }
};

const editFileJSON = (data) => {
    try {

        let object = readFileJSON();

        // edit data
        object.map(obj => {
            if (obj.id == data.id) {
                obj.name = data.name;
                obj.token = data.token
            }
        })

        let json = JSON.stringify(object); //convert it back to json
        fs.writeFileSync('myjsonfile.json', json, 'utf8'); // write it back 
        return "Edited!"
    } catch (err) {
        // console.error(err)
        return err
    }
};

const deleteFileJSON = (data) => {
    try {
        console.log("===========");
        console.log(data);
        let object = readFileJSON();
        console.log("===========");
        console.log(object);
        // delete data
        // object.filter((obj) => { return obj.id !== data });
        object.forEach((obj, index) => {
            if (obj.id == data) {
                object.splice(index, 1)
            }
        });
        console.log("===========");
        console.log(object);

        let json = JSON.stringify(object, null, 2); //convert it back to json
        fs.writeFileSync('myjsonfile.json', json, 'utf8'); // write it back 
        return "Deleted!"
    } catch (err) {
        // console.error(err)
        return err
    }
};

const readFileJSON = () => {
    try {
        let rawdata = fs.readFileSync('myjsonfile.json', 'utf8');
        let data = JSON.parse(rawdata);
        return data
    } catch (err) {
        // console.error(err)
        return err
    }
};
const readJSON = () => {
    try {
        let data = readFileJSON();
        var text = "Job List :";
        for (i in data) {
            text += "\n " + data[i].name + " - " + data[i].token;
        }
        console.log(text);
        return text
    } catch (err) {
        // console.error(err)
        return err
    }
};

module.exports = { readJSON, writeFileJSON, between, readFileJSON, editFileJSON, deleteFileJSON };