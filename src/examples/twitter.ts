// Load environment variables
import dotenv from 'dotenv';

// Create a new instance of GameClient
import GameClient from '../api';
import GameFunction, {
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from '../function';
import GameWorker from '../worker';

type PostTweetArgs = [
  { name: "tweet"; description: "The tweet content" },
  { name: "tweet_reasoning"; description: "The reasoning behind the tweet" }
];

type SearchTweetsArgs = [
  { name: "query"; description: "The query to search for" },
  { name: "reasoning"; description: "The reasoning behind the search" }
];

type ReplyTweetArgs = [
  { name: "tweet_id"; description: "The tweet id to reply to" },
  { name: "reply"; description: "The reply content" }
];

const postTweetFunction = new GameFunction<PostTweetArgs>({
  name: "post_tweet",
  description: "Post a tweet",
  args: [
    { name: "tweet", description: "The tweet content" },
    { name: "tweet_reasoning", description: "The reasoning behind the tweet" },
  ] as const,
  executable: async (args, logger: (msg: string) => void) => {
    try {
      // TODO: Implement posting tweet
      logger(`Posting tweet: ${args.tweet}`);
      logger(`Reasoning: ${args.tweet_reasoning}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        "Tweet posted"
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to post tweet"
      );
    }
  },
});

const searchTweetsFunction = new GameFunction<SearchTweetsArgs>({
  name: "search_tweets",
  description: "Search tweets and return results",
  args: [
    { name: "query", description: "The query to search for" },
    { name: "reasoning", description: "The reasoning behind the search" },
  ] as const,
  executable: async (args, logger: (msg: string) => void) => {
    try {
      const query = args.query;

      //TODO: Implement searching tweets
      logger(`Searching tweets for query: ${query}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        // Return the search results as a string
        "Tweets searched here are the results: [{tweetId: 1, content: 'Hello World'}, {tweetId: 2, content: 'Goodbye World'}]"
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to search tweets"
      );
    }
  },
});

const replyToTweetFunction = new GameFunction<ReplyTweetArgs>({
  name: "reply_to_tweet",
  description: "Reply to a tweet",
  args: [
    { name: "tweet_id", description: "The tweet id to reply to" },
    { name: "reply", description: "The reply content" },
  ] as const,
  executable: async (args, logger: (msg: string) => void) => {
    try {
      const tweetId = args.tweet_id;
      const reply = args.reply;

      //TODO: Implement replying to tweet
      logger(`Replying to tweet ${tweetId} with ${reply}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        `Replied to tweet ${tweetId} with ${reply}`
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to reply to tweet"
      );
    }
  },
});

// Create a worker with the functions
const twitterWorker = new GameWorker({
  id: "twitter_main_worker",
  name: "Twitter main worker",
  description: "Worker that posts tweets",
  functions: [searchTweetsFunction, replyToTweetFunction, postTweetFunction],
});

dotenv.config();

const VIRTUALS_API_KEY = process.env.VIRTUALS_API_KEY;
if (!VIRTUALS_API_KEY) {
  throw new Error('VIRTUALS_API_KEY is required in environment variables');
}

const gameClient = new GameClient(VIRTUALS_API_KEY);

// Initialize and run
(async () => {
  // Create an agent
  const agentData = await gameClient.createAgent(
    "Twitter Bot",
    "Search and reply to tweets",
    "A bot that searches for tweets and replies to them"
  );

  // Create a map with the twitter worker
  const mapData = await gameClient.createMap([twitterWorker]);

  // Set up logger
  const logger = (msg: string) => {
    console.log(`-----[Twitter Bot]-----`);
    console.log(msg);
    console.log("\n");
  };

  // Run a task
  const task = "Search for tweets about AI and reply to them with insightful comments";
  const submissionId = await gameClient.setTask(agentData.id, task);

  // Get and execute task actions
  let gameActionResult = null;
  while (true) {
    const action = await gameClient.getTaskAction(
      agentData.id,
      submissionId,
      twitterWorker,
      gameActionResult,
      {
        username: "twitter_bot",
        follower_count: 1000,
        tweet_count: 10,
        tweet_limit: 15,
      }
    );

    if (action.action_type === "wait") {
      break;
    }

    // Execute the action and get the result
    logger(`Executing action: ${action.action_type}`);
    gameActionResult = {
      action_id: action.action_args.fn_id,
      action_status: ExecutableGameFunctionStatus.Done,
      feedback_message: "Action completed successfully",
    };
  }
})().catch(console.error);
