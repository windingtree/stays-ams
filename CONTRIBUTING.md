# Contributing

Thank you for your interest in contributing to Winding Tree! ❤️🌳 

Definitions for "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", "MAY" are covered in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

# Using the issue tracker

The issue tracker is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests), and [submitting pull requests](#submitting-pull-requests), but please respect the following restrictions:

* Please **do not** use the issue tracker for personal support requests (use [Discord](https://discord.gg/wHXzyrC6vA)).
* Please **do not** derail or troll issues. Keep the discussion on topic and respect the opinion of others.

## Bug reports

A bug is a *demonstrable problem* that is caused by code in the repository. Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** - check if the issue has *already* been reported.
2. **Check if the issue has been fixed** - try to reproduce it using the latest `main` branch in the repository.
3. **Isolate the problem** - create a reduced test case and a live example.

A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All these details will help people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
> <url> - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being reported. This might include the lines of code that you have identified as causing the bug, and potential solutions (and your opinions on their merits).

## Feature requests

Feature requests are welcome, but take a moment to find out whether your idea fits with the scope and aims of the project. It's up to *you* to make a strong case to convince the project's developers of the merits of this feature. Please provide as much detail and context as possible.

# Engineering standards

All ongoing development for an upcoming release gets committed to the **`main`** branch. The `main` branch technically serves as the "development" branch as well, but all code that is committed to the `main` branch should be considered *stable*.

You should ensure any changes are clear and well-documented. When we say "well-documented":

* If the changes include code, ensure all additional code has documentation in and around it. This includes documenting the definitions of functions, statements in code, sections.
* The most helpful code comments explain why, establish context, or efficiently summarize how. Avoid simply repeating details from declarations. When in doubt, favour overexplaining to underexplaining.
* Code comments should be consistent with their language conventions. For example, please use [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) for TypeScript/JavaScript, or [NatSpec](https://docs.soliditylang.org/en/v0.8.13/natspec-format.html) for Solidity.
* Any new features must have a corresponding **doc** [issue](#using-the-issue-tracker) raised to ensure the creation of user documentation.
* Commented-out code **shall not** submitted. If the code does not need to be used anymore, please remove it.
* While `TODO` comments are frowned upon, every now and then it is OK to put a `TODO` to note that a particular section of code needs to be worked on in the future. However, it is also known that "TODOs" often do not get worked on, and as such, it is more likely you will be asked to complete the TODO at the time you submit it.
* Write clear, descriptive [commit messages](#commit-messages).

Please provide unit tests with your code if possible (**shall be provided for smart-contracts**). If unable to provide a unit test, please provide an explanation as to why in your pull request, including a description of the steps used to manually verify the changes.

You *should* make atomic changes, as these are preferred over bulk changes of everything. Each commit tells a story about what changes are being made. This makes it easier to identify when a bug is introduced into the codebase, and as such makes it easier to fix.

All commits shall either be rebased in atomic order or squashed (if the squashed commit is considered atomic). Merge commits shall not be accepted. All conflicts must be resolved prior to pushing changes.

**All pull requests should be made to the `main` branch**. All PRs to `main` branch shall be subject to review. Repository restrictions shall be setup to prohibit the merging of code that has not been reviewed.

## Commit Messages

Commit messages **must** be in accordance with [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification). See [why we use conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#why-use-conventional-commits).

## Submitting Pull Requests

Good pull requests - patches, improvements, new features - are a fantastic help! They should remain focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any significant pull request (e.g. implementing features, refactoring code, porting to a different language), otherwise you risk spending a lot of time working on something that the project's developers might not want to merge into the project. You can find us in [discord](https://discord.gg/Te8YV373Ss) and we will be happy to hear your suggestions.

Please adhere to the coding conventions used throughout a project (indentation, accurate comments, etc) and any other requirements (such as test coverage).

Follow this process if you'd like your work considered for inclusion in the project:

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork, and configure the remotes:

```bash
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/<repo-name>
# Navigate to the newly cloned directory
cd <repo-name>
# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/<upstream-owner>/<repo-name>
```

2. If you cloned a while ago, get the latest changes from upstream:

```bash
git checkout <dev-branch>
git pull upstream <dev-branch>
```

3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

```bash
git checkout -b <topic-branch-name>
```

4. Commit your changes in logical chunks. Ensure that these [git commit message guidelines](#commit-messages) are followed or your code is unlikely to be merged into the `main`.

5. Locally merge (or rebase) the upstream development branch (`main`) into your topic branch:

```bash
git pull [--rebase] upstream <dev-branch>
```

6. Push your topic branch up to your fork:

```bash
git push origin <topic-branch-name>
```

7. [Open a pull request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

**IMPORTANT**: By submitting a patch, you agree to allow the project owner to license your work under the same license as that used by the project.

# Releases & Versioning

Overall, release tags should attempt to follow the [semantic versioning](https://semver.org/) scheme. Tagging of releases shall be handled by repository maintainers.

# CI/CD Environments

WindingTree makes use of GitHub actions to automate testing, deployment and release cycles.

## Development

The development environment shall deploy on all merged PRs into the `main` branch.

## Production

The production environment shall deploy on all tagged releases from the `main` branch.
