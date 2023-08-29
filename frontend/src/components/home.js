import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { SHA256 } from 'crypto-js';
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
  const [open, setOpen] = useState(false);
  const [openGCod, setOpenGCod] = useState(false);
  const [salaCheia, setSalaCheia] = useState(false);
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

/*
  useEffect(() => {
    alert("Entrou no 'useEffect'");
    alert(salaCheia);
    if (salaCheia) {
      const hashedRoom = SHA256(codigo).toString();
      navigate(`/game/${hashedRoom}`);
    }
  }, [salaCheia, codigo, navigate]);
*/

  const criarSala = async () => {
    try {
      const codigoGerado = Math.random().toString(36).substring(2, 10);
      setCodigo(codigoGerado);

      const res = await axios.post("/create_room", {
        room: codigoGerado,
      });

      if (res.status === 200) {
        setSalaCheia(false);
        setOpenGCod(true);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar sala.");
    }
  };

  return (
    <main className="custom-font flex flex-col items-center my-14">
      <button className='button-home' onClick={() => {setOpen(o => !o)}}>JOGAR</button>
      <Popup open={open} closeOnDocumentClick={false} modal>
        <PopUpInserirCodigo setOpen={setOpen} setSalaCheia={setSalaCheia}/>
      </Popup>
      <button className='button-home' onClick={criarSala}>CRIAR SALA</button>
      <Popup open={openGCod} modal>
         <PopUpGerarCodigo setOpen={setOpenGCod} codigo={codigo} />
      </Popup>
    </main>
  );
}

function PopUpInserirCodigo({setOpen, setSalaCheia}) {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const entrarSala = async () => {
    if (!codigo) {
      alert("Digite o código da sala.");
      return;
    }

    try {
      const res = await axios.post("/join_room", {
        room: codigo,
      });

      if (res.status === 200) {
        if (res.data.message === "Joined full room successfully.") {
          setSalaCheia(true);
        }

        const hashedRoom = SHA256(codigo).toString();
        navigate(`/game/${hashedRoom}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar na sala");
    }
  };

  const sairSala = async () => {
    if (!codigo) {
      alert("Digite o código da sala.");
      return;
    }

    try {
      const res = await axios.post("/leave_room", {
        room: codigo,
      });

      if (res.status === 200) {
        alert("Saiu da sala com sucesso.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao sair da sala.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-4 custom-width flex flex-col">
        <div className="flex">
            <h2 className="text-lg font-semibold text-custom-color custom-font-inter">Digite o código da sala</h2>
            <FecharPopUp setOpen={setOpen} />
        </div>
        <input
          type="text"
          placeholder="Código"
          className="custom-font-inter w-full border border-gray-300 rounded-md px-3 py-2 pr-10 mt-6"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <div class="flex pt-4 justify-end items-start self-stretch">
          <button id="button-send" className=" text-white button-custom-color custom-font-inter mt-2" onClick={entrarSala}>
            Entrar
          </button>
          <button id="button-send" className=" text-white button-custom-color custom-font-inter mt-2" onClick={sairSala}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function PopUpGerarCodigo({setOpen, codigo}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-4 custom-width flex flex-col">
          <FecharPopUp setOpen={setOpen}/>
          <div role="status" className="waiting my-4 text-center p-4">
            <svg aria-hidden="true" class="inline w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-custom-color" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Esperando...</span>
          </div>
          <p className="font-semibold text-custom-color text-center custom-font-inter">Aguardando próximo jogador...</p>
          <div className="flex justify-center items-center custom-font-inter m-2">
            <p className="font-semibold text-custom-color mr-2">O código da sua sala é:</p>
            <span className="font-bold gray">{codigo}</span>
          </div>
        </div>
    </div>
  );
}

function FecharPopUp({setOpen}){
  return (
    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setOpen((o) => !o);}}>
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        mlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
      />
      </svg>
      <span className="sr-only">Fechar pop-up</span>
    </button>
  );
}