const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config");
const language = require("@google-cloud/language");
const languageClient = new language.LanguageServiceClient();

client.login(token);

client.on("ready", () => {
  console.log(`You are ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  console.dir(msg);
  try {
    const score = await getSentiment(msg.content);
    msg.reply(`Your negativity/positivity score is: ${score}`);
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
