const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const Markup = require("telegraf/markup");
const fs = require('fs');
const request = require('request');
var http = require('http');
var curl = require('curl-cmd');
const validUrl = require('valid-url');


var user = '2359';
var pass = '2359qa';
var host = "3.1.15.19";

var datasEdit = {}

const bot = new Telegraf("631171922:AAHjQlxw5sjnj4--XI72dkqANgADy3Ib5Fw") // get the token from envirenment variable

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const writeFileJSON = (data) => {
    try {
        let rawdata = fs.readFileSync('myjsonfile.json', 'utf8');
        let object = JSON.parse(rawdata);
        object.push(data); //add some data
        let json = JSON.stringify(object); //convert it back to json
        fs.writeFileSync('myjsonfile.json', json, 'utf8'); // write it back 
        return "Saved!"
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

const runJobMenu = (datas, chatID) => Markup.inlineKeyboard(
    datas.map(data => {
        return [Markup.callbackButton(
            data.name,
            'url|' + data.name + ";" + data.token + ";" + chatID
        )]
    }))
    .resize()
    .extra()

const editJobMenu = (datas) => Markup.inlineKeyboard(
    datas.map(data => {
        return [Markup.callbackButton(
            data.name,
            'edit|' + data.name + ";" + data.token
        )]
    }))
    .resize()
    .extra()

const addJobScene = new WizardScene(
    'add-job',
    ctx => {
        ctx.reply("OK. Send me a the job description");
        ctx.reply('Enter job name');
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.data.name = ctx.message.text;
        ctx.reply('Enter job token');
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.data.token = ctx.message.text;
        // if (validUrl.isUri(ctx.wizard.state.data.token)) {
        //     ctx.wizard.next();
        //     ctx.wizard.steps[ctx.wizard.cursor](ctx);
        // }
        // else {
        //     ctx.reply('Not a URI');
        // }
    },
    ctx => {
        ctx.wizard.state.data.id = between(1, 1000);
        var string =
            `ID        :  ${ctx.wizard.state.data.id}\n` +
            `Job Name  :  ${ctx.wizard.state.data.name}\n` +
            `Job Token : ${ctx.wizard.state.data.token}\n` +
            `Status    : ${writeFileJSON(ctx.wizard.state.data)}`;
        ctx.reply(string);
        return ctx.scene.leave();
    }
);

const editJobScene = new WizardScene(
    'edit-job',
    ctx => {
        ctx.reply(
            `Hello ${ctx.from.first_name}, would you like to choose the job?`,
            editJobMenu(readFileJSON())
        );
        // return ctx.scene.leave();
        // return ctx.wizard.next();
    },
    // ctx => {
    //     ctx.wizard.state.data.name = ctx.message.text;
    //     ctx.reply('Enter job url');
    //     return ctx.wizard.next();
    // },
    // ctx => {
    //     ctx.wizard.state.data.url = ctx.message.text;
    //     if (validUrl.isUri(ctx.wizard.state.data.url)) {
    //         ctx.wizard.next();
    //         ctx.wizard.steps[ctx.wizard.cursor](ctx);
    //     }
    //     else {
    //         ctx.reply('Not a URI');
    //     }
    // },
    ctx => {
        // ctx.wizard.state.data.id = between(1,1000);
        var string =
            `ID        :  ${datasEdit.id}\n` +
            `Job Name  :  ${datasEdit.name}\n` +
            `Job Token : ${datasEdit.token}\n`;
        // `Status    : ${writeFileJSON(ctx.wizard.state.data)}`;
        ctx.reply(string);
        return ctx.scene.leave();
    }
);

const stage = new Stage([addJobScene, editJobScene]);

// stage.action(/edit/, ctx => {
//     console.log(ctx.match.input.toString());
//     datasEdit = ctx.match.input.split("|")[1].split(";");
//     console.log(datasEdit[0]);
//     return ctx.wizard.next();
// })
stage.action("BACK", ctx => {
    return ctx.wizard.back();
});

stage.action("PROCEED", ctx => {
    return ctx.wizard.next();
});

bot.use(session());
bot.use(stage.middleware());
// bot.use(editStage.middleware());
// bot.use(stage.middleware());

//command
bot.command('addjob', ctx => {
    ctx.scene.enter('add-job');
});

bot.command('checkjob', ctx => {
    ctx.reply(readJSON());
});

bot.command('runjob', ctx => {
    ctx.reply(
        `Hello ${ctx.from.first_name}, would you like to choose the job?`,
        // testMenu
        runJobMenu(readFileJSON(), ctx.message.chat.id)
    );
});

bot.command('deletejob', ctx => {
    ctx.scene.enter('del-job');

});

bot.command('editjob', ctx => {
    ctx.scene.enter('edit-job');
});

bot.action(/url/, ctx => {
    var datas = ctx.match.input.split("|")[1].split(";");
    console.log(datas[0]);

    var auth = new Buffer(user + ':' + pass).toString('base64');
    var options = {
        host: host,
        port: 80,
        path: '/job/' + datas[0] + '/buildWithParameters?token=' + datas[1] + '&PARAMETER=' + datas[2],
        headers: {
            'Authorization': 'Basic ' + auth
        }
    };

    http.request(options, function (res) {
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
        if (res.statusCode == 201) {
            ctx.reply("Please wait, you will got the result on this chat")

        } else {
            ctx.reply("Sorry, there are an error, please call your QA")

        }
    }).end();
})


bot.launch();