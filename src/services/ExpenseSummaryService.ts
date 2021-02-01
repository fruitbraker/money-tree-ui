import axios from 'axios';

export function getExpenseSummary() {
    axios({
        method: 'get',
        url: 'http://localhost:9000/expense/summary',
        responseType: "json"
    })
    .then(function (response) {
        console.log(response)
    });
    // axios.get('http:localhost:9000/expense/summary')
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   })
    //   .then(function () {
    //     // always executed
    //     console.log("I'm always executed!")
    //   });  
}