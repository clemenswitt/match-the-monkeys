// confetti animation in game end scene on informationDisplay
function initConfettiAnimation () {
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

  const video = MTLG.assets.getBitmap('img/confetti.mp4')
  video.image.muted = true // allow autoplay in chrome
  video.image.onended = function () {
    createjs.Tween.get(video).to({ alpha: 0 }, 500) // hide video when playback finished
  }

  sceneContainer.addChild(background, video)
  stage.addChild(sceneContainer)

  // scene container animation
  createjs.Tween.get(sceneContainer)
    .call(MTLG.assets.stopBackgroundMusic())
    .wait(3000)
    .to({ alpha: 1 }, 1000)
    .call(() => {
      // delete all stage objects and re-add sceneContainer -> significantly better performance
      stage.removeAllChildren()
      stage.addChild(sceneContainer)
    })
    .call(() => video.image.play())
}

module.exports = { initConfettiAnimation }
