'use strict';
import {PythonShell} from 'python-shell';
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

let pyshell = new PythonShell('main.py');

// sends a message to the Python script via stdin
pyshell.send(event.message.text);

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  var params = {
    type: 'text',
    //text: event.message.text //実際に返信の言葉を入れる箇所
    text: message
  }
  return client.replyMessage(event.replyToken, params);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);