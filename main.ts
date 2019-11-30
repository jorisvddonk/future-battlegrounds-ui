import { debounce } from "lodash";

let shipsElem: SVGElement = document.querySelector("#battleground .ships");
let bulletsElem: SVGElement = document.querySelector("#battleground .bullets");
let battlegroundElem = document.querySelector('#battleground');
let timestampElem = document.querySelector('#timestamp');

const stream = debounce(() => {
  var webSocket = new WebSocket(`ws://${window.location.host}/ws/battleground`);
  webSocket.onmessage = function (msg) {
    const battleground = JSON.parse(msg.data);
    onBattleground(battleground);
  };
  webSocket.onclose = function () {
    battlegroundElem.classList.remove('connected');
    stream(); // retry!
  };
}, 1000);
stream();

function onBattleground(battleground) {
  battlegroundElem.classList.add('connected');
  showShips(battleground.ships || []);
  showBullets(battleground.bullets || []);
  showTimestamp(battleground.timestamp);
}


function showShips(ships) {
  while (shipsElem.children.length > ships.length) {
    shipsElem.removeChild(shipsElem.firstChild);
  }

  ships.forEach((ship, index) => {
    if (shipsElem.children.length <= index) {
      const newElem = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
      newElem.setAttribute('points', "-10,-10 0,20 10,-10");
      newElem.classList.add('ship');
      shipsElem.appendChild(newElem);
    }
    const elem = shipsElem.children.item(index);
    const angle = Math.atan2(ship.rotationVector.y, ship.rotationVector.x) * (180 / Math.PI) - 90;
    elem.setAttribute('transform', `translate(${ship.position.x} ${ship.position.y}) rotate(${angle})`);
  })
}


function showBullets(bullets) {
  while (bulletsElem.children.length > bullets.length) {
    bulletsElem.removeChild(bulletsElem.firstChild);
  }

  bullets.forEach((bullet, index) => {
    if (bulletsElem.children.length <= index) {
      const newElem = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      newElem.classList.add('bullet');
      bulletsElem.appendChild(newElem);
    }
    const elem = bulletsElem.children.item(index);
    const angle = Math.atan2(bullet.rotationVector.y, bullet.rotationVector.x) * (180 / Math.PI) - 90;
    elem.setAttribute('x', bullet.position.x);
    elem.setAttribute('y', bullet.position.y);
  })
}

function showTimestamp(timestamp) {
  timestampElem.innerHTML = parseFloat(timestamp).toFixed(1);
}