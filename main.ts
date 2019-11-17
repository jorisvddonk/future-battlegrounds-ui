import oboe from "oboe";
import { debounce } from "lodash";

const stream = debounce(() => {
  oboe("http://localhost:8080/battleground/stream").done((obj) => {
    showShips(obj);
  }).fail((e) => {
    console.error(e);
    stream(); // retry!
  });
}, 1000);
stream();


let shipsElem: SVGElement;
let battlegroundElem = document.querySelector('#battleground');
function showShips(ships) {
  if (shipsElem === undefined) {
    shipsElem = document.querySelector("#battleground .ships");
  }
  battlegroundElem.classList.add('connected');


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
    elem.setAttribute('transform', `translate(${ship.position.x} ${ship.position.y})`);
  })
}