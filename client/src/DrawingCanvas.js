import React, { useRef, useState } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [drawMode, setDrawMode] = useState(false);
    const [showThicknessOptions, setShowThicknessOptions] = useState(false);
    const [thickness, setThickness] = useState(1);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [eraserMode, setEraserMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });
    const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
    const [drawnObjects, setDrawnObjects] = useState([]);

    const toggleDrawMode = () => {
        const newDrawMode = !drawMode;
        setDrawMode(newDrawMode);
        setEraserMode(false);
        setDrawRectMode(false);
        setShowThicknessOptions(newDrawMode); // Show thickness options when enabling draw mode
    };

    const toggleDrawRectMode = () => {
        const newDrawRectMode = !drawRectMode;
        setDrawRectMode(newDrawRectMode);
        setEraserMode(false);
        setShowThicknessOptions(false); // Hide thickness options when toggling draw rect mode
        if (newDrawRectMode) {
            setDrawMode(false);
        }
    };

    const toggleEraserMode = () => {
        const newEraserMode = !eraserMode;
        setEraserMode(newEraserMode);
        setShowThicknessOptions(false); // Hide thickness options when toggling eraser mode
        if (newEraserMode) {
            setDrawMode(false);
            setDrawRectMode(false);
        }
    };

    const startDrawing = (e) => {
        if (!drawMode && !drawRectMode && !eraserMode) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = thickness; // Apply the selected thickness
        ctx.strokeStyle = 'black'; // Set your desired stroke color for drawing and rectangles
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (drawRectMode) {
            setIsDrawingRect(true);
            setStartRectCoords({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (eraserMode) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 10;
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
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
        setIsDrawingRect(false);
    };


    const selectThickness = (selectedThickness) => {
        setThickness(selectedThickness);
        setShowThicknessOptions(false); // Optionally hide the selector after selection
    };

    return (
        <div>
            <h1 style={{ color: 'black' }}>Simple Drawing Canvas</h1>
            <div style={{ marginBottom: '20px' }}>
                <div
                    className="pencil"
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
                    ✎
                </div >
                {showThicknessOptions && (
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginRight:'1200px' }}>
                        {/* Custom UI for selecting thickness */}
                        <div onClick={() => selectThickness(1)} style={{ height: '2px', background: 'black', marginBottom: '5px' }}></div>
                        <div onClick={() => selectThickness(5)} style={{ height: '5px', background: 'black', marginBottom: '5px' }}></div>
                        <div onClick={() => selectThickness(10)} style={{ height: '10px', background: 'black', marginBottom: '5px' }}></div>
                    </div>
                )}
                <div
                    className="rectangle"
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
                    className="eraser"
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










