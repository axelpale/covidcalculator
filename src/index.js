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
  const covidProb2El = elById('covidProb2') // Result view

  const compute = () => {
    const infected = parseInt(infectedEl.value)
    const population = parseInt(populationEl.value)
    const symptoms = parseInt(symptomsEl.value)
    const covidSymptoms = parseInt(covidSymptomsEl.value)

    const pCovid = infected / population

    if (isNaN(pCovid)) {
      return
    }

    const pSympGivenCovid = covidSymptoms / 100
    const pSympNormal = symptoms / 365

    // Note that number of covid cases increases the rate of symptoms.
    // Symptoms are caused either by common causes or by covid.
    // P(symp) = P(symptoms not by covid OR symptoms by covid)
    //         = P(symptoms not by covid) + P(symptoms by covid)
    const pSymp = Math.min(1, pSympNormal + pCovid * pSympGivenCovid)

    // Probability of covid given symptoms
    const p = pSympGivenCovid * pCovid / pSymp

    // The prob cannot be lower than pCovid. Also it cannot be larger than 1.
    const pLimited = Math.min(1, Math.max(p, pCovid))

    const percent = pLimited * 100

    const pretty = percent.toFixed(1)

    covidProbEl.innerHTML = '' + pretty
    covidProb2El.innerHTML = '' + pretty
  }

  onInput(infectedEl, ev => compute())
  onInput(populationEl, ev => compute())
  onInput(symptomsEl, ev => compute())
  onInput(covidSymptomsEl, ev => compute())
}, 0)
