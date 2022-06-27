let login;

function showParticipants() {
  let activate = document.querySelector(".participants");
  activate.classList.remove("hidden");
}

function hideParticipants() {
  let disable = document.querySelector(".participants");
  disable.classList.add("hidden");
}


function enterName() {
  login = document.querySelector(".entrada input").value;
  
  start();
}

function start() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    {name:login}
  );
  promise.then(enterTheRoom);
  promise.catch(cantEnter);
}

function cantEnter(erro) {
  if (erro.response.status === 400) {
    alert("Ops, alguém já escolheu esse. Escolhe outro aí.");

  }
}

function enterTheRoom() {
  let init = document.querySelector(".principal");
  init.classList.remove("escondido");

  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(showMessages);

  keepConected();
}

function showMessages(msg) {
  let plotMessages = document.querySelector(".messages");
  plotMessages.innerHTML = "";
  for (let i = 0; i < msg.data.length; i++) {
    switch (msg.data[i].type) {
      case "status":
        plotMessages.innerHTML += `      
          <div class="status">
            <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> ${msg.data[i].text}</p>
          </div>
        `;
        break;
      case "message":
        plotMessages.innerHTML += `
          <div class="msg_to_all">
              <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from} </strong> para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
          </div>
        `;
        break;
      case "private_message":
        if (login === msg.data[i].to) {
          plotMessages.innerHTML += `
            <div class="msg_private">
              <p><span class="msg_time">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> reservadamente para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
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
  const chat = document.querySelector(".messages");
  const lastmsg = chat.lastElementChild;
  lastmsg.scrollIntoView();
}

function keepConected() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    {name:login}
  );
  promise.then(setTimeout(keepConected, 5000));
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

  const newMsg = {
    from: login,
    to: "Todos",
    text: text_msg,
    type: "message",
  };

  const promise = axios.post(
    `https://mock-api.driven.com.br/api/v6/uol/messages`,
    newMsg
  );
  promise.then(updateMessages);
  promise.catch(refreshPage);

  msgInput.value = "";
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const btn = document.querySelector(".send_button");
    e.preventDefault()
    btn.click();
  }
});

function refreshPage() {
  window.location.reload();
}


const atualizado = setInterval(updateMessages, 3000);