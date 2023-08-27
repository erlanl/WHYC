import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import './game.css';
import astroImage from '../images/image.png';
import Footer from './footer';
import PopupResultado from './popupResultado';

var words = {
  'homem': true,
  'brasil' : false,
  'astronauta' : true,
  'terra': false
}

function GameWindow() {
  const [open, setOpen] = useState(false);

  const closeModel = () => {
    setOpen(false);
  };

  return (
    
    <div className="Game">
      
      <header className="Game-header w-full mt-12">
        <div className='columns-2 w-full flex items-center justify-between'>

          <div className='pl-20'>
            <div className='timer rounded-full'><p className='timerText'>30</p></div>
          </div>

          <div className='items-center content-center'>
            <h1 className="logo font-bold">WHY.C</h1>
          </div>

          <div className='pr-20'>
            <div className='timer rounded-full'><p className='timerText'>1/5</p></div>
          </div>
        </div>

        <div className='pt-8'>
          <img src={astroImage} alt='astro' className='genImg'/>
        </div>
        
      </header>
      <div className="divMain">
        <InputGuess/>
        <HistoryGuess/>

        {/* Botao temporario para ver o popup dizendo o resultado da partida */}
        <button onClick={() => {setOpen(o => !o)}}>
          Teste
        </button>
        <Popup open={open} closeOnDocumentClick={false} modal>
          {/* Aqui passamos true para venceu quando o jogador ganha e false quando perde */}
          <PopupResultado venceu={true} />
        </Popup>
      </div>

      <Footer/>
    </div>
  );
}

function InputGuess() {
  return (
    <div className="inputWord pt-10">
        <input
          type="text"
          name="inputGuess"
          id="inputGuess"
          className="block w-full rounded-md py-1.5 pr-20 sm:text-sm sm:leading-6 inputLabel"
          placeholder="Digite uma palavra"
        />
    </div>
  )
}

function HistoryGuess() {
  return (
    <div className='pt-20'>
      {Object.entries(words).map(([word, isTrue]) => (
        <div className='pt-2'>
        <div key={word} className={`rectangle ${isTrue ? 'colorRight' : 'colorWrong'} `}>
          <p className={`text-center text-guess ${isTrue ? "text-accept" : "text-wrong"}`}>{word}</p>
        </div>
        </div>
      ))}
    </div>
  )
}

export default GameWindow;