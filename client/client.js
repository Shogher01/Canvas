const axios = require('axios');


async function fetchData() {
    try {
        const response = await axios.get('/api/data');
        console.log('Data received:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onmessage = function(event) {
    console.log('Received message from server:', event.data);
};

module.exports = {
    fetchData,
    socket
};
