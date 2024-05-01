import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };
  const handleJoinSubmit = (e) => {
    e.preventDefault();

    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-white border-0 shadow-lg">
            <div className="card-body py-5 text-center">
              <h2 className="card-title mb-4">Hi there, enjoy your time with canvas</h2>
              <div className="row">
                <div className="col-md-6">
                  <form onSubmit={handleCreateSubmit}>
                    <h3 className="text-secondary mb-3">Join As A Host</h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={roomId}
                          readOnly={true}
                        />
                        <div className="input-group-append">
                          <CopyToClipboard
                            text={roomId}
                          >
                            <button
                              className="btn btn-secondary"
                              type="button"
                            >
                              <FaCopy />
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">
                      Join As A Host
                    </button>
                  </form>
                </div>
                <div className="col-md-6">
                  <form onSubmit={handleJoinSubmit}>
                    <h3 className="text-secondary mb-3">Join As A Guest</h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={joinName}
                        onChange={(e) => setJoinName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Room Id"
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">
                      Join Room
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
