// expose framework for debugging
window.MTLG = MTLG
// ignite the framework
document.addEventListener('DOMContentLoaded', MTLG.init)

// add modules
require('mtlg-modul-menu')
require('mtlg-moduls-utilities')
require('mtlg-module-dd') // distributed-displays-module

// load configuration
require('../manifest/device.config.js')
require('../manifest/game.config.js')
require('../manifest/game.settings.js')

// load translations
require('../lang/lang.js')

// load scripts for main screen and information screen
const gameScreen = require('./level/level1/gameScreen.js')
const informationScreen = require('./level/level1/informationScreen.js')

// Register Init function with the MTLG-framework
MTLG.addGameInit(initGame)

function initGame () {
  // Initialize game
  // Register Basic Level
  MTLG.lc.registerLevel(firstlevelinit, () => true)
  // Init is done
  console.log('Game initialized')
}

// create room and initialize roles -> gameDisplay (main), informationDisplay (follow)
function firstlevelinit () {
  // try creating a new room
  MTLG.distributedDisplays.rooms.createRoom('room', function (result) {
    // successful -> client is main -> gameScreen
    if (result && result.success) {
      console.log('New room initialized')
      gameScreen.initScreen()
    } else {
      // room already exists -> client is follow and joins existing room -> informationDisplay
      MTLG.distributedDisplays.rooms.joinRoom('room', function (result) {
        if (result && result.success) {
          console.log('Joined existing room')
          informationScreen.initScreen()
          console.log('Information Display initialized')
        }
      })
    }
  })
}
