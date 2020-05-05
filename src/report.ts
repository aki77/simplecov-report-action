import * as core from '@actions/core'
import * as github from '@actions/github'
import markdownTable from 'markdown-table'

const HEADER = '## Simplecov Report'

const issues = (): github.GitHub['issues'] => {
  return new github.GitHub(core.getInput('token')).issues
}

const getOldCommentIds = async (pullRequestId: number): Promise<number[]> => {
  const {data: existingComments} = await issues().listComments({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: pullRequestId
  })

  return existingComments.filter(({body}) => body.startsWith(HEADER)).map(({id}) => id)
}

const deleteOldComments = async (pullRequestId: number): Promise<void> => {
  const ids = await getOldCommentIds(pullRequestId)

  for (const id of ids) {
    issues().deleteComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      comment_id: id
    })
  }
}

export async function report(coveredPercent: number, failedThreshold: number): Promise<void> {
  const summaryTable = markdownTable([
    ['Covered', 'Threshold'],
    [`${coveredPercent}%`, `${failedThreshold}%`]
  ])

  const pullRequestId = github.context.issue.number
  if (!pullRequestId) {
    throw new Error('Cannot find the PR id.')
  }

  deleteOldComments(pullRequestId)

  await issues().createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: pullRequestId,
    body: `${HEADER}
${summaryTable}
`
  })
}
