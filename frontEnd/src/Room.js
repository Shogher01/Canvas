import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import { FaEraser, FaPencilAlt, FaVectorSquare } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

  useEffect(() => {
    socket.on("message", (data) => {
    });
  }, []);
  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };
  return (
    <div className="container-fluid" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <h1 className="display-5 text-center pt-4 pb-3">
          Host
      </h1>
      <div className="row justify-content-center align-items-center text-center py-4">
        <div className="col-md-3">
          <div className="color-picker d-flex align-items-center justify-content-center">
            <span>Color Picker:</span>&nbsp;
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={elements.length === 0}
                onClick={undo}
              >
                <IoIosArrowBack />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg ml-3"
                disabled={history.length < 1}
                onClick={redo}
              >
                <IoIosArrowForward />
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={clearCanvas}
              >
                <FaEraser />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center align-items-center text-center py-4">
        <div className="col-md-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="pencil"
              value="pencil"
              checked={tool === "pencil"}
              onChange={(e) => setTool(e.target.value)}
            />
            <label className="form-check-label" htmlFor="pencil">
              <FaPencilAlt /> Pencil
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="line"
              value="line"
              checked={tool === "line"}
              onChange={(e) => setTool(e.target.value)}
            />
            <label className="form-check-label" htmlFor="line">
              <IoIosArrowForward /> Line
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="rect"
              value="rect"
              checked={tool === "rect"}
              onChange={(e) => setTool(e.target.value)}
            />
            <label className="form-check-label" htmlFor="rect">
              <FaVectorSquare /> Rectangle
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <Canvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Room;
