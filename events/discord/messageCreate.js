const handleCommand = xrequire('./handlers/commandHandler');

module.exports = async message => {
    try {
    
        /**
         * If the message author is a bot, ignore it.
         */
        if (message.author.bot) return;
    
        if (message.guild) {
          /**
           * Handles Bot commands
           */
          handleCommand(message);
        }
      }
      catch (e) {
        message.client.log.error(e);
      }
}