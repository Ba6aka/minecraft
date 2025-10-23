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
    result: './icons/Acacia_Planks.png',
    count: 4
  }
]

let gridState = Array(9).fill(null)
let item

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
  e.preventDefault()
  if (this.childElementCount) {
    if (this.firstChild.src == item.src) {
      item.parentElement.dataset.count = +item.parentElement.dataset.count + +this.dataset.count
    }
    else return
  }
  // result slot
  if (item == resultSlot.firstChild) {
    if (e.target.tagName == 'TD') {
      e.target.dataset.count = item.parentElement.dataset.count
      e.target.append(item.cloneNode())
    }
    else {
      e.target.parentElement.dataset.count = item.parentElement.dataset.count
    }

    craftingGrid.forEach(slot => {
      if (slot.dataset.count > 1) slot.dataset.count -= 1
      else slot.replaceChildren()
    })

    return
  }

  if (e.target.tagName == 'TD') e.target.dataset.count = item.parentElement.dataset.count
  else e.target.parentElement.dataset.count = item.parentElement.dataset.count

  delete item.parentElement.dataset.count
  e.target.append(item)
}

craftingTable.addEventListener('dragend', () => {
  updateGrid()
  checkRecipe()
})

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
      img.ondragstart = e => item = e.target
      resultSlot.replaceChildren(img)
      img.parentElement.dataset.count = recipes[i].count
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
    slot.innerHTML = ''
    slot.removeAttribute('data-count')
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

