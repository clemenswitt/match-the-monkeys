MTLG.loadOptions({
  width: 1920, // game width in pixels
  height: 1080, // game height in pixels
  languages: ['en', 'de'], // Supported languages. First language should be the most complete.
  countdown: 180, // idle time countdown
  fps: '60', // Frames per second
  playernumber: 4, // Maximum number of supported players
  FilterTouches: true, // Tangible setting: true means a tangible is recognized as one touch event. False: 4 events.
  webgl: false, // Using webgl enables using more graphical effects
  overlayMenu: false, // Starting the overlay menu automatically
  xapi: { // Configurations for the xapidatacollector. Endpoint and auth properties are required for the xapidatacollector module to work.
    endpoint: 'http://lrs.elearn.rwth-aachen.de/data/xAPI/', // The endpoint of the LRS where XAPI statements are send
    auth: '---', // Authentification token for LRS
    gamename: 'distributed-displays-test', // The name of the game can be transmitted as the platform attribute
    actor: { // A default actor can be specified to be used when no actor is present for a statement
      objectType: 'Agent',
      id: 'mailto:defaultActor@test.com',
      name: 'DefaultActor'
    }
  }
})
