const Filter = require('./filter.js')
const {
  filterAccessory,
  filterEyeOpen,
  filterMouthOpen,
  filterShowsTeeth,
  filterSmiling,
  filterTongueOut,
  filterXEyes
} = require('./filterFunctions.js')

// list of all possibly colliding game elements on gameScreen
const gameElements = []

// cumulative classfication sets -> filled by puzzleElements of func outTrue | outFalse
const outputBiting = new Set()
const outputNotBiting = new Set()

// Sort items in puzzleElements[] by ascending x-value
function sortGameElements () {
  gameElements.sort((a, b) => {
    return a.x - b.x
  })
}

// Create new filter or puzzle element
function createGameElement (type, imagePath, x, y, scale, func = null) {
  const element = MTLG.assets.getBitmap(imagePath)
  element.name = type

  // Add filter functions to filter elements
  if (element.name === 'filterElement' && func !== null) {
    switch (func) {
      case 'accessory':
        element.filter = new Filter(filterAccessory)
        break
      case 'eyeOpen':
        element.filter = new Filter(filterEyeOpen)
        break
      case 'mouthOpen':
        element.filter = new Filter(filterMouthOpen)
        break
      case 'smiling':
        element.filter = new Filter(filterSmiling)
        break
      case 'xEyes':
        element.filter = new Filter(filterXEyes)
        break
      case 'showsTeeth':
        element.filter = new Filter(filterShowsTeeth)
        break
      case 'tongueOut':
        element.filter = new Filter(filterTongueOut)
    }
  } else {
    element.filter = null
  }

  // Add output array and function indicator to output puzzleElements
  if (element.name === 'puzzleElement') {
    element.connectedToFilterElement = null
    element.output = []
    if (func === 'input' || func === 'outTrue' || func === 'outFalse') {
      element.function = func
    } else {
      element.function = null
    }
  }

  // hide delete zone at creation
  if (element.name === 'deleteZone') {
    element.visible = false
    element.shadow = new createjs.Shadow('#000000', 3, 3, 15)
  }

  // Calculate center of element
  element.regX = MTLG.utils.collision.getBounds(element).width / 2
  element.regY = MTLG.utils.collision.getBounds(element).height / 2
  element.set({
    x,
    y
  })
  element.originalPosition = {
    x: element.x,
    y: element.y
  }

  element.scale = scale

  // delete zone must not be movable
  if (element.name !== 'deleteZone' && element.function !== 'input') {
    const stage = MTLG.getStageContainer()
    element.on('pressmove', () => { stage.getChildByName('deleteZone').visible = true })
    element.on('pressup', () => { stage.getChildByName('deleteZone').visible = false })
    element.on('pressup', checkCollision)
    const elementMovable = new MTLG.utils.movable.Movable(element, element.regX, element.regY)
    elementMovable.setDistance(0)
  }

  // add created game element to list
  gameElements.push(element)
  return element
}

// check for collisions when game element has been moved
// e1: moved element, e2: element e1 is colliding with
function checkCollision (e) {
  const e1 = e.target

  for (const element of gameElements.filter(e => e !== e1)) { // remove e1 from possible collision elements
    const e2 = element
    if (MTLG.utils.collision.checkPixelCollision(e1, e2)) { // collision detected
      // collision of two filter elements
      if (e1.name === 'filterElement' && e2.name === 'filterElement') {
        removeOutputFromFilterElement(e1)
        snapFilterElements(e1, e2)
        return
      }

      // filter element is snapped into puzzle element
      if (e1.name === 'filterElement' && e2.name === 'puzzleElement') {
        removeOutputFromFilterElement(e1)
        snapFilterElementIntoPuzzleElement(e1, e2)
        return
      }

      // puzzle element is snapped into filter element
      if (e1.name === 'puzzleElement' && e2.name === 'filterElement') {
        snapPuzzleElementIntoFilterElement(e1, e2)
        return
      }

      // delete element and all of it's impacts to output if moved into delete zone
      if (e2.name === 'deleteZone') {
        if (e1.name === 'puzzleElement') removeOutput(e1)
        if (e1.name === 'filterElement') removeOutputFromFilterElement(e1)
        deleteElement(e1)
        return
      }
    }
  }

  // no collision and moved element is filter element -> reset input department of filter and remove output of previously connected output elements
  if (e1.name === 'filterElement') {
    e1.filter.setInputDepartment(null)
    removeOutputFromFilterElement(e1)
  }

  // no collision and moved element is puzzle element -> puzzle element has been taken away from filter element -> remove output
  if (e1.name === 'puzzleElement' && e1.function !== null && e1.output.length > 0) {
    removeOutput(e1)
    return
  }

  // Rearrange items in puzzleElements[] by ascending x-value -> new elements will always snap into element with highest x-value when multiple collisions exist
  sortGameElements()
}

