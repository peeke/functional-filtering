import { union, intersection } from '/js/set-operations.js'
import { makeLookupTable, makeFilter, joinFilters } from '/js/filtering.js'
import { renderTemplate } from '/js/helpers.js'
import listen from '/js/listen.js'

const elements = {
  form: document.querySelector('form'),
  room1: document.getElementById('rooms-1'),
  room2: document.getElementById('rooms-2'),
  room3: document.getElementById('rooms-3'),
  type1: document.getElementById('type-1'),
  type2: document.getElementById('type-2'),
  type3: document.getElementById('type-3'),
  type4: document.getElementById('type-4'),
  price: document.getElementById('price'),
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

  // Create filters and store in a map with their respective element as key for easy reference
  // Map( [ key: Element, value: filter() ] )
  const filterMap = new Map([
    [elements.room1, makeFilter(id => String(lookupTable.get(id)[elements.room1.name]) === elements.room1.value)],
    [elements.room2, makeFilter(id => String(lookupTable.get(id)[elements.room2.name]) === elements.room2.value)],
    [elements.room3, makeFilter(id => lookupTable.get(id)[elements.room3.name] >= Number(elements.room3.value))],
    [elements.type1, makeFilter(id => String(lookupTable.get(id)[elements.type1.name]) === elements.type1.value)],
    [elements.type2, makeFilter(id => String(lookupTable.get(id)[elements.type2.name]) === elements.type2.value)],
    [elements.type3, makeFilter(id => String(lookupTable.get(id)[elements.type3.name]) === elements.type3.value)],
    [elements.type4, makeFilter(id => String(lookupTable.get(id)[elements.type4.name]) === elements.type4.value)],
    [elements.price, makeFilter(id => lookupTable.get(id)[elements.price.name] >= Number(elements.price.value))]
  ]);

  const filter = ids => {

    const getActiveFilters = inputs => inputs
      .filter(input => input.value)
      .filter(input => input.type !== 'checkbox' || input.checked)
      .map(input => filterMap.get(input))

    const roomGroup = getActiveFilters([elements.room1, elements.room2, elements.room3])
    const typeGroup = getActiveFilters([elements.type1, elements.type2, elements.type3, elements.type4])
    const priceGroup = getActiveFilters([elements.price])

    const result = joinFilters([
      // If the group is empty, we fall back to input set of ids
      // when no filters in a group are activated, this usually means we shouldn't apply them at all
      roomGroup.length ? joinFilters(roomGroup, union) : () => ids,
      typeGroup.length ? joinFilters(typeGroup, union) : () => ids,
      priceGroup.length ? joinFilters(priceGroup, union) : () => ids
    ], intersection)

    return result(ids)

  }

  const renderResults = results => [...results]
    .map(id => lookupTable.get(id))
    .map(data => renderTemplate(resultTemplate, data))
    .join('')

  // Render initially
  elements.results.innerHTML = renderResults(completeSet)

  // Re-render on change
  listen(elements.form, 'change')
    .map(() => filter(completeSet))
    .forEach(results => elements.results.innerHTML = renderResults(results))

}