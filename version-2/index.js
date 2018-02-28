const randomID = () => {
  return Math.ceil(Math.random * 10000);
};

let draw;

const createSVG = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  draw = SVG(svg);
  draw.node.setAttribute("class", "svg-background");
  document.body.appendChild(draw.node);
};

const screenWidth = () => {
  return window.innerWidth;
};

const random = (min, max) => {
  const distance = max - min;
  return Math.floor(Math.random() * distance) + min;
};

const createBlock = () => {
  const size = random(1, 6);
  const rect = draw
    .rect(size, size)
    .attr("x", random(0, screenWidth()))
    .addClass("rectangle");
};

document.addEventListener("DOMContentLoaded", () => {
  createSVG();
  const numberOfSquares = 50;
  new Array(numberOfSquares).fill(0).forEach(noop => {
    const randomDelay = random(0, 4000);
    setTimeout(createBlock, randomDelay);
  });
});

console.log("yes");
