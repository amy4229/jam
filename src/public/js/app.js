
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = {type, payload};
    return  JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server O");
})

socket.addEventListener("message", (message) => {
    addMessage(message);
    console.log(`${message.data}`);
});

socket.addEventListener("close", () => {
    console.log("disconnected from Server X");
})

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

const addMessage = (message) => {
    const li = document.createElement("li");
    li.textContent = message.data;
    messageList.appendChild(li);
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);

nicknameForm.addEventListener("submit", handleNickSubmit)