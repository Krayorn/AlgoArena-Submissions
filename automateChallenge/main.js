import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { EUploadMimeType, TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import chalk from 'chalk';
import inquirer from 'inquirer';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function getRepoInfo(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
}

async function getIssues(owner, repo) {
  const { data } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
  });
  return data;
}

async function extractVideoFromIssue(issue) {
  const githubVideoRegex = /https:\/\/github\.com\/(?:user-attachments\/assets\/[a-f0-9-]+|[^/]+\/[^/]+\/assets\/\d+\/[a-f0-9-]+)/;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;

  const githubMatch = issue.body.match(githubVideoRegex);
  const youtubeMatch = issue.body.match(youtubeRegex);

  if (youtubeMatch) {
    return { type: 'youtube', url: youtubeMatch[0], id: youtubeMatch[1] };
  } else if (githubMatch) {
    return { type: 'github', url: githubMatch[0] };
  } else {
    return null;
  }
}

async function downloadVideo(url) {
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error(chalk.red('Error downloading video:'), error);
    throw error;
  }
}

async function waitForVideoProcessing(mediaId) {
  let processingInfo;
  do {
    const result = await client.v1.mediaInfo(mediaId);
    processingInfo = result.processing_info;
    if (processingInfo.state === 'succeeded') {
      return;
    }
    if (processingInfo.state === 'failed') {
      throw new Error('Video processing failed');
    }
    await new Promise(resolve => setTimeout(resolve, processingInfo.check_after_secs * 1000));
  } while (processingInfo.state === 'pending' || processingInfo.state === 'in_progress');
}

async function createTwitterThread(issues) {
  const placedIssues = {
    first: null,
    second: null,
    third: null,
    honorableMentions: []
  };

  for (const issue of issues) {
    console.log(chalk.cyan(`\nIssue: ${issue.title}`));
    
    const { placement } = await inquirer.prompt([
      {
        type: 'list',
        name: 'placement',
        message: 'Select placement:',
        choices: [
          { name: '1st Place', value: '1' },
          { name: '2nd Place', value: '2' },
          { name: '3rd Place', value: '3' },
          { name: 'Honorable Mention', value: 'h' },
          { name: 'Skip', value: 'skip' }
        ]
      }
    ]);

    if (placement === 'skip') continue;

    switch (placement) {
      case '1':
        placedIssues.first = issue;
        const { reward: firstReward } = await inquirer.prompt([
          {
            type: 'input',
            name: 'reward',
            message: 'Enter reward amount for 1st place:',
            prefix: '$'
          }
        ]);
        placedIssues.first.reward = firstReward;
        placedIssues.first.opening = `The winner for $${placedIssues.first.reward} is `;
        break;
      case '2':
        placedIssues.second = issue;
        const { reward: secondReward } = await inquirer.prompt([
          {
            type: 'input',
            name: 'reward',
            message: 'Enter reward amount for 2nd place:',
            prefix: '$'
          }
        ]);
        placedIssues.second.reward = secondReward;
        placedIssues.second.opening = `In second place for $${placedIssues.second.reward} is `;
        break;
      case '3':
        placedIssues.third = issue;
        const { reward: thirdReward } = await inquirer.prompt([
          {
            type: 'input',
            name: 'reward',
            message: 'Enter reward amount for 3rd place:',
            prefix: '$'
          }
        ]);
        placedIssues.third.reward = thirdReward;
        placedIssues.third.opening = `In third place for $${placedIssues.third.reward} is `;
        break;
      case 'h':
        placedIssues.honorableMentions.push(issue);
        break;
    }

    const twitterUsername = await getTwitterHandleFromGitHub(issue.user.login);
    if (twitterUsername) {
      issue.author = twitterUsername;
    } else {
      const { useOriginalHandle } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useOriginalHandle',
          message: `Use GitHub handle as twitter handle: @${issue.user.login}?`,
          default: true
        }
      ]);

      if (useOriginalHandle) {
        issue.author = `@${issue.user.login}`;
      } else {
        const { twitterHandle } = await inquirer.prompt([
          {
            type: 'input',
            name: 'twitterHandle',
            message: 'Enter the Twitter handle to use:',
            prefix: '@'
          }
        ]);
        issue.author = twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`;
      }
    }
  }

  const orderedIssues = [
    placedIssues.first,
    placedIssues.second,
    placedIssues.third,
    ...placedIssues.honorableMentions
  ].filter(Boolean);

  const { introText } = await inquirer.prompt([
    {
      type: 'input',
      name: 'introText',
      message: 'Enter introduction text for the first tweet:'
    }
  ]);

  const { quoteUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'quoteUrl',
      message: 'Enter the URL of the tweet to quote (press Enter to skip):'
    }
  ]);

  console.log(chalk.yellow('Posting introduction tweet...'));
  let lastTweetId = null;
  try {
    let introTweetOptions = { text: introText };
    if (quoteUrl && quoteUrl.trim() !== '') {
      introTweetOptions.quote_tweet_id = quoteUrl.split('/').pop();
    }
    const introTweet = await client.v2.tweet(introTweetOptions);
    lastTweetId = introTweet.data.id;
    console.log(chalk.green('Introduction tweet posted successfully!'));
  } catch (error) {
    console.error(chalk.red('Error posting intro tweet:'), error);
    throw error;
  }

  for (const issue of orderedIssues) {
    const videoInfo = await extractVideoFromIssue(issue);
    if (!videoInfo) {
      console.log(chalk.yellow(`No video found for issue: ${issue.title}`));
      continue;
    }
    let mediaId = null;
    if (videoInfo.type === 'github') {
      console.log(chalk.cyan(`Downloading video from: ${videoInfo.url}`));
      const video = await downloadVideo(videoInfo.url);
      console.log(chalk.yellow('Uploading video to Twitter...'));
      const res = await client.v1.uploadMedia(video, { longVideo: true, mimeType: EUploadMimeType.Mp4 }, true);
      await waitForVideoProcessing(res.media_id_string);  
      console.log(chalk.green('Video uploaded successfully'));
      mediaId = res.media_id_string;
    }

    const { note } = await inquirer.prompt([
      {
        type: 'input',
        name: 'note',
        message: `Enter a note for issue "${issue.title}":`
      }
    ]);

    let tweetText = issue.opening ? issue.opening : 'Honorable mention for ';
    tweetText += `${issue.author}! ${note}`;
    
    if (videoInfo.type === 'youtube') {
      tweetText += `\n\nWatch the submission: https://youtu.be/${videoInfo.id}`;
    }
    
    const tweetOptions = {
      text: tweetText,
    };

    if (videoInfo.type === 'github') {
      tweetOptions.media = { media_ids: [mediaId] };
    }

    if (lastTweetId) {
      tweetOptions.reply = { in_reply_to_tweet_id: lastTweetId };
    }

    console.log(chalk.yellow('Posting tweet...'));
    try {
      const tweet = await client.v2.tweet(tweetOptions);
      lastTweetId = tweet.data.id;
      console.log(chalk.green(`Tweet posted: ${tweet.data.id}`));
    } catch (error) {
      console.error(chalk.red('Error posting tweet, retrying without media'));
      
      tweetText += `\n\nWatch the submission: ${videoInfo.url}`;
      const retryTweetOptions = {
        text: tweetText,
      };

      if (lastTweetId) {
        retryTweetOptions.reply = { in_reply_to_tweet_id: lastTweetId };
      }

      try {
        const tweet = await client.v2.tweet(retryTweetOptions);
        lastTweetId = tweet.data.id;
        console.log(chalk.green(`Tweet posted: ${tweet.data.id}`));
      } catch (error) {
        console.log(chalk.red('Failed to post tweet, skipping this issue'));
        continue;
      }      
    }
  }
}

