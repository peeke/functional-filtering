export const dedupe = arr => [...new Set(arr)]

export const renderTemplate = (template, data) => {
  return template
    .match(/\$\{([^}]+)\}/g)
    .reduce((result, match) => {
      const key = match.replace(/[${}\s]/g, '')
      return result.replace(match, data[key])
    }, template)
}