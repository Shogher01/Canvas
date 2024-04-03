import React, { useRef, useState } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [drawMode, setDrawMode] = useState(false);
    const [showThicknessOptions, setShowThicknessOptions] = useState(false);
    const [thickness, setThickness] = useState(1);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [drawCircleMode, setDrawCircleMode] = useState(false);
    const [eraserMode, setEraserMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });
    const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
    const [drawnObjects, setDrawnObjects] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [circleCenter, setCircleCenter] = useState({ x: 0, y: 0 }); // State for circle center
    const [circleRadius, setCircleRadius] = useState(0); // State for circle radius

    const toggleDrawMode = () => {
        const newDrawMode = !drawMode;
        setDrawMode(newDrawMode);
        setEraserMode(false);
        setDrawRectMode(false);
        setDrawCircleMode(false);
        setShowThicknessOptions(newDrawMode);
    };

    const toggleDrawRectMode = () => {
        setDrawRectMode(!drawRectMode);
        setDrawCircleMode(false);
        setDrawMode(false);
        setEraserMode(false); // Ensure eraser mode is turned off
        setShowThicknessOptions(false);
    };

    const toggleDrawCircleMode = () => {
        setDrawCircleMode(!drawCircleMode);
        setDrawRectMode(false);
        setDrawMode(false);
        setEraserMode(false); // Ensure eraser mode is turned off
        setShowThicknessOptions(false);
    };

    const toggleEraserMode = () => {
        const newEraserMode = !eraserMode;
        setEraserMode(newEraserMode);
        setShowThicknessOptions(false);
        if (newEraserMode) {
            setDrawMode(false);
            setDrawRectMode(false);
            setDrawCircleMode(false);
        }
    };

    const startDrawing = (e) => {
        if (!drawMode && !drawRectMode && !drawCircleMode && !eraserMode) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = 'black';
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (drawRectMode || drawCircleMode) {
            setIsDrawingRect(true);
            setStartRectCoords({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        }
        ctx.strokeStyle = selectedColor;
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
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
        } else if (drawCircleMode && isDrawingRect) {
            // Calculate the radius and center of the circle based on the start and current mouse positions
            const radius = Math.sqrt(
                Math.pow(e.clientX - canvas.offsetLeft - startRectCoords.x, 2) +
                Math.pow(e.clientY - canvas.offsetTop - startRectCoords.y, 2)
            );
            const center = { x: startRectCoords.x, y: startRectCoords.y };
            setCircleRadius(radius);
            setCircleCenter(center);
        } else if (drawMode) {
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawingRect) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (drawRectMode) {
                ctx.strokeRect(startRectCoords.x, startRectCoords.y, currentMousePosition.x - startRectCoords.x, currentMousePosition.y - startRectCoords.y);
                setDrawnObjects([...drawnObjects, {
                    type: 'rectangle',
                    x1: startRectCoords.x,
                    y1: startRectCoords.y,
                    x2: currentMousePosition.x,
                    y2: currentMousePosition.y,
                }]);
            } else if (drawCircleMode) {
                // Draw the circle
                ctx.beginPath();
                ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, 2 * Math.PI);
                ctx.stroke();
                setDrawnObjects([...drawnObjects, {
                    type: 'circle',
                    center: { x: circleCenter.x, y: circleCenter.y },
                    radius: circleRadius,
                }]);
            }
        }
        setIsDrawing(false);
        setIsDrawingRect(false);
    };

    const selectThickness = (selectedThickness) => {
        setThickness(selectedThickness);
        setShowThicknessOptions(false);
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
                </div>

                {showThicknessOptions && (
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginRight: '1200px' }}>
                        <div onClick={() => selectThickness(1)} style={{ height: '2px', background: 'black', marginBottom: '5px' }}></div>
                        <div onClick={() => selectThickness(5)} style={{ height: '5px', background: 'black', marginBottom: '5px' }}></div>
                        <div onClick={() => selectThickness(10)} style={{ height: '10px', background: 'black', marginBottom: '5px' }}></div>
                    </div>
                )}
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />

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
                    className="circle"
                    onClick={toggleDrawCircleMode}
                    style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-block',
                        marginRight: '10px',
                        fontSize: '24px',
                        background: drawCircleMode ? 'DarkTurquoise' : 'transparent',
                    }}
                >
                    <div style={{ color: 'black' }}>⚬</div>
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
                    <div style={{ color: 'black' }}>▭</div> {/* Small rectangle icon */}
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
            <div>
                <h2>Drawn Objects:</h2>
                <ul>
                    {drawnObjects.map((object, index) => (
                        <li key={index}>
                            {object.type === 'rectangle' && (
                                <div>Rectangle: {JSON.stringify(object)}</div>
                            )}
                            {object.type === 'circle' && (
                                <div>Circle: Center({object.center.x}, {object.center.y}), Radius: {object.radius}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DrawingCanvas;
