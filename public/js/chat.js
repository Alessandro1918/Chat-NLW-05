let socket_admin_id = null
let emailGlobal = null
let socket = null

document.querySelector("#start_chat").addEventListener("click", (event) => {

    socket = io()

    //When button 'start_chat' is clicked, 
    //hide chat 1 ('Como podemos ajudar' and 'email')
    //and show chat 2 (messages from user and admin)

    const chat_help = document.getElementById("chat_help")
    chat_help.style.display = "none"

    const chat_in_support = document.getElementById("chat_in_support")
    chat_in_support.style.display = "block"

    //Get data from form:
    const email = document.getElementById("email").value
    const text = document.getElementById("txt_help").value
    emailGlobal = email

    //At: ?
    //Do: Start the socket connection defined in 'websockets/client.ts'
    socket.on("connect", () => {
        const params = {text, email}
        socket.emit("client_first_access", params, (callback, error) => {
            if (error) {
                console.log(error)
            } else {
                console.log(callback)
            }
        })
    })

    //At: 'client_list_all_messages' from 'websockets/client.ts'
    //Do: List messages
    socket.on("client_list_all_messages", (messages) => {
        
        console.log("Messages:", messages)  //browser's console

        var template_client = document.getElementById("message-user-template").innerHTML
        var template_admin = document.getElementById("admin-template").innerHTML

        messages.forEach(message => {
            
            //message is from user
            if (message.admin_id === null) {
                const rendered = Mustache.render(template_client, {
                    message: message.text,
                    email
                })
                document.getElementById("messages").innerHTML += rendered
            }

            //message is from admin
            else {
                const rendered = Mustache.render(template_admin, {
                    message_admin: message.text,
                })
                document.getElementById("messages").innerHTML += rendered
            }
        });
    })

    socket.on("admin_send_to_client", message => {
        //console.log(message)

        socket_admin_id = message.socket_id //TODO - Unused?
        const template_admin = document.getElementById("admin-template").innerHTML

        const rendered = Mustache.render(template_admin, {
            message_admin: message.text
        })

        document.getElementById("messages").innerHTML += rendered
    })
});

document
    .querySelector("#send_message_button")
    .addEventListener("click", (event) => {
    
        const text = document.getElementById("message_user")

        const params = {
            text: text.value,
            socket_admin_id
        }

        socket.emit("client_send_to_admin", params)

        const template_client = document.getElementById("message-user-template").innerHTML

        const rendered = Mustache.render(template_client, {
            message: text.value,
            email: emailGlobal
        })

        text.value = ""

        document.getElementById("messages").innerHTML += rendered
})