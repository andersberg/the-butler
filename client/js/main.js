const sendBtn       = document.getElementById(`sendBtn`)
const input         = document.getElementById(`input`)
const initSpeech    = document.getElementById(`initSpeech`)
const speechOutput  = document.getElementById(`speechOutput`)
let transcript      = null

function postToServer(message) {
    console.log(`Sending this: ` + message)
    
    let request = new Request(`/api`, {
        method: `POST`,
        mode: `same-origin`, // alt. `cors`
        redirect: `follow`,
        body: JSON.stringify({
            message: message
        }),
        headers: new Headers({
            "Content-Type": `application/json`
        })
    })

    fetch(request)
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            console.log(`Server: ` + JSON.stringify(response))
        })
}

function recordSpeech(event) {
    let recognition = new webkitSpeechRecognition();

    // Speech recognition config
    recognition.lang = `sv` // Swedish for best recognition of swedish accents
    // Consider enabling for richer feedback to user
    // recognition.interimResults = true

    recognition.onresult = (event) => {
        console.log(event.results[0][0].transcript)
        
        transcript = event.results[0][0].transcript
        speechOutput.value = transcript


        postToServer(transcript)
    }

    recognition.start()
}
initSpeech.addEventListener(`mouseup`, recordSpeech,false)

// FOR DEBUG
function sendPost(event) {
    event.preventDefault()
    var transcript = input.value
    console.log(transcript)
    postToServer(transcript)
}
sendBtn.addEventListener(`click`, sendPost, false)