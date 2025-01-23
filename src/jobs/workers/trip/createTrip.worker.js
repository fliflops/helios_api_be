const {Worker} = require('bullmq');
const {redis} = require('../../../config');
const {keys} = require('../../queues');

const workerService = require('../../../api/service/worker.service');

module.exports = async() => {
    const worker = new Worker(keys.trip_create_queue, async(job) => {
        try{
            return null
        }   
        catch(e){
            console.log(e)
            throw e
        }
    },
    {
        //autorun:false,
        connection: {
            host: redis.host,
            port: redis.port
        }
    })

    worker.on('active', async(job) => {
        await workerService.createWorkerLog({
            job_id: job.id,
            job_status: 'ACTIVE',
            fk_user_id: job.data.user_id,
            route: job.data.route
        })
    })

    worker.on('completed', async(job) => {
        await workerService.updateWorkerLog({
            data: {
                job_status: 'DONE'
            },
            filters:{
                job_id: job.id
            }
        })
    })  

    worker.on('failed', async(job, err) => {
        await workerService.updateWorkerLog({
            data: {
                job_status: 'FAILED'
            },
            filters:{
                job_id: job.id
            }
        })
    })

   //worker.run();
}