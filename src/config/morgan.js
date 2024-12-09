const morgan = require('morgan');
const logger = require('./logger');
const {env} = require('.')

logger.stream = {
    write: message => logger.info(message.trim())
}

const skip = () => {
    return env !== "development";
};

module.exports = morgan(
    ':remote-addr :remote-user [:date[web]] ":method :url HTTP/:http-version" status: :status ":referrer" ":user-agent" ":res[content-length]bytes @ :response-time ms"',
    {
        stream: logger.stream,
        skip
    }
)