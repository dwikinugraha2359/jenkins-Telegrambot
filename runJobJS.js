const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

const runJobMenu = (datas, chatID) => Markup.inlineKeyboard(
    datas.map(data => {
        return [Markup.callbackButton(
            data.name,
            'url|' + data.name + ";" + data.token + ";" + chatID
        )]
    }))
    .resize()
    .extra()

module.exports = { runJobMenu };
