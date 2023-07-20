const XAPIDEFURL = 'https://dditools.inf.tu-dresden.de/igk/zustand_is/'

const DEFINITIONS = {
  started: {
    id: 'http://adlnet.gov/expapi/verbs/started',
    display: {
      'de-DE': 'startete',
      'en-US': 'started'
    }
  },
  scored: {
    id: 'http://adlnet.gov/expapi/verbs/scored',
    display: {
      'de-DE': 'punktete',
      'en-US': 'scored'
    }
  },
  ended: {
    id: 'http://adlnet.gov/expapi/verbs/ended',
    display: {
      'de-DE': 'endete',
      'en-US': 'ended'
    }
  }
}

const ACTOR = {
  objectType: 'Agent',
  id: 'mailto:' + 'task1@igk-zustand.de',
  name: 'igk-zustand'
}

const OBJECT = {
  id: XAPIDEFURL,
  defnition: {
    name: 'IGK Zustand - Task 1'
  }
}

const CONTEXT = {
  extensions: {
  }
}

const _urlsession = XAPIDEFURL + 'sessionId'

function _sendEvt (stmt) {
  return MTLG.xapidatacollector.sendStatement(stmt)
}

function startSession () {
  CONTEXT.extensions[_urlsession] = MTLG.getSettings().default.sessionId.toString()

  const verb = DEFINITIONS.started

  const stmt = {
    actor: ACTOR,
    verb,
    object: OBJECT,
    context: CONTEXT
  }

  return _sendEvt(stmt)
}

function endSession () {
  const verb = DEFINITIONS.ended

  const stmt = {
    actor: ACTOR,
    verb,
    object: OBJECT,
    context: CONTEXT
  }

  _sendEvt(stmt)
}

function startLevel (level) {
  const context = structuredClone(CONTEXT)
  const _urlsession = XAPIDEFURL + 'level'
  context.extensions[_urlsession] = level.toString()

  const verb = DEFINITIONS.started

  const stmt = {
    actor: ACTOR,
    verb,
    object: OBJECT,
    context
  }

  _sendEvt(stmt)
}

function exampleEvent (evtData) {
  const _urllevel = MTLG.getSettings().default.url + 'level'
  const _extensions = {}
  _extensions[_urllevel] = evtData.gameState.level

  const result = {
    score: {
      raw: 1
    },
    success: true,

    extensions: _extensions
  }

  const verb = DEFINITIONS.scored

  const stmt = {
    actor: ACTOR,
    verb,
    object: OBJECT,
    result,
    context: CONTEXT
  }

  _sendEvt(stmt)
}

export {
  startSession,
  endSession,
  startLevel,
  exampleEvent
}
