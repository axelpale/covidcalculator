var template = require('./template.ejs')

var elById = function (id) {
  return document.getElementById(id)
}
var onInput = function (el, handler) {
  el.addEventListener('input', handler)
}

var contEl = elById('container')
contEl.innerHTML = template({})

setTimeout(function () {
  var infectedEl = elById('infected')
  var populationEl = elById('population')
  var symptomsEl = elById('symptoms')
  var covidSymptomsEl = elById('covidSymptoms')

  var resultsEl = elById('results')
  var resultsPromptEl = elById('results-prompt')
  var covidProbEl = elById('covidProb') // Result value
  var covidProb2El = elById('covidProb2') // Result value

  var compute = function () {
    var infected = parseInt(infectedEl.value)
    var population = parseInt(populationEl.value)
    var symptoms = parseInt(symptomsEl.value)
    var covidSymptoms = parseInt(covidSymptomsEl.value)

    var pCovid = infected / population

    if (isNaN(pCovid)) {
      return
    }

    var pSympGivenCovid = covidSymptoms / 100
    var pSympNormal = symptoms / 365

    // Note that number of covid cases increases the rate of symptoms.
    // Symptoms are caused either by common causes or by covid.
    // P(symp) = P(symptoms not by covid OR symptoms by covid)
    //         = P(symptoms not by covid) + P(symptoms by covid)
    var pSymp = Math.min(1, pSympNormal + pCovid * pSympGivenCovid)

    // Probability of covid given symptoms
    var p = pSympGivenCovid * pCovid / pSymp

    // The prob cannot be lower than pCovid. Also it cannot be larger than 1.
    var pLimited = Math.min(1, Math.max(p, pCovid))

    var percent = pLimited * 100

    var pretty = percent.toFixed(1)

    covidProbEl.innerHTML = '' + pretty
    covidProb2El.innerHTML = '' + pretty

    // Hide prompt and show results
    resultsEl.className = ''
    resultsPromptEl.className = 'd-none'
  }

  onInput(infectedEl, function (ev) { compute() })
  onInput(populationEl, function (ev) { compute() })
  onInput(symptomsEl, function (ev) { compute() })
  onInput(covidSymptomsEl, function (ev) { compute() })
}, 0)
