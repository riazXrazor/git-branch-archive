#!/usr/bin/env node
var chalk = require('chalk')
var inquirer = require('inquirer')
var shell = require('shelljs')

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

archived_branches = []
delete_branches = []

// get branches merged to selected branch
var merged_branches = shell.exec(`git branch`)
//get the branches
merged_branches = merged_branches.stdout.split('\n')
// remove star and white space
merged_branches = merged_branches.map(function(name) {
  name = name.replace(new RegExp('\\*', 'g'), '')
  return name.trim()
})
// remove empty name
merged_branches = merged_branches.filter(function(name) {
  return name != ''
})

if (merged_branches.length == 0) {
  shell.echo(chalk.red('Sorry, no merged branches found !!'))
  shell.exit(1)
}

var counter = 0
ask_archive()

// Ask for archive
function ask_archive() {
  var branch = merged_branches[counter]
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'a',
        message: chalk.green(
          'Archive branch ' + chalk.red(branch) + ' (just hit enter for YES)?'
        ),
        default: true
      }
    ])
    .then(function(answers) {
      if (answers.a) {
        archived_branches.push(branch)
        counter++
        if (counter != merged_branches.length) {
          ask_archive()
        }
      } else {
        counter++
        if (counter != merged_branches.length) {
          ask_archive()
        }
      }

      if (counter >= merged_branches.length) {
        if (!archived_branches.length) {
          shell.echo(chalk.red('No branches to archive'))
          shell.exit(1)
        }

        counter = 0

        shell.echo()
        shell.echo(chalk.blue('Created archive tags:'))

        create_archive_tags()
      }
    })
}

//Tag and Archive branches
function create_archive_tags() {
  var branch = archived_branches[counter]

  shell.exec('git tag archive/' + branch + ' ' + branch)
  shell.echo(chalk.yellow('archive/' + branch + ' created !!'))
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'a',
        message: chalk.green(
          'Push archive tags to remote (just hit enter for NO)?'
        ),
        default: false
      }
    ])
    .then(function(answers) {
      delete_branches.push(branch)
      if (answers.a) {
        shell.exec('git push origin archive/' + branch)
        counter++
        if (counter != archived_branches.length) {
          create_archive_tags()
        }
      } else {
        counter++
        if (counter != archived_branches.length) {
          create_archive_tags()
        }
      }

      if (counter >= archived_branches.length) {
        counter = 0

        shell.echo()
        shell.echo(chalk.blue('Delete branches remote:'))
        delete_remote_branches()
      }
    })
}

// Delete branches from remote
function delete_remote_branches() {
  var branch = delete_branches[counter]

  shell.echo()
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'a',
        message: chalk.green(
          'Delete ' +
            chalk.red(branch) +
            ' branch from remote (just hit enter for NO)?'
        ),
        default: false
      }
    ])
    .then(function(answers) {
      if (answers.a) {
        shell.exec('git push origin :' + branch)
        counter++
        if (counter != delete_branches.length) {
          delete_remote_branches()
        }
      } else {
        counter++
        if (counter != delete_branches.length) {
          delete_remote_branches()
        }
      }

      if (counter >= delete_branches.length) {
        counter = 0

        shell.echo()
        shell.echo(chalk.blue('Delete branches local:'))

        delete_local_branches()
      }
    })
}

// Delete branches from local
function delete_local_branches() {
  var branch = delete_branches[counter]

  shell.echo()
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'a',
        message: chalk.green(
          'Delete ' +
            chalk.red(branch) +
            ' branch from local (just hit enter for YES)?'
        ),
        default: true
      }
    ])
    .then(function(answers) {
      if (answers.a) {
        shell.exec('git branch -D ' + branch)
        counter++
        if (counter != delete_branches.length) {
          delete_local_branches()
        }
      } else {
        counter++
        if (counter != delete_branches.length) {
          delete_local_branches()
        }
      }

      if (counter >= delete_branches.length) {
        counter = 0
        shell.echo('Complete !!')
        shell.exit(1)
      }
    })
}
