# Simplecov Report

A GitHub Action that report simplecov coverage.

## Usage:

The action works only with `pull_request` event.

### Inputs

- `token` - The GITHUB_TOKEN secret.
- `failedThreshold` - Failed threshold. (default: `90`)
- `resultPath` - Path to last_run json file. (default: `coverage/.last_run.json`)

## Example

```yaml
name: Tests
on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - name: Test
        run: npm test

      - name: Simplecov Report
        uses: aki77/simplecov-report-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

[![Image from Gyazo](https://i.gyazo.com/1c714c9a698a3acc425fa9cae5707e87.png)](https://gyazo.com/1c714c9a698a3acc425fa9cae5707e87)
