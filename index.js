const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  core.info('Running action');
  try {
    const token = core.getInput('GITHUB_TOKEN');
    const issueNumber = core.getInput('ISSUE_NUMBER');
    const commentBody = core.getInput('COMMENT_BODY');
    const octokit = github.getOctokit(token);
    const context = github.context;
    core.info('octokit status', octokit);

    if (commentBody.startsWith('/remind')) {
      await octokit.rest.reactions.createForIssueComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        content: '+1',
      });
      const timestamp = Date.now();
      const filename = `reminder_${issueNumber}_${timestamp}.txt`;
      fs.writeFileSync(filename, commentBody);
    } else {
      core.info('This is not a reminder comment. Skipping...');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
