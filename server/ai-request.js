// API.AI REQUST
// =============================================================================

import request from 'request'
import uuid from 'node-uuid'



function aiRequest(message) {

    // API.AI Config
    const postURL = `https://api.api.ai/v1/query?v=20150910`
    const accessToken = `fa0f2e28ce9043b1a781e91c2fdaa850`
    var sessionId = uuid.v1()

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
        }, function(error, response, body) {
            // console.log(body.result.parameters.givenname + ` ` + body.result.parameters.lastname)
            console.log(body)
        })
}

module.exports = aiRequest;