import * as core from '@actions/core'
import {report} from './report'

interface Result {
  result: {
    covered_percent: number
  }
}

async function run(): Promise<void> {
  try {
    const minCoverage: number = Number.parseInt(core.getInput('minCoverage'), 10)
    core.debug(`minCoverage ${minCoverage}`)

    const resultPath: string = core.getInput('resultPath')
    core.debug(`resultPath ${resultPath}`)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const json = require(resultPath) as Result
    const coveredPercent = json.result.covered_percent

    if (coveredPercent < minCoverage) {
      throw new Error(`Coverage is less than ${minCoverage}%. (${coveredPercent}%)`)
    }

    await report(coveredPercent, minCoverage)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
