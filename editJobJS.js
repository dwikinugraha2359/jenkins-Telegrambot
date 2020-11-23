const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

var { readFileJSON, editFileJSON } = require('./function');

var datasEdit = {};

const stepHandler = new Composer()
stepHandler.action(/edit/, (ctx) => {
  datasEdit.id = ctx.match.input.split("|")[1].split(";")[0];
  datasEdit.name = ctx.match.input.split("|")[1].split(";")[1];
  datasEdit.token = ctx.match.input.split("|")[1].split(";")[2];
  ctx.reply('Edit job name [' + datasEdit.name + ']');
  return ctx.wizard.next();
})
const editJobMenu = (datas) => Markup.inlineKeyboard(
  datas.map(data => {
    return [Markup.callbackButton(
      data.name,
      'edit|' + data.id + ";" + data.name + ";" + data.token
    )]
  }))
  .resize()
  .extra()

const editJobScene = new WizardScene('edit-job',
  (ctx) => {
    ctx.reply(
      `Hello ${ctx.from.first_name}, would you like to choose the job?`,
      editJobMenu(readFileJSON())
    );
    return ctx.wizard.next()
  },
  stepHandler,
  (ctx) => {
    datasEdit.name = ctx.message.text;
    console.log(datasEdit);
    ctx.reply('Edit job token [' + datasEdit.token + ']');
    return ctx.wizard.next()
  },
  (ctx) => {
    datasEdit.token = ctx.message.text;
    console.log(datasEdit);
    var string =
      `ID        :  ${datasEdit.id}\n` +
      `Job Name  :  ${datasEdit.name}\n` +
      `Job Token : ${datasEdit.token}\n` +
      `Status    : ${editFileJSON(datasEdit)}`;
    ctx.reply(string);
    return ctx.scene.leave()
  }
)

module.exports = { editJobScene };