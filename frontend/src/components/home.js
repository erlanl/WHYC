import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './footer';

function HomePage() {
  return (
    <body className="custom-font bg-custom-color flex flex-col min-h-screen">
      <Header />
      <Main />
      <div className='mt-auto'>
        <Footer />
      </div>
     
    </body>
  );
}

export default HomePage;

function Header() {
  return (
    <header className="text-white text-center font-bold mt-12">
      <h1>WHY.C</h1>
    </header>
  );
}

function Main() {
  const [roomToCreate, setRoomToCreate] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");
  const [showJoinBox, setShowJoinBox] = useState(false);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    setShowJoinBox(true);
  };

  const handleCreateClick = () => {
    setShowCreateBox(true);
  };

  const handleCreateRoom = async () => {
    if (!roomToCreate) {
      alert("Digite o ID da sala.");
      return;
    }
    try {
      const res = await axios.post("/create_room", {
        room: roomToCreate,
      });
      if (res.status === 200) {
        navigate(`game/${roomToCreate}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar sala.")
    }
  };

  const handleJoinRoom = async () => {
    if (!roomToJoin) {
      alert("Digite o ID da sala.");
      return;
    }
    try {
      const res = await axios.post("/join_room", {
        room: roomToJoin,
      });
      if (res.status === 200) {
        navigate(`game/${roomToJoin}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar na sala.");
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomToJoin) {
      alert("Digite o ID da sala.");
      return;
    }
    try {
      await axios.post("/leave_room", {
        room: roomToJoin,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao sair da sala.");
    }
  };

  return (
    <main className="custom-font flex flex-col items-center my-14">
      {showJoinBox ? (
        <div>
          <input
            type="text"
            placeholder="ID da Sala"
            value={roomToJoin}
            onChange={(e) => setRoomToJoin(e.target.value)}
          />
          <button className='botao-home' onClick={handleJoinRoom}>ENTRAR</button>
          <button className='botao-home' onClick={handleLeaveRoom}>SAIR</button>
        </div>
      ) : (
        <button className='botao-home' onClick={handlePlayClick}>JOGAR</button>
      )}
      {showCreateBox ? (
        <div>
          <input
            type="text"
            placeholder="ID da Sala"
            value={roomToCreate}
            onChange={(e) => setRoomToCreate(e.target.value)}
          />
          <button className='botao-home' onClick={handleCreateRoom}>CRIAR</button>
        </div>
      ) : (
        <button className='botao-home' onClick={handleCreateClick}>CRIAR SALA</button>
      )}
    </main>
  );
}
