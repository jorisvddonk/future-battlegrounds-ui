import oboe from "oboe";
import { debounce } from "lodash";

let shipsElem: SVGElement = document.querySelector("#battleground .ships");
let battlegroundElem = document.querySelector('#battleground');
let timestampElem = document.querySelector('#timestamp');

const stream = debounce(() => {
  oboe("http://localhost:8080/battleground/stage/stream").done((stage) => {
    battlegroundElem.classList.add('connected');
    showShips(stage.ships);
    showTimestamp(stage.timestamp);
  }).fail((e) => {
    battlegroundElem.classList.remove('connected');
    console.error(e);
    stream(); // retry!
  });
}, 1000);
stream();

function showShips(ships) {
  if (ships === undefined || ships === null) {
    return;
  }


  while (shipsElem.children.length > ships.length) {
    shipsElem.removeChild(shipsElem.firstChild);
  }

  ships.forEach((ship, index) => {
    if (shipsElem.children.length <= index) {
      const newElem = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
      newElem.setAttribute('points', "-10,-10 0,20 10,-10");
      shipsElem.appendChild(newElem);
    }
    const elem = shipsElem.children.item(index);
    elem.classList.add('ship');
    const angle = Math.atan2(ship.rotationVector.y, ship.rotationVector.x) * (180 / Math.PI) - 90;
    elem.setAttribute('transform', `translate(${ship.position.x} ${ship.position.y}) rotate(${angle})`);
  })
}

function showTimestamp(timestamp) {
  timestampElem.innerHTML = parseFloat(timestamp).toFixed(1);
}