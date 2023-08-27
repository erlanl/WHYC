import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import Footer from './footer';
import PopupSala from './popupSala';

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
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const handlePlayClick = () => {
    setShowJoinPopup(true);
  };

  const handleCreateClick = () => {
    setShowCreatePopup(true);
  };

  const handlePopupClose = () => {
    setShowJoinPopup(false);
    setShowCreatePopup(false);
  };

  return (
    <main className="custom-font flex flex-col items-center my-14">
      <button className='botao-home' onClick={handlePlayClick}>JOGAR</button>
      <Popup open={showJoinPopup} closeOnDocumentClick={false} modal>
        <PopupSala criarSala={false} onClose={handlePopupClose} />
      </Popup>
      <button className='botao-home' onClick={handleCreateClick}>CRIAR SALA</button>
      <Popup open={showCreatePopup} closeOnDocumentClick={false} modal>
        <PopupSala criarSala={true} onClose={handlePopupClose} />
      </Popup>
    </main>
  );
}
