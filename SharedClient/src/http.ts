function httpGet() {
  let request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.onload = function () {
    onMessage(request.responseText)
  }

  request.send();
}

function httpPost(message: string) {
  let request = new XMLHttpRequest();
  request.open("POST", url, true);

  request.send(message);
}
