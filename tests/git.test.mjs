import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import {
  getBranch,
  getChangedFiles,
  getLastCommit,
  gitAdd,
  gitCommit,
  hasUncommittedChanges,
  isGitRepo,
} from '../dist/lib/git.js'

function git(root, args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8' })
}

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'study-cli-git-'))
  git(root, ['init', '-q'])
  git(root, ['config', 'user.name', 'study-cli-test'])
  git(root, ['config', 'user.email', 'study-cli@example.com'])
  return root
}

test('Git 状态检测', () => {
  const root = makeRepo()
  assert.equal(isGitRepo(root), true)
  assert.equal(hasUncommittedChanges(root), false)

  fs.writeFileSync(path.join(root, 'a.md'), '# hi\n', 'utf8')
  assert.equal(hasUncommittedChanges(root), true)
  assert.deepEqual(getChangedFiles(root), ['a.md'])

  const add = gitAdd(root, ['a.md'])
  assert.equal(add.status, 0)
  const commit = gitCommit(root, 'init')
  assert.equal(commit.status, 0)
  assert.equal(hasUncommittedChanges(root), false)
  assert.ok(getLastCommit(root).includes('init'))
  assert.ok(getBranch(root).length > 0)

  fs.rmSync(root, { recursive: true, force: true })
})

test('非 Git 目录检测', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'study-cli-nogit-'))
  assert.equal(isGitRepo(root), false)
  fs.rmSync(root, { recursive: true, force: true })
})
