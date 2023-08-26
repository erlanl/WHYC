import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function HomePage() {
  return (
    <body className="custom-font min-h-screen bg-custom-color flex flex-col">
      <Header />
      <Main />
      <Footer />
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
  return (
    <main className="custom-font flex flex-col items-center my-14">
      <Link to="/game">
        <button>JOGAR</button>
      </Link>
      <Link to="/room">
        <button>CRIAR SALA</button>
      </Link>
    </main>
  );
}

function Footer() {
  return (
    <footer className="p-4 mt-auto">
      <p class="text-white text-right text-xs leading-normal">Todos os direitos reservados a Los Hermanos ©</p>
    </footer>
  );
}
