import './popupSala.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SHA256 } from 'crypto-js';

/*
O primeiro parâmetro desta função é um booleano que determina qual o tipo de popup.
true  -> criar um sala
false -> entrar em uma sala
*/
export default function PopupSala({ criarSala, onClose }) {
  const [sala, setSala] = useState("");
  const [visivel, setVisivel] = useState(true);
  const navigate = useNavigate();

  const handleCriarSala = async () => {
    if (!sala) {
      alert("Digite o ID da sala.");
      return;
    }

    try {
      const res = await axios.post("/create_room", {
        room: sala,
      });

      if (res.status === 200) {
        const hashedRoom = SHA256(sala).toString();
        navigate(`game/${hashedRoom}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar sala.");
    }
  };

  const handleEntrarSala = async () => {
    if (!sala) {
      alert("Digite o ID da sala.");
      return;
    }

    try {
      const res = await axios.post("/join_room", {
        room: sala,
      });

      if (res.status === 200) {
        const hashedRoom = SHA256(sala).toString();
        navigate(`game/${hashedRoom}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar na sala.");
    }
  };

  const handleSairSala = async () => {
    if (!sala) {
      alert("Digite o ID da sala.");
      return;
    }

    try {
      const res = await axios.post("/leave_room", {
        room: sala,
      });

      if (res.status === 200) {
        handleFechar();
        alert("Saiu da sala com sucesso.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao sair da sala.");
    }
  }

  const handleFechar = () => {
    setVisivel(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visivel) {
    return null;
  }

  if (criarSala) {
    return (
      <div className='Tela'>
        <header>
          <p class='Sala-Mensagem-Fechar' onClick={handleFechar}>X</p>
        </header>
        <section className='Sala-Mensagem'>
          <h1 className='Sala-Mensagem-Texto'>Criar Nova Sala</h1>
        </section>
        <br/>
        <section>
          <input
            type='text'
            placeholder='ID da Sala'
            class='Input-Texto'
            value={sala}
            onChange={(e) => setSala(e.target.value)}
          />
        </section>
        <br/>
        <section>
          <button className='Opcao-Positiva' onClick={handleCriarSala}>Criar</button>
        </section>
        <br/>
      </div>
    );
  } else {
    return (
      <div className='Tela'>
        <header>
          <p class='Sala-Mensagem-Fechar' onClick={handleFechar}>X</p>
        </header>
        <section className='Sala-Mensagem'>
          <h1 className='Sala-Mensagem-Texto'>Entrar em uma Sala</h1>
        </section>
        <br/>
        <section>
        <input
          type='text'
          placeholder='ID da Sala'
          class='Input-Texto'
          value={sala}
          onChange={(e) => setSala(e.target.value)}
        />
        </section>
        <br/>
        <section>
          <button className='Opcao-Positiva' onClick={handleEntrarSala}>Entrar</button>
          <button className='Opcao-Negativa' onClick={handleSairSala}>Sair</button>
        </section>
        <br/>
      </div>
    );
  }
};