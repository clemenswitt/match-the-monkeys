const gameElements = require('./gameElements.js')

function controlBackgroundMusic (controlButton) {
  controlButton.playState = !controlButton.playState
  if (controlButton.playState) {
    MTLG.assets.playBackgroundMusic('theme')
  } else {
    MTLG.assets.stopBackgroundMusic()
  }
  controlButton.image.src = 'img/play-' + controlButton.playState + '.png'
}

function createButton (x, y, imagePath, func) {
  const button = MTLG.assets.getBitmap(imagePath)
  button.regX = button.getBounds().width / 2
  button.regY = button.getBounds().height / 2
  button.set({
    x: x,
    y: y
  })
  button.shadow = new createjs.Shadow('#000000', 3, 3, 10)
  button.on('click', () => {
    MTLG.utils.gfx.zoomInOut(button, { duration: 300, factor: 1.1 }) // ripple button when pressed
    func(button)
  })
  button.playState = false
  return button
}

function createPuzzleElementWindow (x, y) {
  const stage = MTLG.getStageContainer()

  // choosable menu items
  const movableGameElements = [
    ['puzzleElement', 'outTrue', 'img/out-true.png'],
    ['puzzleElement', 'outFalse', 'img/out-false.png'],
    ['filterElement', 'eyeOpen', 'img/filter-auge.png'],
    ['filterElement', 'mouthOpen', 'img/filter-mund.png'],
    ['filterElement', 'accessory', 'img/filter-accessoire.png'],
    ['filterElement', 'smiling', 'img/filter-laecheln.png'],
    ['filterElement', 'xEyes', 'img/filter-x-augen.png'],
    ['filterElement', 'showsTeeth', 'img/filter-zaehne.png'],
    ['filterElement', 'tongueOut', 'img/filter-zunge.png']
  ]

  // variables for item positioning in menu list
  let elementY = 50
  const spacing = 60

  // hide menu when background is touched
  stage.getChildByName('background').addEventListener('click', hidePuzzleElementWindow)

  // create menu background
  const puzzleElementWindowBackground = MTLG.assets.getBitmap('img/element-menu.png')
  puzzleElementWindowBackground.name = 'puzzleElementWindowBackground'
  puzzleElementWindowBackground.set({
    x: x,
    y: y,
    regX: puzzleElementWindowBackground.getBounds().width / 2,
    regY: puzzleElementWindowBackground.getBounds().height / 2
  })

  // create item list
  const puzzleElementWindow = new createjs.Container()
  puzzleElementWindow.name = 'puzzleElementWindow'
  puzzleElementWindow.set({
    x: x,
    y: y,
    regX: puzzleElementWindowBackground.getBounds().width / 2,
    regY: puzzleElementWindowBackground.getBounds().height / 2
  })

  // make item list scrollable
  puzzleElementWindow.addEventListener('mousedown', (e) => {
    const offsetY = e.stageY - puzzleElementWindow.y
    puzzleElementWindow.addEventListener('pressmove', (e) => {
      puzzleElementWindow.children.forEach((child) => { child.removeAllEventListeners('click') }) // suppress item adding by clicking when puzzleElementWindow is scrolled
      puzzleElementWindow.y = e.stageY - offsetY
    })
  })

  // re-add item adding functionality by clicking when puzzleElementWindow is not scrolled anymore
  puzzleElementWindow.addEventListener('pressup', () => {
    puzzleElementWindow.children.forEach((child) => {
      child.addEventListener('click', () => {
        const stage = MTLG.getStageContainer()
        stage.addChild(gameElements.createGameElement(child.type, child.imagePath, 1500, 400, 1, child.func))
        hidePuzzleElementWindow()
      })
    })
  })

  // add items to list
  for (const element of movableGameElements) {
    const puzzleElement = MTLG.assets.getBitmap(element[2])

    puzzleElement.type = element[0]
    puzzleElement.func = element[1]
    puzzleElement.imagePath = element[2]

    puzzleElement.set({
      height: puzzleElement.getBounds().height,
      regX: puzzleElement.getBounds().width / 2,
      x: puzzleElementWindow.regX,
      y: elementY,
      scale: 0.7,
      shadow: new createjs.Shadow('#E5E4E2', 0, 0, 30)
    })

    // create corresponding game element when item is clicked
    puzzleElement.addEventListener('click', () => {
      const stage = MTLG.getStageContainer()
      stage.addChild(gameElements.createGameElement(puzzleElement.type, puzzleElement.imagePath, 1500, 400, 1, puzzleElement.func))
      hidePuzzleElementWindow()
    })

    elementY += puzzleElement.scale * puzzleElement.height + spacing
    puzzleElementWindow.addChild(puzzleElement)
  }

  stage.addChild(puzzleElementWindowBackground, puzzleElementWindow)
}

// hide menu
function hidePuzzleElementWindow () {
  const stage = MTLG.getStageContainer()
  stage.removeChild(stage.getChildByName('puzzleElementWindow'))
  stage.removeChild(stage.getChildByName('puzzleElementWindowBackground'))
  stage.removeEventListener('click', hidePuzzleElementWindow)
}

module.exports = { createButton, controlBackgroundMusic, createPuzzleElementWindow }
