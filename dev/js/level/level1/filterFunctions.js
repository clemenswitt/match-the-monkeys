function filterAccessory (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.accessory === true))
}

function filterEyeOpen (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.eyeOpen === true))
}

function filterMouthOpen (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.mouthOpen === true))
}

function filterSmiling (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.smiling === true))
}

function filterXEyes (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.xEyes === true))
}

function filterShowsTeeth (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.showsTeeth === true))
}

function filterTongueOut (input) {
  return Object.fromEntries(Object.entries(input).filter(([k, v]) => v.tongueOut === true))
}

module.exports = {
  filterAccessory,
  filterEyeOpen,
  filterMouthOpen,
  filterShowsTeeth,
  filterSmiling,
  filterTongueOut,
  filterXEyes
}
