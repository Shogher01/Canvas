import React, { useRef, useState  } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [drawMode, setDrawMode] = useState(false);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [eraserMode, setEraserMode] = useState(false); // State for eraser mode
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });
    const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
    const [drawnObjects, setDrawnObjects] = useState([]);

    const toggleDrawMode = () => {
        setDrawMode(!drawMode);
        setEraserMode(false); // Disable eraser mode when toggling draw mode
        setDrawRectMode(false); // Ensure rectangle draw mode is off when toggling draw mode
    };


    const toggleDrawRectMode = () => {
        const newDrawRectMode = !drawRectMode;
        setDrawRectMode(newDrawRectMode);
        setEraserMode(false); // Disable eraser mode when toggling rectangle draw mode
        if (newDrawRectMode) {
            setDrawMode(false); // Ensure draw mode is off when toggling rectangle draw mode
        }
    };

    const toggleEraserMode = () => {
        const newEraserMode = !eraserMode;
        setEraserMode(newEraserMode);
        if (newEraserMode) {
            setDrawMode(false); // Disable draw mode
            setDrawRectMode(false); // Disable rectangle draw mode
        }
    };



    const startDrawing = (e) => {
        if (!drawMode && !drawRectMode && !eraserMode) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (drawMode || drawRectMode) {
            ctx.lineWidth = 2; // Set your desired default line width for drawing and rectangles
            ctx.strokeStyle = 'black'; // Set your desired stroke color
        }
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (drawRectMode) {
            setIsDrawingRect(true); // Only set isDrawingRect here
            setStartRectCoords({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        }
    };


    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (eraserMode) {
            // Eraser functionality
            ctx.globalCompositeOperation = 'destination-out'; // Set operation to erase
            ctx.lineWidth = 10; // Eraser size
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over'; // Reset to default drawing operation
        } else if (drawRectMode && isDrawingRect) {
            setCurrentMousePosition({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
            return;
        } else if (drawMode) {
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawingRect) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeRect(startRectCoords.x, startRectCoords.y, currentMousePosition.x - startRectCoords.x, currentMousePosition.y - startRectCoords.y);
            setDrawnObjects([...drawnObjects, {
                type: 'rectangle',
                x1: startRectCoords.x,
                y1: startRectCoords.y,
                x2: currentMousePosition.x,
                y2: currentMousePosition.y,
            }]);
        }
        setIsDrawing(false);
        setIsDrawingRect(false); // Reset isDrawingRect to false here for all modes
    };

    return (
        <div>
            <h1 style={{ color: 'black' }}>Simple Drawing Canvas</h1>
            <div style={{ marginBottom: '20px' }}> {/* Container for tools */}
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
                    <div style={{ color: 'black' }}>◻️</div>
                </div>
                <div
                    className="tool"
                    onClick={toggleEraserMode}
                    style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-block',
                        marginRight: '10px',
                        fontSize: '24px',
                        background: eraserMode ? 'DarkTurquoise' : 'transparent',
                    }}
                >
                    <div style={{ color: 'black' }}>▯</div>
                </div>
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










