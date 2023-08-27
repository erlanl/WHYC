import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup'; 
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

  return (
    <main className="custom-font flex flex-col items-center my-14">
      <button className='button-home' onClick={() => {setOpen(o => !o)}}>JOGAR</button>
      <Popup open={open} closeOnDocumentClick={false} modal>
        <PopUpInserirCodigo setOpen={setOpen}/>
      </Popup>
      <button className='button-home'>CRIAR SALA</button>
    </main>
  );
}

function PopUpInserirCodigo({setOpen}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-4 custom-width flex flex-col">
        <div className="flex">
            <h2 className="text-lg font-semibold text-custom-color custom-font-inter">Digite o código da sala</h2>
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setOpen((o) => !o);}}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
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
        </div>
        <input
          type="text"
          placeholder="Código"
          className="custom-font-inter w-full border border-gray-300 rounded-md px-3 py-2 pr-10 mt-6"
        />
        <div class="flex pt-4 justify-end items-start self-stretch">
          <Link to="/game">
            <button id="button-send" className=" text-white button-custom-color custom-font-inter mt-2">
              Entrar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
