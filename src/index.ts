import 'dotenv/config';
const { pathfinder, Movements, goals: { GoalNear, GoalFollow } } = require('mineflayer-pathfinder');
const mineflayer = require('mineflayer');

const whitelistedUsers = (process.env.WHITELISTED_USERS || '').split(',');
const bot = mineflayer.createBot({
  host: process.env.MC_SERVER_HOST,
  port: process.env.MC_SERVER_PORT ? Number(process.env.MC_SERVER_PORT) : 25565,
  username: process.env.MC_WINDOWS_USERNAME,
  password: process.env.MC_WINDOWS_PASSWORD,
  auth: 'microsoft',
});
bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  const defaultMove = new Movements(bot);
  defaultMove.canDig = false;
  defaultMove.allowFreeMotion = true;
  bot.pathfinder.setMovements(defaultMove);
});

bot.on('chat', (username, message) => {
  if (whitelistedUsers.length && !whitelistedUsers.includes(username)) return;

  if (message === '.come') {
    const target = bot.players[username]?.entity;
    if (!target) {
      console.log("I don't see you!");
      return;
    }
    const {x: playerX, y: playerY, z: playerZ} = target.position;

    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, 0));
  }

  if (message === '.follow') {
    const target = bot.players[username]?.entity;
    if (!target) {
      console.log("I don't see you!");
      return;
    }

    bot.pathfinder.setGoal(new GoalFollow(target, 2), true);
  }

  if (message === '.stop') {
    bot.pathfinder.stop();
  }
})

console.log('started');
