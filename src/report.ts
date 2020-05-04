import * as core from '@actions/core'
import * as github from '@actions/github'
import markdownTable from 'markdown-table'

export async function report(coveredPercent: number, minCoverage: number): Promise<void> {
  const summaryTable = markdownTable([
    ['Covered', 'Minimum'],
    [`${coveredPercent}%`, `${minCoverage}%`]
  ])

  const octokit = new github.GitHub(core.getInput('token'))

  const pullRequestId = github.context.issue.number
  if (!pullRequestId) {
    throw new Error('Cannot find the PR id.')
  }

  await octokit.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: pullRequestId,
    body: `## Coverage
${summaryTable}
`
  })
}
