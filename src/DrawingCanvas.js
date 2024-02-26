import React, { useRef, useState } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [drawMode, setDrawMode] = useState(false);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });

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
        if (isDrawingRect) {
            setStartRectCoords({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        }
    };

    const draw = (e) => {
        if (!drawMode && !drawRectMode || !isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        if (isDrawingRect) {
            drawRectangle(
                startRectCoords.x,
                startRectCoords.y,
                e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop
            );
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const drawRectangle = (x1, y1, x2, y2) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
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
        </div>
    );
};

export default DrawingCanvas;