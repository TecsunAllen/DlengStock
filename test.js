Promise.all([createPromise()]).then(arr => {
    console.log(arr);
}).catch(arr => {
    console.log(arr);
});


function createPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(reject(33), 3000);
    }).catch(e => {

    });
}