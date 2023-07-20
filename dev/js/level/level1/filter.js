class Filter {
  constructor (classificationFunction, inputDepartment = null) {
    if (inputDepartment !== null) { // input data
      this.rawData = { ...inputDepartment }
    }
    this.classifier = classificationFunction // classification function
    this.yes = {} // output-yes
    this.no = {} // output-no
  }

  setInputDepartment (inputDepartment) {
    this.rawData = { ...inputDepartment }
  }

  classify () {
    this.yes = this.classifier(this.rawData)

    // Copy rawData-department and filter entries which's key is undefined in yes-department
    this.no = Object.fromEntries(Object.entries({ ...this.rawData }).filter(([key]) => this.yes[key] === undefined))

    return [this.yes, this.no]
  }
}

module.exports = Filter
