function showParticipants() {
  let activate = document.querySelector(".participants");
  activate.classList.remove("escondido");
}

function hideParticipants() {
  let disable = document.querySelector(".participants");
  disable.classList.add("escondido");
}

nameLogin()
function nameLogin() {
  login = prompt("Escolha um nome de usuário!");
  pessoa = {
    name:login
  }
  start()
}


function start() {
  let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',pessoa);
  promise.then(enterTheRoom);
  promise.catch(cantEnter);
}

function cantEnter(erro) {
  if (erro.response.status === 400) {
    alert("Ops, alguém já escolheu esse. Escolhe outro aí.");
    
    nameLogin()
  }
}

function enterTheRoom() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(showMessages);
}

function showMessages(msg){
let messages = document.querySelector(".messages");
  messages.innerHTML = "";
  for (let i = 0; i < msg.data.length; i++) {
    switch (msg.data[i].type) {
      case "status":
        messages.innerHTML += `
              <div class="mensagens">
                  <div class="status">
                      <p><span class="horario">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> ${msg.data[i].text}</p>
                  </div>
              </div>
              `;
        break;
      case "message":
        messages.innerHTML += `
              <div class="mensagens">
                  <div class="msg_to_all">
                      <p><span class="horario">(${msg.data[i].time})</span> <strong> ${msg.data[i].from} </strong> para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
              </div>
              `;
        break;
      case "private_message":
        if (login === msg.data[i].to) {
          messages.innerHTML += `
                  <div class="mensagens">
                      <div class="msg_private">
                          <p><span class="horario">(${msg.data[i].time})</span> <strong> ${msg.data[i].from}</strong> reservadamente para <strong>${msg.data[i].to}</strong>: ${msg.data[i].text}</p>
                      </div>
                  </div>
                  `;
        }
        break;
      default:
        break;
    }
  }
}

function keepConected() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    pessoa
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
  console.log("Atualizando...");
  promise.then(showMessages);
  promise.catch(sair);
}



const online = setInterval(keepConected, 5000);
const atualizado = setInterval(updateMessages, 3000);