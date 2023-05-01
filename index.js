import { input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { fetchGithubUser } from './utils/fetchGithubUser.js'

let data, requestsLeft

await input({
  message: 'Enter your GitHub username:',
  validate: async (value) => {
    const { status, userData, ratelimitData } = await fetchGithubUser(value)
    data = userData
    requestsLeft = ratelimitData

    return value.trim() !== '' && status
  },
})

const actions = await select({
  message: 'What information do you want to see?',
  choices: [
    {
      name: 'Profile information',
      value: 'profile-info',
      description: 'An overview of your profile information',
    },
    {
      name: 'List of repositories',
      value: 'list-repos',
      description: 'A list of your repositories',
    },
  ],
})

if (actions === 'profile-info') {
  console.log(`Username: ${data.login}`)
  console.log(`Name: ${data.name ?? 'Not set'}`)
  console.log(`Bio: ${data.bio ?? 'Not set'}`)
  console.log(`Company: ${data.company ?? 'Not set'}`)
  console.log(`Email: ${data.email ?? 'Not set'}`)
  console.log(`Location: ${data.location ?? 'Not set'}`)
  console.log(`Blog: ${data.blog}`)
  console.log(`Profile URL: ${data.html_url}`)
  console.log(chalk.magentaBright.bold(`Requests remaining: ${requestsLeft}`))
} else if (actions === 'list-repos') {
  // fetch (some) repos from `data.repos_url`
  // maybe only fetch the pinned repos, if possible
  // display to screen
  // (optional): make each repo a select item, users can choose a repo and get repo stats
}
