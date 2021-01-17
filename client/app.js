const socket = io();

const submitBtn = document.querySelector(".submit");
const file = document.querySelector(".image");
const input = document.querySelector(".msgBox");
const container = document.querySelector('.chat-box');

const answer = prompt('what\'s your username else user is default', 'user') || 'user';

socket.emit('connection', answer);

socket.on('new user', (name) => {
    const adminMsg = ` <p class="admin-msg">${name} has joined the chat</p>`;
    container.insertAdjacentHTML('beforeend', adminMsg);
})

const newMessage = () => {
    const outgoing = `<div class="outgoing">
    <p class="username">${answer}</p>
    <p class="msgBody">${input.value}</p>
</div>`
  socket.emit("new message", [input.value, answer]);
  container.insertAdjacentHTML('beforeend', outgoing);
  moveToBottom();
  input.value = "";
};

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    newMessage();
  }
});
submitBtn.addEventListener("click", newMessage);

file.addEventListener("click", () => {
    
  showOpenFilePicker()
    .then((result) => result[0]?.getFile())
    .then(result => {
        const reader = new FileReader();
        reader.readAsDataURL(result)
        reader.onload = ()=> {
            const outgoing = `<div class="outgoing">
            <p class="username">${answer}</p>
            <img src=${reader.result} class="msgImage" />
        </div>`;
            container.insertAdjacentHTML('beforeend', outgoing)
            moveToBottom()
        }
        socket.emit('new Image', [result, answer]);
    })
    .catch((err) => console.log(err));
});

socket.on("message", (data) => {
    const incoming = `<div class="incoming">
    <p class="username">${data[1]}</p>
    <p class="msgBody">${data[0]}</p>
</div>`;
    container.insertAdjacentHTML('beforeend', incoming);
    moveToBottom()
});
socket.on('file', (data) => {
    const blob = new Blob([data[0]], {type: 'image/jpg'});
    console.log(blob)
    const reader = new FileReader();
    reader.readAsDataURL(blob)
    reader.onload = ()=> {
        const incoming = `<div class="incoming">
    <p class="username">${data[1]}</p>
    <img src=${reader.result} class="msgImage" />
</div>`;
        container.insertAdjacentHTML('beforeend', incoming);
        moveToBottom()
        // const img = document.createElement('img');
        // img.src = reader.result;
        // container.appendChild(img);
    }
});

const moveToBottom = ()=> {
    container.scrollTo(0, container.scrollHeight);
}

