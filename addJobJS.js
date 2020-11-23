// const editJobMenu = (datas) => Markup.inlineKeyboard(
//     datas.map(data => {
//         return [Markup.callbackButton(
//             data.name,
//             'edit|' + data.name + ";" + data.token
//         )]
//     }))
//     .resize()
//     .extra()

const Telegraf = require('telegraf')
const WizardScene = require('telegraf/scenes/wizard')

var { between, writeFileJSON } = require('./function');

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
        ctx.wizard.state.data.id = between(1, 1000);
        ctx.wizard.state.data.token = ctx.message.text;
        var string =
            `ID        :  ${ctx.wizard.state.data.id}\n` +
            `Job Name  :  ${ctx.wizard.state.data.name}\n` +
            `Job Token : ${ctx.wizard.state.data.token}\n` +
            `Status    : ${writeFileJSON(ctx.wizard.state.data)}`;
        ctx.reply(string);
        return ctx.scene.leave();
    }
);

module.exports = { addJobScene };