// generate scratch card window with game code to display
function initScratchCardWindow (codeToDisplay) {
  const stage = MTLG.getStageContainer()

  const sceneContainer = new createjs.Container()
  sceneContainer.alpha = 0

  const background = new createjs.Shape()
  background.graphics.beginFill('#000000').drawRect(0, 0, 1920, 1080)
  background.set({
    x: 0,
    y: 0,
    width: stage.width,
    height: stage.height
  })

  const scratchCardBackground = new createjs.Shape()
  scratchCardBackground.graphics.beginFill('#ffffff').drawRoundRect(960, 540, 1000, 250, 10)
  scratchCardBackground.set({
    regX: 500,
    regY: 125
  })

  const scratchCardText = new createjs.Text(codeToDisplay, '100px Arial', '#000000')
  scratchCardText.set({
    regX: scratchCardText.getBounds().width / 2,
    regY: scratchCardText.getBounds().height / 2,
    x: 960,
    y: 540
  })

  const scratchSurface = generateScratchSurface(960, 540, 7, 30, 30)

  sceneContainer.addChild(background, scratchCardBackground, scratchSurface)
  stage.addChild(sceneContainer)

  // scene container animation
  createjs.Tween.get(sceneContainer)
    .call(MTLG.assets.playSound('success'))
    .wait(3000)
    .to({ alpha: 1 }, 1000)
    .call(() => {
      // delete all stage objects and re-add sceneContainer -> significantly better performance
      stage.removeAllChildren()
      stage.addChild(sceneContainer)
    })
    .call(() => sceneContainer.addChildAt(scratchCardText, 2)) // add code when animation is finished -> otherwise visible when alpha-value < 1
}

// generate scratch card surface to hide displayed game code
function generateScratchSurface (x, y, rows, cols, len) {
  const container = new createjs.Container()
  container.set({
    x: x,
    y: y,
    regX: cols * len / 2,
    regY: rows * len / 2
  })

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const pixel = new createjs.Shape()
      pixel.graphics.beginFill('#c0c0c0').drawRect(j * len, i * len, len, len)
      container.addChild(pixel)
    }
  }

  // scratch effect
  container.addEventListener('pressmove', (e) => {
    const coords = container.globalToLocal(e.stageX, e.stageY)
    container.children.forEach((child) => {
      if (child.hitTest(coords.x, coords.y)) {
        child.alpha = 0
      }
    })
  })

  return container
}

module.exports = { initScratchCardWindow }
