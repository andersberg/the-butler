Polymer({

    is: 'butler-app',

    listeners: {
        'nextView': '_showNextView',
        'resetViews': '_resetViews',
        'recordSpeech': '_recordSpeech',
        'recordStop': '_recordStop'
    },

    properties: {
        recognition: {
            type: Object
        }
    },

    attached: () => {
        this.recognition = new webkitSpeechRecognition()

    },

    _showNextView: (event) => {
        const pages = document.querySelector('iron-pages')
        pages.selectNext()
    },

    _resetViews: (event) => {
        const pages = document.querySelector('iron-pages')
        pages.selectIndex(0)
    },

    _recordStop: () => {
        this,recognition.stop()
        console.log(`rec stop`)
    },

    // Record Speech Method
    _recordSpeech: (event) => {
        console.log(`recording!`)
        let transcript = null
        // let recognition = new webkitSpeechRecognition()

        // Speech recognition config
        recognition.lang = `sv` // Swedish for best recognition of swedish accents
        // Consider enabling for richer feedback to user
        // recognition.interimResults = true

        recognition.onresult = (event) => {
            console.log(event.results[0][0].transcript)

            // transcript = event.results[0][0].transcript
            // speechOutput.value = transcript
            _postToServer(transcript)
        }

        this.recognition.start()
    },

    // Send transcript to server
    _postToServer: (message) => {

        // Config request
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

        // Send request
        fetch(request)
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                console.log(`Server: \n` + JSON.stringify(response.real_name))
            })
    }

});