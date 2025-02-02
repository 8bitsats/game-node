// Load environment variables
import dotenv from 'dotenv';

// Create a new instance of GameClient
import GameClient from '../api';
import GameFunction, {
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from '../function';
import GameWorker from '../worker';

type ImageFunctionArgs = [
  {
    name: "image_description";
    description: "The description of the image to generate";
  }
];

type ReplyFunctionArgs = [
  { name: "message"; description: "The message to reply" },
  {
    name: "media_url";
    description: "The media url to attach to the message";
    optional: true;
  }
];

const generateImageFunction = new GameFunction<ImageFunctionArgs>({
  name: "generate_image",
  description: "Generate an image",
  args: [
    {
      name: "image_description",
      description: "The description of the image to generate",
    },
  ] as const,
  executable: async (args, logger: (msg: string) => void) => {
    try {
      // TODO: Implement generate image with url
      logger(`Generating image with description: ${args.image_description}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        "Image generated with URL: https://example.com/image.png"
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to generate image"
      );
    }
  },
});

const replyMessageFunction = new GameFunction<ReplyFunctionArgs>({
  name: "reply_message",
  description: "Reply to a message",
  args: [
    { name: "message", description: "The message to reply" },
    {
      name: "media_url",
      description: "The media url to attach to the message",
      optional: true,
    },
  ] as const,

  executable: async (args, logger: (msg: string) => void) => {
    try {
      // TODO: Implement replying to message with image
      if (args.media_url) {
        logger(`Reply with media: ${args.media_url}`);
      }

      // TODO: Implement replying to message
      logger(`Replying to message: ${args.message}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        `Replied with message: ${args.message}`
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to reply to message"
      );
    }
  },
});

const telegramWorker = new GameWorker({
  id: "telegram",
  name: "telegram",
  description: "Telegram worker",
  functions: [generateImageFunction, replyMessageFunction],
});

dotenv.config();

const VIRTUALS_API_KEY = process.env.VIRTUALS_API_KEY;
if (!VIRTUALS_API_KEY) {
  throw new Error('VIRTUALS_API_KEY is required in environment variables');
}

const gameClient = new GameClient(VIRTUALS_API_KEY);

// Initialize the client
(async () => {
  // Create an agent
  const agentData = await gameClient.createAgent(
    "Telegram Agent",
    "Interact with Telegram",
    "Telegram agent"
  );

  // Create a map with the telegram worker
  const mapData = await gameClient.createMap([telegramWorker]);

  // Set up logger
  const logger = (msg: string) => {
    console.log(`-----[Telegram Agent]-----`);
    console.log(msg);
    console.log("\n");
  };

  // Run a task
  const task =
    "Gotten a message from user. Message content: hey! i will need help with my project, i need an image of a cat hugging AI. Can you help me with that? Give me something that cool and cute!";

  const submissionId = await gameClient.setTask(agentData.id, task);

  // Get and execute task actions
  let gameActionResult = null;
  while (true) {
    const action = await gameClient.getTaskAction(
      agentData.id,
      submissionId,
      telegramWorker,
      gameActionResult,
      {}
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