async function getLatestRepositories() {
  try {
    const { data } = await octokit.repos.listForOrg({
      org: 'Algorithm-Arena',
      sort: 'created',
      direction: 'desc',
      per_page: 5
    });
    return data.map(repo => ({ name: repo.name, value: repo.html_url }));
  } catch (error) {
    console.error(chalk.red('Error fetching repositories:'), error.message);
    return [];
  }
}

async function selectRepository() {
  const repos = await getLatestRepositories();
  
  if (repos.length === 0) {
    console.log(chalk.yellow('No repositories found or error occurred. Please enter a custom URL.'));
    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the GitHub repository URL:',
        validate: input => input.includes('github.com') ? true : 'Please enter a valid GitHub URL'
      }
    ]);
    return url;
  }

  repos.push({ name: 'Enter custom URL', value: 'custom' });

  const { repo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'repo',
      message: 'Select a repository or enter a custom URL:',
      choices: repos
    }
  ]);

  if (repo === 'custom') {
    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the GitHub repository URL:',
        validate: input => input.includes('github.com') ? true : 'Please enter a valid GitHub URL'
      }
    ]);
    return url;
  }

  return repo;
}

async function main() {
  try {
    console.log(chalk.blue.bold('GitHub Repository Selector and Twitter Thread Creator'));
    
    const url = await selectRepository();
    const { owner, repo } = await getRepoInfo(url);
    console.log(chalk.cyan(`Fetching issues for ${owner}/${repo}...`));
    const issues = await getIssues(owner, repo);
    console.log(chalk.green(`Found ${issues.length} issues.`));

    await createTwitterThread(issues);

    console.log(chalk.green.bold('Twitter thread created successfully!'));
  } catch (error) {
    console.error(chalk.red('An error occurred:'), error.message);
  }
}

async function getTwitterHandleFromGitHub(username) {
  try {
    const { data: user } = await octokit.users.getByUsername({ username });
    if (user.twitter_username) {
      return `@${user.twitter_username}`;
    }
    return null;
  } catch (error) {
    console.error(chalk.red('Error fetching GitHub user info:'), error);
    return null;
  }
}

main();