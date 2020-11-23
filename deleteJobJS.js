const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

var { deleteFileJSON } = require('./function');

// bot.action(/delete/, (ctx) => {
//     datasEdit.id = ctx.match.input.split("|")[1].split(";")[0];
//     var string =
//         `Status    : ${deleteFileJSON(datasEdit)}`;
//     ctx.reply(string);
// })
const deleteJobMenu = (datas) => Markup.inlineKeyboard(
    datas.map(data => {
        return [Markup.callbackButton(
            data.name,
            'delete|' + data.id
        )]
    }))
    .resize()
    .extra()

// const deleteJobScene = new WizardScene('delete-job',
//     (ctx) => {
//         ctx.reply(
//             `Hello ${ctx.from.first_name}, would you like to choose the job?`,
//             deleteJobMenu(readFileJSON())
//         );
//         return ctx.wizard.next()
//     },
//     stepHandler,
//     (ctx) => {
//         console.log(datasEdit);
//         var string =
//             `Status    : ${deleteFileJSON(datasEdit)}`;
//         ctx.reply(string);
//         return ctx.scene.leave()
//     }
// )

module.exports = { deleteJobMenu };