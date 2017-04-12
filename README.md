# git-archive
Nodejs script to archive branches that are merged.This is done by tagging them as archive/<branchname> and removing them both locally and remotely. Before each operation, the user is asked for confirmation.

When working on a project, the number of branches tend to increase linearly with the work being done and clutter the branch list. When you look at the branches, you just want to see the active branches. A common way to deal with this problem in git is to archive branches. Git doesn’t natively supported the concept of an archived branch, but the usual way to emulate this is by creating a tag called archive/<branchname> and removing the branch after that. If you have many branches, it is convenient to be able to do this automatically and interactively. I wrote a little node script to make the whole thing take little time and effort.

### Installation
```
npm install git-archive -g
```

### Version
**0.0.1**

### Usage

Simply call `gitarc` from the command in a git maintained project.


### Feedback

If there there are any bugs please let me know.
