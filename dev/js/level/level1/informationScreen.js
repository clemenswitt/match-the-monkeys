const { monkeys } = require('./monkeys.js')
const controlElements = require('./controlElements.js')
const confettiAnimation = require('./endScenes/confettiAnimation.js')

let imageGrid

function initScreen () {
  const stage = MTLG.getStageContainer()

  const background = MTLG.assets.getBitmap('img/background-top.png')
  background.set({
    x: 0,
    y: 0
  })

  imageGrid = generateTileGrid(4, 10, 150, 35)

  const musicButton = controlElements.createButton(1820, 980, 'img/play-false.png', controlElements.controlBackgroundMusic)

  stage.addChild(background, imageGrid, musicButton)

  // register custom function for processing messages from gameScreen
  MTLG.distributedDisplays.actions.setCustomFunction('checkDecisionTree', checkDecisionTree)
}

function generateTileGrid (rows, cols, len, spacing) {
  let imageID = 1 // image id
  let y = 0.5 * len // image tiles are arranged by their center coordinates (regX, regY)

  const tileGrid = new createjs.Container()

  for (let i = 0; i < rows; i++) {
    let x = 0.5 * len // image tiles are arranged by their center coordinates (regX, regY)

    for (let j = 0; j < cols; j++) {
      // tile background shape
      const rect = new createjs.Shape()
      rect.graphics.beginStroke('#000000')
      rect.graphics.setStrokeStyle(1)
      rect.backgroundColor = rect.graphics.beginFill('#96c4db').command // save command object for later color change
      rect.shadow = new createjs.Shadow('#000000', 3, 3, 10)
      rect.graphics.drawRoundRect(x, y, len, len, 10)
      rect.regX = 0.5 * len
      rect.regY = 0.5 * len

      // tile image
      const image = MTLG.assets.getBitmap(monkeys[imageID].imagePath)
      image.set({
        x,
        y
      })
      image.regX = image.getBounds().width / 2
      image.regY = image.getBounds().height / 2
      image.scale = 0.35

      // image number
      const imageNumber = new createjs.Text(imageID, '15px Arial', '#000000')
      imageNumber.set({
        x: x + 0.5 * len - imageNumber.getBounds().width - 5,
        y: y + 0.5 * len - imageNumber.getBounds().height - 5
      })

      // tile container
      const tileContainer = new createjs.Container()
      tileContainer.name = imageID
      tileContainer.addChild(rect, image, imageNumber)

      // tooth container -> added for all biting monkeys
      if (monkeys[imageID].biting) {
        const toothContainer = new createjs.Container()

        const toothShape = new createjs.Shape()
        toothShape.graphics.beginStroke('#000000')
        toothShape.graphics.setStrokeStyle(1)
        toothShape.graphics.beginFill('#FFF684').drawCircle(0, 0, 20)
        toothShape.set({
          x: x + 0.5 * len,
          y: y - 0.5 * len
        })

        const toothImage = MTLG.assets.getBitmap('img/tooth.png')
        toothImage.regX = toothImage.getBounds().width / 2
        toothImage.regY = toothImage.getBounds().height / 2
        toothImage.set({
          x: x + 0.5 * len,
          y: y - 0.5 * len
        })

        toothContainer.addChild(toothShape, toothImage)
        tileContainer.addChild(toothContainer)
      }

      tileGrid.addChild(tileContainer)

      x += len + spacing
      imageID++
    }
    y += len + spacing
  }

  // calculate bounds and center of final tile gird
  tileGrid.setBounds(0, 0, cols * len + (cols - 1) * spacing, rows * len + (rows - 1) * spacing)
  tileGrid.regX = tileGrid.getBounds().width / 2
  tileGrid.regY = tileGrid.getBounds().height / 2
  tileGrid.set({
    x: MTLG.getOptions().width / 2,
    y: MTLG.getOptions().height / 2
  })

  return tileGrid
}

function checkDecisionTree (biting, notBiting) {
  let correctnessCounter = 0

  // check biting monkeys
  for (const monkey of biting) {
    const el = imageGrid.getChildByName(monkey) // get grid-element
    if (monkeys[monkey].biting) {
      el.getChildAt(0).backgroundColor.style = '#90EF90' // correct classification
      correctnessCounter++
    } else {
      el.getChildAt(0).backgroundColor.style = '#F9ACB1' // wrong classification
    }
  }

  // check not biting monkeys
  for (const monkey of notBiting) {
    const el = imageGrid.getChildByName(monkey) // get grid-element
    if (!monkeys[monkey].biting) {
      el.getChildAt(0).backgroundColor.style = '#90EF90' // correct classification
      correctnessCounter++
    } else {
      el.getChildAt(0).backgroundColor.style = '#F9ACB1' // wrong classification
    }
  }

  // check remaining monkeys
  const remainingMonkeys = Object.keys(monkeys).filter(item => !biting.concat(notBiting).includes(item))
  for (const monkey of remainingMonkeys) {
    imageGrid.getChildByName(monkey).getChildAt(0).backgroundColor.style = '#96c4db'
  }

  // trigger game end scene when all monkeys are classified correctly
  if (correctnessCounter === Object.keys(monkeys).length) {
    MTLG.distributedDisplays.communication.sendCustomAction('room', 'animation')
    confettiAnimation.initConfettiAnimation()
  }
}

module.exports = { initScreen }
