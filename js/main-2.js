import { union, intersection } from '/js/set-operations.js'
import { makeLookupTable, makeInputFilter, joinFilters, comparisons } from '/js/filtering.js'
import { dedupe, renderTemplate } from '/js/helpers.js'
import listen from '/js/listen.js'

const elements = {
  form: document.querySelector('form'),
  inputs: Array.from(document.querySelector('form').querySelectorAll('[name]')),
  results: document.getElementById('results'),
}

const resultTemplate = document.getElementById('result').innerHTML

fetch('/data.json')
  .then(result => result.json())
  .then(data => app(data))

function app(data) {

  // Construct the lookup table and the complete set of ids
  // Map( [ key: 'id', value: {} ] )
  const lookupTable = makeLookupTable(data, 'id')
  const completeSet = new Set(lookupTable.keys())

  // Create filters and store in a weakmap with their respective element as key for easy reference
  // WeakMap( [ key: Element, value: inputFilter() ] )
  const filterMap = new WeakMap(
    elements.inputs.map(input => [input, makeInputFilter(input, lookupTable, comparisons[input.dataset.comparison])])
  )

  // Get all active filters for a given input name
  const getActiveFilters = (inputs, groupName) => inputs
    .filter(input => input.name === groupName)
    .filter(input => input.value)
    .filter(input => input.type !== 'checkbox' || input.checked)
    .map(input => filterMap.get(input))

  const filter = ids => {

    // Construct groups by input names
    const inputNames = elements.inputs.map(element => element.name)
    const groupFilters = dedupe(inputNames)
      .map(groupName => getActiveFilters(elements.inputs, groupName))
      .map(filters => filters.length ? joinFilters(filters, union) : () => ids)

    // Join the array of single filters per group, joined by intersection
    const result = joinFilters(groupFilters, intersection)

    return result(ids)

  }

  const renderResults = results => [...results]
    .map(id => lookupTable.get(id))
    .map(data => renderTemplate(resultTemplate, data))
    .join('')

  // Re-render on change
  listen(elements.form, 'change')
    .map(() => filter(completeSet))
    .forEach(results => elements.results.innerHTML = renderResults(results))

  elements.results.innerHTML = renderResults(completeSet)

}