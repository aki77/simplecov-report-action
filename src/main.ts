import path from 'path'
import * as core from '@actions/core'
import {report} from './report'

interface Result {
  result: {
    covered_percent?: number // NOTE: simplecov < 0.21.0
    line?: number
  }
}

async function run(): Promise<void> {
  try {
    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    core.debug(`failedThreshold ${failedThreshold}`)

    const resultPath: string = core.getInput('resultPath')
    core.debug(`resultPath ${resultPath}`)

    const pullRequestId: number = Number.parseInt(core.getInput('pullRequestId'), 10)
    core.debug(`pullRequestId ${pullRequestId}`)

    const customTitle: string = core.getInput('customTitle')
    core.debug(`customTitle ${customTitle}`)

    const customText: string = core.getInput('customText')
    core.debug(`customText ${customText}`)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const json = require(path.resolve(process.env.GITHUB_WORKSPACE!, resultPath)) as Result
    const coveredPercent = json.result.covered_percent ?? json.result.line

    if (coveredPercent === undefined) {
      throw new Error('Coverage is undefined!')
    }

    await report(coveredPercent, failedThreshold, pullRequestId, customTitle, customText)

    if (coveredPercent < failedThreshold) {
      throw new Error(`Coverage is less than ${failedThreshold}%. (${coveredPercent}%)`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
