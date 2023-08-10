import fetch from 'cross-fetch'
import fs from 'fs'

export function loadFileWithPromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

export async function loadHttpJson(url, tag) {
  try {
    const res = await fetch(url)
    if (res.status >= 400) {
      throw new Error(tag + ' Bad response from server when fetching key')
    }

    try {
      let json = await res.json()
      return json
    } catch (error) {
      console.warn(tag + " Can't parse the json content, check your response content")
    }
    let text = await res.text()
    return JSON.parse(text)
  } catch (err) {}
}

/**
 *
 * @param {string} uri
 * @returns
 */
export function isHttpUri(uri) {
  return uri.startsWith('http')
}

/**
 *
 * @param {string} uri
 * @returns
 */
export function isLocalFile(uri) {
  //Todo: review
  return !uri.startsWith('http')
}

/**
 *
 * @param {string} baseUri
 * @param {string} uri
 * @param {string} entityName
 */
export function fromatEntityPrivateKeyUri(baseUri, uri, entityName) {
  return baseUri != null ? `${baseUri}${entityName}.json` : uri
}

/**
 *
 * @param {string} baseUri
 * @param {string} entityName
 */
export function fromatEntitySchemaTemplateUri(baseUri, entityName) {
  return `${baseUri}${entityName}.json`
}

/**
 *
 * @param {string} url
 * @returns
 */
export function isValidUriBaseUrl(url) {
  return url.endsWith('/')
}
