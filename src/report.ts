import * as core from '@actions/core'
import * as github from '@actions/github'
import replaceComment from '@aki77/actions-replace-comment'
import {markdownTable} from 'markdown-table'

export async function report(
  coveredPercent: number,
  failedThreshold: number,
  prId?: number,
  customTitle?: string,
  customText?: string
): Promise<void> {
  const summaryTable = markdownTable([
    ['Covered', 'Threshold'],
    [`${coveredPercent}%`, `${failedThreshold}%`]
  ])

  const title = customTitle ? `## ${customTitle} Simplecov Report` : '## Simplecov Report'
  core.debug(`title ${title}`)

  const pullRequestId = prId || github.context.issue.number
  core.debug(`pullRequestId ${pullRequestId}`)

  if (pullRequestId) {
    await replaceComment({
      token: core.getInput('token', {required: true}),
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestId,
      body: `${title}
  ${summaryTable}
  
  ${customText}
  `
    })
  }

  await core.summary
    .addHeading(`${customTitle} Simplecov Report`)
    .addTable([
      [
        {data: 'Covered', header: true},
        {data: 'Threshold', header: true}
      ],
      [`${coveredPercent}%`, `${failedThreshold}%`]
    ])
    .write()
}
