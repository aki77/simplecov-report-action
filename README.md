It's now recommended to use [octocov](https://github.com/k1LoW/octocov) instead of this approach.

----

# Simplecov Report

A GitHub Action that report simplecov coverage.

![Demo](https://i.gyazo.com/c4e572c91fe8048c95392ea3ddce79f5.png)

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
    steps:
      - name: Test
        run: bundle exec rspec

      - name: Simplecov Report
        uses: aki77/simplecov-report-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
