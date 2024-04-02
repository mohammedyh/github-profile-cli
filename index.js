import { input, select } from '@inquirer/prompts'
import pc from 'picocolors'
import { fetchGithubUser } from './utils/fetchGithubUser.js'

let data, requestsLeft

await input({
  message: 'Enter your GitHub username:',
  validate: async (username) => {
    const { status, userData, ratelimitData } = await fetchGithubUser(username)
    data = userData
    requestsLeft = ratelimitData

    return username.trim() !== '' && status
  },
})

const actions = await select({
  message: 'What information do you want to see?',
  choices: [
    {
      name: 'Profile information',
      value: 'profile-info',
      description: 'An overview of your profile',
    },
    {
      name: 'List of repositories',
      value: 'list-repos',
      description: 'A list of your repositories',
    },
  ],
})

if (actions === 'profile-info') {
  console.log(`${pc.cyan('Username:')} ${data.login}`)
  console.log(`${pc.cyan('Name:')} ${data.name ?? 'Not set'}`)
  console.log(`${pc.cyan('Bio:')} ${data.bio?.trim() ?? 'Not set'}`)
  console.log(`${pc.cyan('Company:')} ${data.company ?? 'Not set'}`)
  console.log(`${pc.cyan('Email:')} ${data.email ?? 'Not set'}`)
  console.log(`${pc.cyan('Location:')} ${data.location ?? 'Not set'}`)
  console.log(`${pc.cyan('Blog:')} ${data.blog ? pc.underline(data.blog) : 'Not set'}`)
  console.log(`${pc.cyan('Profile URL:')} ${pc.underline(data.html_url)}`)
} else {
  const response = await fetch(data.repos_url)
  const reposData = await response.json()

  const formattedChoices = reposData.map((repo, index) => ({
    name: `${index}: ${repo.name}`,
    value: repo.name,
    description: repo.description,
  }))
  const repoAction = await select({
    message: 'Choose a repo for more details',
    choices: formattedChoices,
  })
  const selectedRepo = reposData.find((repo) => repo.name === repoAction)

  console.log(`${pc.cyan('Name:')} ${selectedRepo.name}`)
  console.log(`${pc.cyan('Description:')} ${selectedRepo.description?.trim() ?? 'Not set'}`)
  console.log(`${pc.cyan('Language:')} ${selectedRepo.language}`)
  console.log(`${pc.cyan('Stars:')} ${selectedRepo.stargazers_count}`)
  console.log(`${pc.cyan('Forks:')} ${selectedRepo.forks_count}`)
  console.log(`${pc.cyan('Watchers:')} ${selectedRepo.watchers_count}`)
  console.log(`${pc.cyan('Open Issues:')} ${selectedRepo.open_issues}`)
  console.log(`${pc.cyan('Is a Fork:')} ${selectedRepo.fork}`)
  console.log(`${pc.cyan('Repo URL:')} ${pc.underline(selectedRepo.html_url)}`)
  console.log(
    `${pc.cyan('Website URL:')} ${
      selectedRepo.homepage ? pc.underline(selectedRepo.homepage) : 'Not set'
    }`
  )
  console.log(`${pc.cyan('CLI Clone Command:')} gh repo clone ${selectedRepo.full_name}`)
}
console.log(pc.magenta(pc.bold(`API Requests Remaining: ${requestsLeft}`)))
