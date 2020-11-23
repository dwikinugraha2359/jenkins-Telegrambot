const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')

const fs = require('fs');
const request = require('request');
var http = require('http');
var curl = require('curl-cmd');
const validUrl = require('valid-url');

var user = '2359';
var pass = '2359qa';
var host = "3.1.15.19";

// include other js
var { readJSON, between, writeFileJSON, readFileJSON, deleteFileJSON } = require('./function');
var { addJobScene } = require('./addJobJS');
var { runJobMenu } = require('./runJobJS');
var { editJobScene } = require('./editJobJS');
var { deleteJobMenu } = require('./deleteJobJS');

const bot = new Telegraf("631171922:AAHjQlxw5sjnj4--XI72dkqANgADy3Ib5Fw") // get the token from envirenment variable
const stage = new Stage([addJobScene, editJobScene]);

bot.use(session());
bot.use(stage.middleware());
// command
bot.command('checkjob', ctx => {
    ctx.reply(readJSON());
});

bot.command('addjob', ctx => {
    ctx.scene.enter('add-job');
});

bot.command('runjob', ctx => {
    ctx.reply(
        `Hello ${ctx.from.first_name}, would you like to choose the job?`,
        // testMenu
        runJobMenu(readFileJSON(), ctx.message.chat.id)
    );
});

bot.command('editjob', ctx => {
    ctx.scene.enter('edit-job');
});

bot.command('deletejob', ctx => {
    ctx.reply(
        `Hello ${ctx.from.first_name}, would you like to choose the job?`,
        // testMenu
        deleteJobMenu(readFileJSON())
    );
});

// Action
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


bot.action(/delete/, (ctx) => {
    datasID = ctx.match.input.split("|")[1].split(";")[0];
    var string =
        `Status    : ${deleteFileJSON(datasID)}`;
    ctx.reply(string);
})

bot.launch();
