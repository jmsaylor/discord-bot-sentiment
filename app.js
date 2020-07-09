const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config/config");
const connectDB = require("./config/db");
const language = require("@google-cloud/language");
const languageClient = new language.LanguageServiceClient();
const mongoose = require("mongoose");
const Record = require("./models/Record");

//Discord Login
client.login(token);

client.on("ready", () => {
  console.log(`You are ${client.user.tag}!`);
});

//MongoDB Login
connectDB();

listeningTo = "700053942482239641"; //input Discord channel ID

client.on("message", async (msg) => {
  //   console.dir(msg);
  try {
    if (!msg.author.bot && msg.channel.id === listeningTo) {
      const score = await getSentiment(msg.content);

      //Store in DB
      Record.create(
        {
          text: msg.content,
          score: score,
          // user: msg.author.id,
        },
        (err, record) => {
          if (err) throw err;
        }
      );
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
