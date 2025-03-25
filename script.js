const images = document.querySelectorAll("img");
const tds = document.querySelectorAll("table:not(.result) td");
let item;

images.forEach(image => {
  image.ondragstart = e => {
    item = e.target;
  }
})

tds.forEach(td => {
  td.ondragover = e => e.preventDefault();
  td.ondrop = handleDrop
})

function handleDrop(e) {
  e.preventDefault();
  if (this.childElementCount) return
  e.target.append(item);

  checkCrafts()
}

function checkCrafts() {
[1,0,1]
[3,2,3]
[1,1,1]
}