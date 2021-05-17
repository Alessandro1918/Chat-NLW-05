const socket = io()
let connectionsWithoutAdmin = []
let connectionsInSupport = []

socket.on("admin_list_all_users", (connections) => {
    
    connectionsWithoutAdmin = connections   //Update global var

    console.log('connectionsWithoutAdmin:', connectionsWithoutAdmin)    //browser's console

    document.getElementById("list_users").innerHTML = ""

    let template = document.getElementById("template").innerHTML

    connections.forEach((connection) => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        })
        document.getElementById("list_users").innerHTML += rendered
    })
})

//function trigered by pages/admin.html, button "Entrar em atendimento"
//params: id (the user's id)
function call(id){
    
    const connection = connectionsWithoutAdmin.find(connection => connection.socket_id === id)

    //This connection will have an admin when socket.emit("admin_user_in_support") at line 47.
    //Save this connection for "admin_receive_message" (line 102) use later.
    connectionsInSupport.push(connection)

    const template = document.getElementById("admin_template").innerHTML

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id
    })

    document.getElementById("supports").innerHTML += rendered

    const params = {
        user_id: connection.user_id
    }

    socket.emit("admin_user_in_support", params)

    socket.emit("admin_list_messages_by_user", params, messages => {
        
        //console.log("Messages:", messages)

        const divMessages = document.getElementById(`allMessages${connection.user_id}`)

        messages.forEach(message => {

            const createDiv = document.createElement("div")

            if (message.admin_id === null) {
                createDiv.className = "admin_message_client"
                createDiv.innerHTML += `<span>${connection.user.email}</span>`
                createDiv.innerHTML += `<span>${message.text}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`
            } else {
                createDiv.className = "admin_message_admin"
                createDiv.innerHTML += `<span>Atendente</span>`
                createDiv.innerHTML += `<span>${message.text}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`
            }

            divMessages.appendChild(createDiv)
        })
    })
}

function sendMessage(id) {
    //Get HTML element text
    const text = document.getElementById(`send_message_${id}`)

    //Send message to socket
    const params = {
        text: text.value,
        user_id: id
    }

    socket.emit("admin_send_message", params)

    //Update admin screen
    const divMessages = document.getElementById(`allMessages${id}`)
    
    const createDiv = document.createElement("div")
    createDiv.className = "admin_message_admin"
    createDiv.innerHTML += `<span>Atendente</span>`
    createDiv.innerHTML += `<span>${params.text}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`

    divMessages.appendChild(createDiv)

    text.value = "" 
}

socket.on("admin_receive_message", data => {
    
    //Admin can be with many clients at once. Which client sent this message?
    const connection = connectionsInSupport.find(connection => connection.socket_id === data.socket_id)
    
    const divMessages = document.getElementById(`allMessages${connection.user_id}`)
    
    console.log('Data:', data)
    console.log('Connection:', connection)
    console.log('divMessages:', divMessages)
    
    const createDiv = document.createElement("div")
    createDiv.className = "admin_message_client"
    createDiv.innerHTML += `<span>${connection.user.email}</span>`
    createDiv.innerHTML += `<span>${data.message.text}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`

    divMessages.appendChild(createDiv)
})