# Contributing 🖖

We can't thank you enough for your desire to help with this project. 🥳

We welcome community support with both pull requests and reporting bugs. Please don't hesitate to jump in.

## Review PRs

Check out the list of opened pull requests if there is something you might be interested in.

Maybe somebody is trying to fix that annoying bug that bothers you. Review the PR.

Do you have any better ideas how to fix this problem? Let us know.

## Issues

We have three types of issues:

- [Bug report](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+)
- [Feature request](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=feature&template=feature_request.yml&title=%5BFeature%5D%3A+)
- [Help wanted](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=help+wanted&template=help_wanted.yml&title=%5BHelp+wanted%5D%3A+)

You can always help, by commenting on already opened issues.

_Note: Occasionally issues are opened that are unclear, or we cannot verify them. When the issue author has not responded to our questions for verification within 7 days then we will close the issue._

## Pull requests

**@vatis-tech/asr-client-js** is open source, so any help is greatly appreciated ❤️.

Before opening a pull request, please open an issue first, so you can discuss it with the maintainers of the project, or, if the issue is already opened, please comment there your intention of opening a pull request.

To make it easier for the people who will review your code, please make sure to make pull requests with just one bug fix, or feature request.

### Branch names

To link better between the issues and pull requests, we've come up with the following branching names:

1. `feature/VAT-{{issue-number}}`: This type of branch relates to an issue that will add new code and new functionality to the **@vatis-tech/asr-client-js** plugin.
2. `fix/VAT-{{issue-number}}`: This type of branch relates to an issue that will solve the code or the functionality to the **@vatis-tech/asr-client-js** plugin.
3. `docs/VAT-{{issue-number}}`: This type of branch relates to changes/additions/removals/typos/etc only to comments or documentation (markdown files such as the `README`), and not code or functionality of the **@vatis-tech/asr-client-js** plugin.
4. `style/VAT-{{issue-number}}`: This type of branch relates to code styles changes of the **@vatis-tech/asr-client-js** plugin. For example you could prettify a file.

`{{issue-number}}` in each type of branches, refers to the issue number you want to address the pull request.

### Commit message format

You should always create commits for each file. So a commit will refer to only one file, or a chunk of a file.

Each commit message should have the following structure:

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### <header>

The `<header>` is always mandatory, and the its length should not be more than 72 characters.

It must have the following format:

```
VAT-{{issue-number}}: <<small description>>
```

Where `{{issue-number}}` refers to the issue number you want to address the pull request.

And `<<small description>>` is a summary in present tense of the commit, without capitalization, and no period at the end.

#### <body>

The body is not mandatory, if the `<<small description>>` of the `<header>` is enough to understand the commit.

If the `<<small description>>` is not intuitive enough, the `<body>` is mandatory and must conform to the following rules:

- Just as in the `<<small description>>`, use the imperative, present tense: "fix" not "fixed" nor "fixes".
- Explain the motivation for the change in the commit message body. This commit message should explain why you are making the change. You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

#### <footer>

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to. For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

#### <BLANK LINE>

Is aline that is left blank. This is needed to differentiate between the header, body and footer.

### Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- Information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`.
- A clear description of the reason for reverting the commit message.
