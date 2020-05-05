import path from 'path'
import * as core from '@actions/core'
import {report} from './report'

interface Result {
  result: {
    covered_percent: number
  }
}

async function run(): Promise<void> {
  try {
    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    core.debug(`failedThreshold ${failedThreshold}`)

    const resultPath: string = core.getInput('resultPath')
    core.debug(`resultPath ${resultPath}`)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports
    const json = require(path.resolve(process.env.GITHUB_WORKSPACE!, resultPath)) as Result
    const coveredPercent = json.result.covered_percent

    if (coveredPercent < failedThreshold) {
      throw new Error(`Coverage is less than ${failedThreshold}%. (${coveredPercent}%)`)
    }

    await report(coveredPercent, failedThreshold)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
