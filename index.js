const Telegraf = require('telegraf');
const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");
const { Keyboard } = require('telegram-keyboard')

// const loveCalculator = require("./api/loveCalculator");
const bot = new Telegraf("1550935249:AAEcjsVpONoqP5_wKxYvL0GVEkgNXajgM9Q");
// const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  // console.log('Response time: %sms', ms)
  console.log('time: ', start)
})

const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('👍', 'like'),
  Markup.callbackButton('👎', 'dislike')
]).extra()

bot.start(ctx => {
  console.log('started:', ctx.from.first_name)
  ctx.reply('Ciao, benvenuto dal bot di donaunpasto.it!\nPuoi:\n- contattarci qui con /contact\n- chiedere info con /info\n- o cercare con questo bot il locale per donare un pasto gratis.');
  ctx.reply(
    `🔥Ciao ${ctx.from.first_name}, vuoi donare un pasto cercando un ristoratore?`,
    inlineMessageRatingKeyboard
  );
});

// bot.on('text', async ({ reply }) => {
//   const keyboard = Keyboard.make([
//     ['Treviso', 'Torino'], // First row
//     ['Milano', 'Bologna'], // Second row
//   ])

//   await reply('In quale provincia vuoi cercare il ristoratore?', keyboard.reply())
//   // await reply('In quale provincia risiedi?', keyboard.inline())
// })


// // bot.on('message', (ctx) => ctx.telegram.sendMessage(
// //   ctx.from.id,
// //   'Like?',
// //   inlineMessageRatingKeyboard)
// // )

const keyboard = Keyboard.make([
  ['Treviso', 'Torino'], // First row
  ['Milano', 'Bologna'], // Second row
])

// bot.action('like', (ctx) => {
// ctx.editMessageText('🎉 Grazie! 🎉')
bot.action('like', async ({ reply }) => {
    await reply('In quale provincia vuoi cercare il ristoratore?', keyboard.reply())
  
});

bot.action('dislike', (ctx) => ctx.editMessageText('okey'))

// Keyboard layout for requesting phone number access
// const TelegramBot = require('node-telegram-bot-api');
// const requestPhoneKeyboard = {
//   "reply_markup": {
//       "one_time_keyboard": true,
//       "keyboard": [[{
//           text: "My phone number",
//           request_contact: true,
//           one_time_keyboard: true
//       }], ["Cancel"]]
//   }
// };

// // Listener (handler) for retrieving phone number
// bot.onText(/\/phone/, (msg) => {
//   bot.sendMessage(msg.chat.id, 'Can we get access to your phone number?', requestPhoneKeyboard);
// });

const findVouchers = new WizardScene(
  "find_voucher",
  ctx => {
    ctx.reply("digita la tua provincia:");
    return ctx.wizard.next();
  },
  ctx => {
    // console.log(ctx)
    ctx.wizard.state.region = ctx.message.text;
    ctx.reply(
      "digita la tua città:"
    );
    return ctx.wizard.next();
  },
  ctx => {
    const citi = ctx.message.text;
    const region = ctx.wizard.state.region;
    // loveCalculator
    //   .getPercentage(yourName, partnerName)
    //   .then(res => {
    //     const { fname, sname, percentage, result } = res.data;
    ctx.reply(
      // `${fname} + ${sname} = ${percentage}% \n ${percentage > 50 ? '☺️' : '😢'} ${result}`,
      'Risposta del bot:',
      Markup.inlineKeyboard([
        Markup.callbackButton(
          "♥️ Cerca un\'altro locale",
          "FIND_VOUCHER"
        )
      ]).extra()
    );
    // })
    // .catch(err => ctx.reply(
    //   err.message,
    //   Markup.inlineKeyboard([
    //     Markup.callbackButton("search again", "FIND_VOUCHER")
    //   ]).extra()
    // ));
    return ctx.scene.leave();
  }
);
bot.command('info', message => {
  return message.reply('🔥🔥🔥🔥🔥RICHIESTE INFORMAZIONI\nPer richiedere informazioni di qualsiasi tipo esistono 2 vie ...\nL\'unione fa la forza e più siamo, più saremo incisivi.\n💪💪💪🙏🙏🙏');
});
const stage = new Stage([findVouchers], { default: "find_voucher" });
bot.use(session());
bot.use(stage.middleware());

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.launch();

// bot.startPolling()