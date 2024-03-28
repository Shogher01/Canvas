// import React, { useEffect } from 'react';
// import io from 'socket.io-client';
// import DrawingCanvas from './DrawingCanvas.js';
//
//
// const socket = io('http://localhost:3000'); // Replace with your server URL
//
// function App() {
//     useEffect(() => {
//         // Socket event listeners
//         socket.on('connect', () => {
//             console.log('Connected to server');
//         });
//
//         socket.on('draw', (data) => {
//             console.log('Received drawing data:', data);
//             // Handle drawing data (update canvas, etc.)
//         });
//
//         socket.on('disconnect', () => {
//             console.log('Disconnected from server');
//         });
//
//         return () => {
//             // Clean up event listeners on unmount
//             socket.off('connect');
//             socket.off('draw');
//             socket.off('disconnect');
//         };
//     }, []); // Empty dependency array ensures this effect runs only once
//
//     return (
//         <div className="App">
//             <DrawingCanvas socket={socket} />
//         </div>
//     );
// }
//
// export default App;
//
// Import required modules
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas.js';

function App() {
    // Create socket instance
    const socket = io('http://localhost:3000');
    useEffect(() => {
        console.log('useEffect hook is running');

        console.log('Socket instance:', socket);

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('draw', (data) => {
            console.log('Received drawing data:', data);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            console.log('Cleaning up event listeners');
            socket.off('connect');
            socket.off('draw');
            socket.off('disconnect');
        };
    }, [socket]);

    return (
        <div className="App">
            <DrawingCanvas socket={socket} />
        </div>
    );
}

export default App;
