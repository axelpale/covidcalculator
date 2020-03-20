var template = require('./template.ejs')
var queryString = require('query-string')

var elById = function (id) {
  return document.getElementById(id)
}
var onInput = function (el, handler) {
  el.addEventListener('input', handler)
}

var getIntOr = function (val, def) {
  if (val) {
    return parseInt(val)
  }
  return def
}

var setPropIfNot = function (obj, key, value, avoid) {
  if (value === avoid) {
    return
  }
  obj[key] = value
}

var contEl = elById('container')
contEl.innerHTML = template({})

// Default field values
var defaultInfected = null
var defaultPopulation = null
var defaultSymptoms = 10
var defaultCovidSymptoms = 95

// Read possible hash parameters to override the defaults
var hash = queryString.parse(document.location.hash)
var initInfected = getIntOr(hash.infec, defaultInfected)
var initPopulation = getIntOr(hash.popul, defaultPopulation)
var initSymptoms = getIntOr(hash.sym, defaultSymptoms)
var initCovidSymptoms = getIntOr(hash.cov, defaultCovidSymptoms)

setTimeout(function () {
  var infectedEl = elById('infected')
  var populationEl = elById('population')
  var symptomsEl = elById('symptoms')
  var covidSymptomsEl = elById('covidSymptoms')

  // Set defaults
  infectedEl.value = getIntOr(initInfected, '')
  populationEl.value = getIntOr(initPopulation, '')
  symptomsEl.value = getIntOr(initSymptoms, '')
  covidSymptomsEl.value = getIntOr(initCovidSymptoms, '')

  var resultsEl = elById('results')
  var resultsPromptEl = elById('results-prompt')
  var covidProbEl = elById('covidProb') // Result value
  var covidProb2El = elById('covidProb2') // Result value
  var resultsLinkEl = elById('results-link')

  var compute = function () {
    var infected = parseInt(infectedEl.value)
    var population = parseInt(populationEl.value)
    var symptoms = parseInt(symptomsEl.value)
    var covidSymptoms = parseInt(covidSymptomsEl.value)

    var pCovid = infected / population

    if (isNaN(pCovid)) {
      return
    }

    // Set hash with new numbers.
    var newHash = {}
    setPropIfNot(newHash, 'infec', infected, defaultInfected)
    setPropIfNot(newHash, 'popul', population, defaultPopulation)
    setPropIfNot(newHash, 'sym', symptoms, defaultSymptoms)
    setPropIfNot(newHash, 'cov', covidSymptoms, defaultCovidSymptoms)
    document.location.hash = queryString.stringify(newHash)

    // Field values to probabilities
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

    // Set result link
    resultsLinkEl.href = '' + document.location.href
    resultsLinkEl.innerHTML = '' + document.location.href
  }

  onInput(infectedEl, function (ev) { compute() })
  onInput(populationEl, function (ev) { compute() })
  onInput(symptomsEl, function (ev) { compute() })
  onInput(covidSymptomsEl, function (ev) { compute() })

  // Run compute once to apply possible hash parameters.
  compute()
}, 0)
