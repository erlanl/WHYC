import React from 'react';
import { Link } from 'react-router-dom';
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
