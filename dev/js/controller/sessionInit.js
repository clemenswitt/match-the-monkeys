
export const sessionInit = function () { // eslint-disable-line no-unused-vars
  // create sessionId
  const date = Date.now()

  MTLG.loadSettings({
    default: {
      sessionId: hashCode('' + date)
    }
  })
}

/**
 * Taken from https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
// eslint-disable-next-line no-unused-vars
const hashCode = function (inputStr) {
  let hash = 0
  if (inputStr.length === 0) {
    return hash
  }
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  if (hash < 1) {
    hash = hash * -1
  }
  return hash
}
