const sendBtn   = document.getElementById(`sendBtn`)
const input     = document.getElementById(`input`)

function sendPost(event) {
    event.preventDefault()
    var message = input.value
    console.log(message)

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
            console.log(response.message);
        })

}

sendBtn.addEventListener(`click`, sendPost, false)