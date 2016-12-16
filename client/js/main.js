const sendBtn       = document.getElementById(`sendBtn`)
const input         = document.getElementById(`input`)
const initSpeech    = document.getElementById(`initSpeech`)

function sendPost(event) {
    event.preventDefault()
    var message = input.value
    console.log(`Sending to server: ` + message)

    var request = new Request(`/api`, {
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
            // console.log(`Success!`)
            return response.json();
        })
        .then((response) => {
            console.log(`From server: ` + response.message);
        })

}
sendBtn.addEventListener(`click`, sendPost, false)

function startRec(event) {
    var recognition = new webkitSpeechRecognition()
    // Speech Recognition Config
    recognition.lang = `sv`
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
        var textarea      = document.getElementById(`speechOutput`)
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                console.log(event.results[i][0].transcript)
                textarea.value += event.results[i][0].transcript
            }
        }
    }

    recognition.start()
}
initSpeech.addEventListener(`mouseup`, startRec, false)