export const makeLookupTable = (data, key) =>
  new Map(data.map(item => [item[key], item]))

// Returns a filter: Set(ids) => Set(ids)
export const makeFilter = filterFn => ids =>
  new Set([...ids].filter(filterFn))

// Returns a filter: Set(ids) => Set(ids)
export const makeInputFilter = (element, lookupTable, comparison = comparisons.eq) => {
  return makeFilter(id => {
    const dataValue = lookupTable.get(id)[element.name]
    return comparison(dataValue, element.value)
  })
}

// Returns a single filter: Set(ids) => Set(ids)
export const joinFilters = (filters, relation) => ids => {
  return filters.reduce((result, filter) => {
    return result
      ? relation(result, filter(ids))
      : filter(ids)
  }, null)
}

// Comparison functions by key, to allow setting via data attribute
export const comparisons = {
  eq: (a, b) => String(a) === b,
  gt: (a, b) => a > Number(b),
  gte: (a, b) => a >= Number(b),
  lt: (a, b) => a < Number(b),
  lte: (a, b) => a <= Number(b)
}