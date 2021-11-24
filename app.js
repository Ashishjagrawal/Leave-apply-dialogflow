require('dotenv').config();
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const {DbHandler,applyleave} = require('./db')
const app = express();
const PORT = 5000;
const sessionId = uuid.v4();
app.use(bodyParser());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.post('/send-msg',(req,res)=> {
    runSample(req.body.MSG).then(data=>{
        res.send({Reply:data})
    })
})
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'rn-bot-bjdp') {
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename:"E:/Apps/Bots/DialogFlow/FirstProj/rn-bot-bjdp-fe248cbb77c7.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  if (result.intent) {
      if(result.intent.displayName=='applyLeaveIntent - custom - custom'){
        let values = result.outputContexts[0].parameters.fields
          await applyleave(values.date.stringValue,values.name.stringValue);
      }
  } else {
    console.log('  No intent matched.');
  }
  return result.fulfillmentText;
}

app.listen(PORT,()=>{
    DbHandler.Connection().then(connection => {
        console.log('Database Connected', connection)
    }).catch(err => {
        console.log('Database connection fail', err)
    })
    console.log(`App is running on Port: ${PORT}`);
})