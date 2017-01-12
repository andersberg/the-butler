Polymer({

    is: 'butler-app',

    listeners: {
        'nextView': '_showNextView',
        'previousView': '_showPreviousView',
        'resetViews': '_resetViews',
        'recordSpeech': '_recordSpeech',
        'recordStop': '_recordStop',
        'postToServer': '_postToServer',
        'showResponse': '_showResponse'
    },

    properties: {
        recognition: {
            type: Object
        },
        transcript: {
            type: String,
            value: null
        },
        employee: {
            type: String,
            value: ``
        }
    },

    attached: () => {
        this.recognition = new webkitSpeechRecognition()
    },

    _showNextView: (event) => {
        document.querySelector('iron-pages').selectNext()
    },

    _showPreviousView: (event) => {
        document.querySelector('iron-pages').selectPrevious()
    },

    _resetViews: (event) => {
        document.querySelector('iron-pages').selectIndex(0)
    },

    _recordStop: () => {
        recognition.stop()
        // console.log(`rec stop`)
    },

    // Record Speech Method
    _recordSpeech: (event) => {
        // console.log(`recording!`)
        
        recognition.lang = `sv`

        recognition.start()

        recognition.onaudioend = () => {
            Polymer.dom(this.root).querySelector(`butler-app`)._showNextView()
        }

        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript
            // console.log(transcript)
            Polymer.dom(this.root).querySelector(`butler-app`)._postToServer(transcript)
        }
    },

    // Send transcript to server
    _postToServer: (message) => {
        // console.log(`post to server`)
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
                // console.log(`Server: \n` + response.real_name)
                Polymer.dom(this.root).querySelector(`butler-app`)._showResponse(response.real_name)
            })
    },

    _showResponse: function(name) {
        this.fire(`nextView`)
        this.employee = name

        // Mock app state reset sent from server.
        // Waiting for web-socket implementation.
        setTimeout(function(){
            Polymer.dom(this.root).querySelector(`butler-app`).fire(`resetViews`)
        }, 35000); // Long time for demo puropses
    }

});