const gameElements = require('./gameElements.js')
const { monkeys } = require('./monkeys.js')
const controlElements = require('./controlElements.js')
const scratchCard = require('./endScenes/scratchCard.js')

function initScreen () {
  const stage = MTLG.getStageContainer()

  const background = MTLG.assets.getBitmap('img/background-bottom.png')
  background.name = 'background'
  background.set({
    x: 0,
    y: 0
  })

  // input puzzle piece
  const inputData = gameElements.createGameElement('puzzleElement', 'img/start.png', 133, 644, 1, 'input')

  // button for accessing game item menu
  const menuButton = controlElements.createButton(75, 1005, 'img/puzzleButton.png', () => {
    stage.removeChild(stage.getChildByName('puzzleElementWindowBackground'))
    stage.removeChild(stage.getChildByName('puzzleElementWindow'))
    controlElements.createPuzzleElementWindow(1670, 540)
  })

  // delete zone
  const deleteZone = gameElements.createGameElement('deleteZone', 'img/deleteZone.png', 1820, 980, 1)

  // Set input data
  inputData.data = monkeys

  stage.addChild(background, inputData, menuButton, deleteZone)

  // custom function to trigger scratch card end animation with specific code
  MTLG.distributedDisplays.actions.setCustomFunction('animation', () => {
    MTLG.utils.inactivity.removeAllListeners()
    scratchCard.initScratchCardWindow('HLXSGOJ872659')
  })
}

module.exports = { initScreen }
