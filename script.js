function showParticipants() {
  let activate = document.querySelector(".participants");
  activate.classList.remove("hidden");
}

function hideParticipants() {
  let disable = document.querySelector(".participants");
  disable.classList.add("hidden");
}

nameLogin();
function nameLogin() {
  login = prompt("Escolha um nome de usuário!");
  person = {
    name: login,
  };
  start();
}

function start() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    person
  );
  promise.then(enterTheRoom);
  promise.catch(cantEnter);
}

function cantEnter(erro) {
  if (erro.response.status === 400) {
    alert("Ops, alguém já escolheu esse. Escolhe outro aí.");

    nameLogin();
  }
}

function enterTheRoom() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(showMessages);
}

function showMessages(msg) {
  let messages = document.querySelector(".messages");
  messages.innerHTML = "";
  for (let i = 0; i < msg.data.length; i++) {
    switch (msg.data[i].type) {
      case "status":
        messages.innerHTML += `
              <div class="mensagens">
                  <div class="status">
                      <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> ${msg.data[i].text}</p>
                  </div>
              </div>
              `;
        break;
      case "message":
        messages.innerHTML += `
              <div class="mensagens">
                  <div class="msg_to_all">
                      <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from} </strong> para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
              </div>
              `;
        break;
      case "private_message":
        if (login === msg.data[i].to) {
          messages.innerHTML += `
                  <div class="mensagens">
                      <div class="msg_private">
                          <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> reservadamente para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
                      </div>
                  </div>
                  `;
        }
        break;
      default:
        break;
    }
  }
  scroll();
  
}

function scroll() {
  const chat = document.querySelector(".messages")
  const lastmsg = chat.lastElementChild
  lastmsg.scrollIntoView();
}

function keepConected() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    person
  );
  promise.then();
  promise.catch(sair);
}

function sair() {
  alert("Sua sessão expirou! Para continuar, por favor, logue novamente!");
  start();
}

function updateMessages() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  console.log("Updating...");
  promise.then(showMessages);
  promise.catch(sair);
}

function sendMessage() {
  let msgInput = document.querySelector(".send_msg");

  text_msg = msgInput.value;

  const novaMsg = {
    from: login,
    to: "Todos",
    text: text_msg,
    type: "message",
  };

  const promise = axios.post(
    `https://mock-api.driven.com.br/api/v6/uol/messages`,
    novaMsg
  );
  promise.then(updateMessages);
  promise.catch(refreshPage);

  msgInput.value = "";
}

function refreshPage(){
  window.location.reload();
}

document.addEventListener("keypress", function(e) {

  if(e.key === "Enter") {
  const btn = document.querySelector(".send_button");
  btn.click();
  }
})

const online = setInterval(keepConected, 5000);
const atualizado = setInterval(updateMessages, 3000);
