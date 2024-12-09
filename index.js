const {port,env} = require('./src/config');
const logger = require('./src/config/logger');
const app = require('./src/config/express');

const {db:{sequelize}} = require('./src/api/models')

//initialize database connection
app.listen(port, ()=> logger.info(`server started on port ${port} (${env})`));

sequelize.authenticate().then(() => {
    logger.info('Connected to Test DB')
})

module.exports = app;