const images = document.querySelectorAll("img")
const tds = document.querySelectorAll("table td")
const craftingTable = document.getElementsByClassName('crafting-table')[0]
const craftingGrid = document.querySelectorAll('.slot[data-pos]')
const resultSlot = document.getElementById('result')

const recipes = [
  {
    pattern: [
      null, null, null,
      null, 'wood', null,
      null, null, null,
    ],
    result: './icons/Acacia_Planks.png'
  }
]

let gridState = Array(9).fill(null)
let item

// images.forEach(image => {
//   image.ondragstart = e => {
//     item = e.target;
//   }
// })

document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') {
    item = e.target
  }
})

tds.forEach(td => {
  td.ondragover = e => e.preventDefault();
  td.ondrop = handleDrop
})

function handleDrop(e) {
  e.preventDefault();
  if (this.childElementCount) return
  if (item == resultSlot.firstChild) {
    e.target.append(item);
    craftingGrid.forEach(slot => slot.replaceChildren())
    resultSlot.replaceChildren()
    return
  }
  e.target.append(item);
}

craftingTable.addEventListener('dragend', () => {
  updateGrid()
  checkRecipe()
});

function updateGrid() {
  craftingGrid.forEach(slot => {
    const i = slot.dataset.pos - 1
    const id = slot.firstChild?.dataset.id
    gridState[i] = id || null
  })
}

function checkRecipe() {
  for (let i = 0; i < recipes.length; i++) {
    if (JSON.stringify(recipes[i].pattern) === JSON.stringify(gridState)) {
      let img = document.createElement('img')
      img.src = recipes[i].result
      img.ondragstart = e => item = e.target;
      resultSlot.replaceChildren(img)
      return
    }
  }
  resultSlot.replaceChildren()
}

async function inventoryRender() {
  const inventorySlots = document
    .getElementsByClassName('inventory')[0]
    .querySelectorAll('td')
  const response = await fetch('./inventory.json')
  const inventoryState = await response.json()

  inventorySlots.forEach(slot => {
    // slot.innerHTML = ''
    // slot.removeAttribute('data-count')
  })

  inventoryState.forEach((item, i) => {
    if (item.id && item.src) {
      const img = document.createElement('img')
      img.src = item.src
      img.dataset.id = item.id
      inventorySlots[i].dataset.count = item.count
      img.ondragstart = e => { item = e.target }
      inventorySlots[i].appendChild(img)
    }
  })
}

window.addEventListener('DOMContentLoaded', inventoryRender)

