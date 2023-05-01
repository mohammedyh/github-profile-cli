import chalk from 'chalk'
import { GITHUB_API_ENDPOINT } from './constants.js'

/**
 * @param {string} value
 */
export async function fetchGithubUser(value) {
  try {
    const response = await fetch(`${GITHUB_API_ENDPOINT}/${value}`)
    const userData = await response.json()
    const ratelimitData = response.headers.get('x-ratelimit-remaining')
    return { status: response.ok, userData, ratelimitData }
  } catch (error) {
    console.log(chalk.red(error.message))
    return
  }
}
