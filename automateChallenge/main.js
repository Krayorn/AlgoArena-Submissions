import axios from 'axios';
import { Octokit } from '@octokit/rest';
import readline from 'readline';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    console.error('Error downloading video:', error);
    throw error;
  }
}

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createTwitterThread(issues) {
  const placedIssues = {
    first: null,
    second: null,
    third: null,
    honorableMentions: []
  };

  for (const issue of issues) {
    console.log(`\nIssue: ${issue.title}`);
    
    const placement = await promptUser("Enter placement (1, 2, 3, or h for honorable mention): ");
    const useOriginalHandle = await promptUser(`Use original GitHub handle @${issue.user.login}? (y/n): `);
    if (useOriginalHandle.toLowerCase() === 'y' || useOriginalHandle.toLowerCase() === '') {
      issue.author = `@${issue.user.login}`;
    } else {
      issue.author = await promptUser("Enter the Twitter handle to use (with the @ if needed): ");
    }
    switch (placement) {
      case '1':
        placedIssues.first = issue;
        placedIssues.first.reward = await promptUser("Enter reward amount for 1st place: $");
        placedIssues.first.opening = `The winner for ${placedIssues.first.reward} is `
        break;
      case '2':
        placedIssues.second = issue;
        placedIssues.second.reward = await promptUser("Enter reward amount for 2nd place: $");
        placedIssues.second.opening = `In second place for ${placedIssues.second.reward} is `
        break;
      case '3':
        placedIssues.third = issue;
        placedIssues.third.reward = await promptUser("Enter reward amount for 3rd place: $");
        placedIssues.third.opening = `In third place for ${placedIssues.third.reward} is `
        break;
      case 'h':
        placedIssues.honorableMentions.push(issue);
        break;
      default:
        console.log("Invalid placement. Skipping this issue.");
        continue;
    }
  }

  const orderedIssues = [
    placedIssues.first,
    placedIssues.second,
    placedIssues.third,
    ...placedIssues.honorableMentions
  ].filter(Boolean);

    // Prompt for introduction text
    const introText = await promptUser("Enter introduction text for the first tweet: ");

    // Post introduction tweet
    console.log('Posting introduction tweet...');
    let lastTweetId = null
    try {
        const introTweet = await client.v2.tweet({ text: introText });
        lastTweetId = introTweet.data.id;
    } catch (error) {
    console.error('Error posting intro tweet:', error);
    throw error;
  }
    console.log(`Introduction tweet posted: ${introText}`);

  for (const issue of orderedIssues) {
    const videoInfo = await extractVideoFromIssue(issue);
    if (!videoInfo) {
      console.log(`No video found for issue: ${issue.title}`);
      continue;
    }
    console.log("videoInfo", videoInfo)
    let mediaId = null;
    if (videoInfo.type === 'github') {
      console.log(`Downloading video from: ${videoInfo.url}`);
      const video = await downloadVideo(videoInfo.url);
      console.log('Uploading video to Twitter...');
      mediaId = await client.v1.uploadMedia(video, { mimeType: 'video/mp4' });
        console.log('uploaded', mediaId)
    }

    const note = await promptUser(`Enter a note for issue "${issue.title}": `);

    let tweetText = ''
    if (issue.opening) {
      tweetText += issue.opening;
    } else {
        tweetText += `Honorable mention for `;
    }
    tweetText += `${issue.author}! ${note}`
    
    if (videoInfo.type === 'youtube') {
        tweetText += `\n\nWatch the submission: https://youtu.be/${videoInfo.id}`;
    }
    
    const tweetOptions = {
        text: tweetText,
    };

    if (videoInfo.type === 'github') {
        tweetOptions.media= { media_ids: [mediaId] }
    }

    console.log('lasttweetid', lastTweetId)
    if (lastTweetId) {
      tweetOptions.reply = { in_reply_to_tweet_id: lastTweetId };
    }

    console.log('Posting tweet...', tweetText);
    try {
        const tweet = await client.v2.tweet(tweetOptions);
    } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
    lastTweetId = tweet.data.id;

    console.log(`Tweet posted: ${tweet.data.id}`);
  }
}

async function main() {
  try {
    const githubUrl = await promptUser('Enter the GitHub repository URL: ');

    const { owner, repo } = await getRepoInfo(githubUrl);
    console.log(`Fetching issues for ${owner}/${repo}...`);
    const issues = await getIssues(owner, repo);
    console.log(`Found ${issues.length} issues.`);

    await createTwitterThread(issues);

    console.log('Twitter thread created successfully!');
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    rl.close();
  }
}

main();