const template = require('./template.ejs')

const elById = id => document.getElementById(id)
const onInput = (el, handler) => el.addEventListener('input', handler)

const contEl = elById('container')
contEl.innerHTML = template({})

setTimeout(() => {
  const infectedEl = elById('infected')
  const populationEl = elById('population')
  const symptomsEl = elById('symptoms')
  const covidSymptomsEl = elById('covidSymptoms')

  const covidProbEl = elById('covidProb') // Result view

  const compute = () => {
    const infected = parseInt(infectedEl.value)
    const population = parseInt(populationEl.value)
    const symptoms = parseInt(symptomsEl.value)
    const covidSymptoms = parseInt(covidSymptomsEl.value)

    const pCovid = infected / population

    if (isNaN(pCovid)) {
      return
    }

    const pSymp = symptoms / 365
    const pSympGivenCovid = covidSymptoms / 100

    // Probabilty of covid given symptoms
    const p = pSympGivenCovid * pCovid / pSymp

    covidProbEl.innerHTML = '' + (p * 100).toFixed(2)
  }

  onInput(infectedEl, ev => compute())
  onInput(populationEl, ev => compute())
  onInput(symptomsEl, ev => compute())
  onInput(covidSymptomsEl, ev => compute())
}, 0)
