/*
 * Copyright 2021 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'

import Options from './options'
import checkers from './registrar'
import { checkPrerequistes } from './ui'

/**
 * Prereq check
 */
export default async function up(args: Arguments<Options>) {
  const stdout = await args.createOutputStream()
  const stderr = await args.createErrorStream()

  const checkResults = await checkPrerequistes(args, stdout, args.parsedOptions.fix)

  const nOk = checkResults.reduce((nOk, result) => nOk + (result.ok ? 1 : 0), 0)

  const nCheckers = checkers(args).length
  if (nOk === nCheckers) {
    stdout(`\n🚀 You are all set!`)
    //       ^^ rocket unicode
    // makes Kui happy:
    return ''
  } else {
    if (!args.parsedOptions.fix) {
      const prefixIdx = args.command.indexOf(' up')
      const prefix = prefixIdx <= 0 ? '' : args.command.slice(0, prefixIdx) + ' '
      stderr(`\nTry ${colors.cyan(`${prefix}up --fix`)} to automatically fix problems`)
    }

    const nNotOk = nCheckers - nOk
    throw new Error(colors.red(`\n💣 ${nNotOk} prerequisite${nNotOk === 1 ? '' : 's'} not satisfied`))
    //                            ^^ bomb unicode
  }
}
