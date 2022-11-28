'use strict';

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

var res_text=""
const PYPATH="main.py"
var {PythonShell} = require('python-shell');
var pyshell = new PythonShell(PYPATH, { mode: 'text'});
var obj={
  text: event.message.text
}
var jsondat = JSON.stringify(obj);
//(1-3)上記jsondatを書き込むファイルがすでに存在する場合は当該ファイルを一度削除する。
if (fs.existsSync(JSONFILEPATH)) fs.unlinkSync(JSONFILEPATH)  
//(1-4)上記jsondatを書き込むファイルがすでに存在する場合は当該ファイルを一度削除する。
fs.writeFileSync(JSONFILEPATH,jsondat)
pyshell.send(obj);
pyshell.on('message',function(data){
  console.log(data);
  res_text = data;
}); 
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  var params = {
    type: 'text',
    //text: event.message.text //実際に返信の言葉を入れる箇所
    text: res_text
  }
  return client.replyMessage(event.replyToken, params);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);