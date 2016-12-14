// API.AI REQUST
// =============================================================================
var request = require('request')

function aiRequest(postURL, accessToken, sessionId, message) {
    request
        .post({
            url: postURL,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + accessToken
            },
            json: {
                "query": [
                    message
                ],
                "timezone": "Europe/Stockholm",
                "lang": "en",
                "sessionId": sessionId
            }
        })
        .on(`response`, (response) => {
            console.log(`ai-request response: ` + response.statusCode)
        })
}

module.exports = aiRequest;