import pc from 'picocolors'
import { GITHUB_API_ENDPOINT } from './constants.js'

export async function fetchGithubUser(username) {
  try {
    const response = await fetch(`${GITHUB_API_ENDPOINT}/${username}`)
    const userData = await response.json()
    const ratelimitData = response.headers.get('x-ratelimit-remaining')
    return { status: response.ok, userData, ratelimitData }
  } catch (error) {
    console.log(pc.red(error.message))
    return
  }
}
