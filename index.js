// Batching implementation
// Suppose we have five buttons on a page each is making a different apiCall.
// Now we want to implement batching with same functionality as explained below
// Batch all the buttonclicks for say N seconds. Suppose in these N seconds there were 3 button clicks. Batch these 3 requests and after N seconds
// make these apicalls concurrently and serve the result to respective apicall.
// Note that the initial apicalls implementation should not change much.




const allWithParam = (arr) => {
    let count = 0;
    return new Promise((resolve, reject) => {
        for(let i = 0; i < arr.length; i++) {
            arr[i].p().then((data) => {
                count++;
                arr[i].resolve({
                    data,
                    error: null
                });
                if(count === arr.length) {
                    resolve(true);
                }
            }, (err) => {
                count++;
                arr[i].reject({
                    data: null,
                    error: err
                });
                if(count === arr.length) {
                    resolve(true);
                }
            })
        }
    });
};

class Batch {
    constructor(frequency) {
        this.frequency = frequency;
        this.batchActive = false;
        this.tasks = [];
        this.intervalId = null;
    }

    terminate = async () => {
        clearTimeout(this.intervalId);
        if(this.tasks.length > 0) {
           await allWithParam(this.tasks);
        }
        this.tasks = [];
        this.batchActive = false;
    }

    terminateBatch = () => {
        this.terminate();
        this.startBatch();
    }

    startBatch = () => {
        this.batchActive = true;
        this.intervalId = setTimeout(this.terminateBatch, this.frequency);
    }

    performAsyncOperation = (asyncOp, param) => {
        if(!this.batchActive) {
            return;
        }
        const promise = new Promise((resolve, reject) => {
            this.tasks.push({
                param,
                p: asyncOp,
                resolve,
                reject
            });
        });
        return promise;
    }
}

const batchFreq = 10000;
const MAX_DELAY = 3000;
const batchOne = new Batch(batchFreq || 10000); // batch will wait for 10 seconds.
batchOne.startBatch();



const generateRandomDelay = () => Math.random() * MAX_DELAY;
const randomResp = () => {
    if(Math.random() * 1000 > 500) return true;
    return false; 
}

const makeApiCall = (param, delay = 2000) => {
    const method = () => new Promise((resolve, reject) => {
            setTimeout(() => {
                if(randomResp()) {
                    resolve({
                        data: `promise resolved with param ${param}`,
                        param
                    });
                } else {
                    reject({
                        error: `promise rejected with param ${param}`,
                    })
                }
                
            }, generateRandomDelay() || delay);
        })
    return batchOne.performAsyncOperation(method, param);
}