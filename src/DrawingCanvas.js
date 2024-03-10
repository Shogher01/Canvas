import React, { useRef, useState } from 'react';

const DrawingCanvas = () => {
    const canvasRef = useRef();
    const [drawMode, setDrawMode] = useState(false);
    const [drawRectMode, setDrawRectMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingRect, setIsDrawingRect] = useState(false);
    const [startRectCoords, setStartRectCoords] = useState({ x: 0, y: 0 });
    const [drawnObjects, setDrawnObjects] = useState([]);

    const deleteRectangle = (id) => {
        setDrawnObjects((prevObjects) => {
            // Find the rectangle with the specified ID
            const deletedRectangle = prevObjects.find((object) => object.id === id);

            if (deletedRectangle) {
                // Clear the specific rectangle from the canvas
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(deletedRectangle.x1, deletedRectangle.y1, deletedRectangle.x2 - deletedRectangle.x1, deletedRectangle.y2 - deletedRectangle.y1);
            }

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
             drawRectangle(
                 startRectCoords.x,
                 startRectCoords.y,
                 e.clientX - canvas.offsetLeft,
                 e.clientY - canvas.offsetTop,
                 ctx,
                 canvas
             );
             return;
         }else{
                 ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                 ctx.stroke();
         }

        // Add the drawn line to the array of drawnObjects
       setDrawnObjects([
           ...drawnObjects,
           {
               type: 'line',  // Indicate that it's a freehand line
               x1: startRectCoords.x,
               y1: startRectCoords.y,
               x2: e.clientX - canvas.offsetLeft,
               y2: e.clientY - canvas.offsetTop,
               width: ctx.lineWidth,  // Include the width of the line
               color: ctx.strokeStyle,  // Include the color of the line
           },
       ]);


    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const drawRectangle = (x1, y1, x2, y2, ctx, canvas) => {


        // Delete existing rectangles with the same starting point
//        const rectanglesToDelete = drawnObjects.filter(
//            (object) => object.type === 'rectangle' && object.x1 === x1 && object.y1 === y1
//        );

//        rectanglesToDelete.forEach((rectangle) => {
//            deleteRectangle(rectangle.id);
//        });

        // Draw the new rectangle
        ctx.beginPath();
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        //ctx.stroke();

        // Add the drawn rectangle to the array of drawnObjects
         const filteredObjects = drawnObjects.filter((object) => {
                    if (object.type === 'rectangle' &&
                                ((object.x1 === x1 && object.y1 === y1) ||
                                (object.x2 === x1 && object.y2 === y1) ||
                                (object.x1 === x2 && object.y1 === y2) ||
                                (object.x2 === x2 && object.y2 === y2))){
                                //ctx.clearRect(object.x1, object.y1, object.x2 - object.x1, object.y2 - object.y1);

                        return false; // Exclude rectangles with the same starting point
                    }
                    return true;
                });

                // Add the drawn rectangle to the array of drawnObjects
                setDrawnObjects([
                    ...filteredObjects,
                    {
                        type: 'rectangle',
                        x1,
                        y1,
                        x2,
                        y2,
                    },
                ]);
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