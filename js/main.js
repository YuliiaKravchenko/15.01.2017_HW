;(function() {
  "use strict";

  const ws = io("http://178.62.203.188:8888");
  let $messagesContainer = document.getElementById("messages-container");
  let $chatForm = document.getElementById("chat-form");
  let $loginForm = document.getElementById("login-form");
  let $chatMessageInput = document.getElementById("chat-message");
  let $userName = document.getElementById("login");
  let $gifsContainer = document.getElementById("gifs-container");
  let login = "";
  let url = 'http://media3.giphy.com/media/';

  ws.on("chat message", data => {
    console.log(data);
    if(data.name){
    if(data.type === "TEXT" && data.name) {
      let $p = document.createElement("p");
      $p.textContent = data.message;
      $p.setAttribute("data-name", data.name);
      $messagesContainer.appendChild($p);
    }
    if (data.type === "IMAGE") {
                let $p = document.createElement("p");
                let $img = document.createElement("img");
                $img.src = `${url}${data.message}/200.gif`;
                $p.setAttribute("data-name", data.name);
                $p.appendChild($img);
                $messagesContainer.appendChild($p);
    }
    }
  });

  $chatForm.addEventListener("submit", onSendMessage);
  $loginForm.addEventListener("submit", onLogin);
  $gifsContainer.addEventListener("click", onSendImage);

  function onSendImage(ev) {
    console.dir(ev.target);

    if(ev.target.nodeName !== "IMG") return;

    let imageId = ev.target.dataset.imageId;

    ws.emit("chat message", { message: imageId, name: login, type: "IMAGE" });
  }

  function onLogin(ev) {
    ev.preventDefault();

    let name = $userName.value.trim();

    if(!name || name.length > 30) return;

    login = name;
    $userName.value = "";
    $loginForm.hidden = true;
    $chatForm.hidden = false;
    $chatMessageInput.disabled = false;
    document.querySelector(".chat-container").style = "justify-content: space-between"
  }

  function onSendMessage(ev) {
    ev.preventDefault();

    let message = $chatMessageInput.value.trim();

    if(!message) return;

    ws.emit("chat message", { message, name: login, type: "TEXT" });
    $chatMessageInput.value = "";
  }

  fetch("http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC").
    then(res => res.json()).
    then(res => {
      let result = res.data.map(image => ({
        id: image.id,
        url: image.images.fixed_height.url
      }));

      renderImages(result);
    });

  function renderImages(images) {
    let $container = document.getElementById("gifs-container"),
        fragment = document.createDocumentFragment();

    images.forEach(image => {
      let $img = document.createElement("img");
      $img.src = image.url;
      $img.setAttribute("data-image-id", image.id);
      fragment.appendChild($img);
    });

    $container.appendChild(fragment);
  }
})();















