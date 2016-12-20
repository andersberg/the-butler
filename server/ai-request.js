// API.AI REQUST
// =============================================================================
import request from 'request'
import fetch from 'node-fetch'
import uuid from 'node-uuid'

function aiRequest(message) {

    // API.AI Config
    const postURL = `https://api.api.ai/v1/query?v=20150910`
    const accessToken = `fa0f2e28ce9043b1a781e91c2fdaa850`
    let sessionId = uuid.v1()

    // let requestBody = {
    //     "query": [
    //         message
    //     ],
    //     "timezone": "Europe/Stockholm",
    //     "lang": "en",
    //     "sessionId": sessionId
    // }

    // let request = fetch(postURL, {
    //     method: 'POST',
    //     url: postURL,
    //     headers: {
    //         'Content-Type': 'application/json; charset=utf-8',
    //         'Authorization': 'Bearer ' + accessToken
    //     },
    //     body: JSON.stringify(requestBody)
    // }).then(function (res) {
    //     return res.json();
    // }).then(function (json) {
    //     // console.log(json);
    //     return json
    // });
    // console.log(request)

    function callback(error, response, body) {
        // console.log(`API.ai: ` + body.result.parameters.givenname + ` ` + body.result.parameters.lastname)
        let result = body
        console.log(result)
    }

    let options = {
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
    }

    request.post(options, callback)
}

module.exports = aiRequest;