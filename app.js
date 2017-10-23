'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var PAGE_ACCESS_TOKEN = 'EAAZAajLZAYyz8BAAj13N1SvHDOJf58dKNAlWKmbvNMnTev3ZAlPOm7fBBGlnvv1FsvFFHIbdbwpbZCcxUZBV0bkZBaWTvpB5wiVxl5lUXvTn5jRK0BmDa9k1xKIrbZBjuONhMtvYSwhaba76JaNpa81ZAqXiIcA7tZAfWfC1slk8qyppnP5lBK71w';
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.send('퍼니룩 페이스북챗봇입니다');
})

//메신저플랫폼의 webhook연결
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})


app.post("/webhook", function(req, res) {
    console.log("WEBHOOK은 정상적으로 동작되고 있습니다");
    var data = req.body;
    console.log(data);
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else {
                    console.log("Webhook이 정의되지 않은 이벤트를 받았습니다: ", messagingEvent);
                }
            });
        });
        res.sendStatus(200);
    }
});

//사용자로부터 받는 메시지 정의
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // 정의된 메시지의 응답으로 제시된 답변
    // generic, imgreturn, button등 리턴
    switch (messageText) {
  
//  case '안녕':
//        sendTextMessage(senderID, '나는 퍼니룩 쇼핑몰챗봇이야. 신상품이나 이벤트상품을 추천해줄께');
//        break;

	case '안녕':
    		sendButtonMessage(senderID);
    		break;
  case '신상품':
        sendGenericMessage(senderID);
        break;
	case '퍼니룩':
    		sendImgMessage(senderID);
    		break;
    default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
		  text:"나는 퍼니룩 쇼핑몰챗봇이야. 신상품이나 이벤트상품을 추천해줄께",
		  buttons: [{
              type: "postback",
              title: "퍼니룩 바로가기",
              payload: "order",
            }, {
              type: "postback",
              title: "신상품 바로가기",
              payload: "cart",
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function sendImgMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "funnylook",
            subtitle: "스토리중심의 비디오커머스",
            item_url: "http://funnylook.co.kr",               
            image_url: "http://funnylook.co.kr/data/skin/front/sb77/img/banner/ce34df9591e2e0991660b5efae0508cb_18990.jpg",
            buttons: [{
              type: "web_url",
              url: "http://funnylook.co.kr",
              title: "퍼니룩바로가기"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "LONNIE CROSS BAG",
            subtitle: "MASTERPIREC CREATED FOR YOU",
            item_url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000020#detail",               
            image_url: "http://m.funnylook.co.kr/data/goods/17/10/40/1000000028/1000000028_detail_035.jpg",
            buttons: [{
              type: "web_url",
              url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000020#detail",
              title: "로니크로스백 바로구매"
            }, {
              type: "postback",
              title: "장바구니담기",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "SOPHIA CROSS BAG",
            subtitle: "MASTERPIREC CREATED FOR YOU",
            item_url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000015",               
            image_url: "http://funnylook.co.kr/data/goods/17/09/36/1000000015/1000000015_detail_032.jpg",
            buttons: [{
              type: "web_url",
              url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000015",
              title: "소피아크로스 백 바로구매"
            }, {
              type: "postback",
              title: "장바구니담기",
              payload: "Payload for second bubble",
            }],
          }, {
            title: "LAPIS SHOULDER CROSS BAG",
            subtitle: "MASTERPIREC CREATED FOR YOU",
            item_url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000019",               
            image_url: "http://funnylook.co.kr/data/goods/17/09/36/1000000019/1000000019_detail_067.jpg",
            buttons: [{
              type: "web_url",
              url: "http://funnylook.co.kr/goods/goods_view.php?goodsNo=1000000019",
              title: "라피스 숄더백 바로구매"
            }, {
              type: "postback",
              title: "장바구니담기",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;
   
  if (payload === 'order') {
      sendImgMessage(senderID);
  } else if (payload === 'cart') {
      sendGenericMessage(senderID);
  }
  
  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  //sendTextMessage(senderID, payload);
}
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      //text: messageText
      text: "질문을 이해할수 없습니다. 아래 전화번호로 주시면 상담할께요. 1588-1688"
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})