// Snap two filter elements together
function snapFilterElements (e1, e2) {
  // e1 right of e2
  if (e1.x >= e2.x) {
    e1.x = e2.x + e2.getBounds().width - 66

    // e1 above e2
    if (e1.y <= e2.y) {
      e1.y = e2.y - 75

      // Output-Y(e2) -> Input(e1)
      e1.filter.setInputDepartment(e2.filter.classify()[0])
    } else { // e1 below e2
      e1.y = e2.y + 75

      // Output-N(e2) -> Input(e1)
      e1.filter.setInputDepartment(e2.filter.classify()[1])
    }
  }

  // e1 left of e2
  else {
    e1.x = e2.x - e2.getBounds().width + 66

    // e1 above e2
    if (e1.y <= e2.y) {
      e1.y = e2.y - 75

      // Output-N(e1) -> Input(e2)
      e2.filter.setInputDepartment(e1.filter.classify()[1])
    } else { // e1 below e2
      e1.y = e2.y + 75

      // Output-Y(e1) -> Input(e2)
      e2.filter.setInputDepartment(e1.filter.classify()[0])
    }
  }
}

// Snap moved filter element into puzzle element
function snapFilterElementIntoPuzzleElement (e1, e2) {
  // e1 right of e2?
  // Used for connecting first filter to input data (represented as a puzzle element on the left side of the screen)
  // --> filter must be right of puzzle element & puzzle element's function must be 'input'
  if (e2.function === 'input' && e1.x >= e2.x) {
    e1.x = e2.x + e1.getBounds().width * 0.5 + 17
    e1.y = e2.y

    // Set input department of the first filter element
    e1.filter.setInputDepartment(e2.data)
  }
}

// Snap moved puzzle element into filter element
function snapPuzzleElementIntoFilterElement (e1, e2) {
  // remove output if puzzle element was connected to filter element before
  if (e1.output.length > 0) {
    removeOutput(e1)
  }

  // store filter element (e2) output puzzle element (e1) is conncected to
  e1.connectedToFilterElement = e2

  // e1 right of e2
  // Used for connecting output element into final filter stage
  // --> output element must be right of final filter stage
  if (e1.x >= e2.x) {
    e1.x = e2.x + e2.getBounds().width * 0.5 + 39

    // e1 above e2
    if (e1.y <= e2.y) {
      e1.y = e2.y - 75

      // Final Output = Output-Y(e2)
      // console.log('OUTPUT: [' + Object.keys(e2.filter.classify()[0]) + ']')
      e1.output = Object.keys(e2.filter.classify()[0])
    }

    // e1 below e2
    else {
      e1.y = e2.y + 75

      // Final Output = Output-N(e2)
      // console.log('OUTPUT: [' + Object.keys(e2.filter.classify()[1]) + ']')
      e1.output = Object.keys(e2.filter.classify()[1])
    }

    // Complete global output according to puzzle elements function
    addOutput(e1)
  }
}

// Add output to outputBiting | outputNotBiting when output puzzle element is connected to filter element
function addOutput (puzzleElement) {
  switch (puzzleElement.function) {
    case 'outTrue': puzzleElement.output.forEach(value => { outputBiting.add(value) })
      break
    case 'outFalse': puzzleElement.output.forEach(value => { outputNotBiting.add(value) })
      break
  }

  // check configuration at informationScreen
  sendDecisionTreeData()
}

// Remove output from outputBiting | outputNotBiting when output puzzle element is disconnected from filter element
function removeOutput (puzzleElement) {
  switch (puzzleElement.function) {
    case 'outTrue': puzzleElement.output.forEach(value => { outputBiting.delete(value) })
      break
    case 'outFalse': puzzleElement.output.forEach(value => { outputNotBiting.delete(value) })
      break
  }

  // check configuration at informationScreen
  sendDecisionTreeData()
}

// moved element (e1) is filter element -> remove output of previously connected output elements
function removeOutputFromFilterElement (e1) {
  for (const puzzleElement of gameElements.filter(e => e.name === 'puzzleElement')) {
    if (puzzleElement.connectedToFilterElement === e1) {
      puzzleElement.connectedToFilterElement = null
      removeOutput(puzzleElement)

      // reset output element to its original position
      puzzleElement.set({
        x: puzzleElement.originalPosition.x,
        y: puzzleElement.originalPosition.y
      })
    }
  }
}

// Send outputBiting & outputNotBiting to informationDisplay for evaluation of the current decision tree
function sendDecisionTreeData () {
  // (-> not working when passing arrays from outputBiting and outputNotBiting directly to sendCustomaction ?!)
  const outTrue = Array.from(outputBiting)
  const outFalse = Array.from(outputNotBiting)
  MTLG.distributedDisplays.communication.sendCustomAction('room', 'checkDecisionTree', outTrue, outFalse)
}

// delete element from screen and gameElements-Array
function deleteElement (element) {
  gameElements.splice(gameElements.indexOf(element), 1)
  console.log(gameElements)
  const stage = MTLG.getStageContainer()
  stage.removeChild(element)
}

module.exports = { createGameElement }
