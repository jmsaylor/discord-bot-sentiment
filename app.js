const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config");
const language = require("@google-cloud/language");
const languageClient = new language.LanguageServiceClient();
const mongoose = require("mongoose");

client.login(token);

client.on("ready", () => {
  console.log(`You are ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  //   console.dir(msg);
  try {
    console.log(msg.author.bot);
    if (!msg.author.bot) {
      const score = await getSentiment(msg.content);

      //User Interaction
      msg.reply(`Your negativity/positivity score is: ${score}`);

      //Console Monitoring
      console.log(msg.content);
      console.log(score);

      //Store in DB
      const record = {
        text: msg.content,
        score: score,
      };
    }
  } catch (error) {
    console.error(error);
  }
});

async function getSentiment(text) {
  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };
  const [result] = await languageClient.analyzeSentiment({
    document: document,
  });
  const sentiment = result.documentSentiment;

  return sentiment.score;
}
