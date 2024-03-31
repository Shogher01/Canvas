import React, { useRef, useState } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef();
    const [drawMode, setDrawMode] = useState(false);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });
    const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
    const [drawnObjects, setDrawnObjects] = useState([]);

    const deleteRectangle = (id) => {
        setDrawnObjects((prevObjects) => {
            // Filter out the rectangle with the specified ID from drawnObjects
            const updatedObjects = prevObjects.filter((object) => object.id !== id);
            return updatedObjects;
        });
    };

    const toggleDrawMode = () => {
        setDrawMode(!drawMode);
        setDrawRectMode(false);
        setIsDrawingRect(false);
    };

    const toggleDrawRectMode = () => {
        setDrawRectMode(!drawRectMode);
        setDrawMode(false);
        setIsDrawingRect(true);
    };

    const startDrawing = (e) => {
        if (!drawMode && !drawRectMode) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (drawRectMode) {

            setStartRectCoords({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        }
    };

    const draw = (e) => {
        if (!drawMode && !drawRectMode || !isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (drawRectMode) {
            setCurrentMousePosition({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
            return;
        } else {
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawingRect) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            // Finalize the rectangle drawing
            ctx.strokeRect(startRectCoords.x, startRectCoords.y, currentMousePosition.x - startRectCoords.x, currentMousePosition.y - startRectCoords.y);

            // Add the rectangle to the drawnObjects array
            setDrawnObjects([...drawnObjects, {
                type: 'rectangle',
                x1: startRectCoords.x,
                y1: startRectCoords.y,
                x2: currentMousePosition.x,
                y2: currentMousePosition.y,
            }]);
        }
        setIsDrawing(false);
        setIsDrawingRect(false); // Reset drawing rectangle flag
    };
    return (
        <div>
            <h1 style={{ color: 'black' }}>Simple Drawing Canvas</h1>
            <div
                className="tool"
                onClick={toggleDrawMode}
                style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'inline-block',
                    marginRight: '10px',
                    fontSize: '24px',
                    background: drawMode ? 'DarkTurquoise' : 'transparent',
                }}
            >
                <div style={{ color: 'black' }}>✎</div>
            </div>
            <div
                className="tool"
                onClick={toggleDrawRectMode}
                style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'inline-block',
                    marginRight: '10px',
                    fontSize: '24px',
                    background: drawRectMode ? 'DarkTurquoise' : 'transparent',
                }}
            >
                <div style={{ color: 'black' }}>◻</div>
            </div>
            <canvas
                id="myCanvas"
                ref={canvasRef}
                width="1000"
                height="500"
                style={{ border: '1px solid #000', cursor: 'crosshair' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>
            {/* Display the drawn objects */}
            <div>
                <h2>Drawn Objects:</h2>
                <ul>
                    {drawnObjects.map((object, index) => (
                        <li key={index}>{JSON.stringify(object)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DrawingCanvas;
