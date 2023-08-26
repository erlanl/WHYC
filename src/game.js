import './game.css';
import astroImage from './images/image.png';

function GameWindow() {
  return (
    
    <div className="Game">
      
      <header className="Game-header w-full pt-8">
        <div className='columns-2 w-full flex items-center justify-between'>

          <div className='pl-20'>
            <div className='timer rounded-full'><p className='timerText'>30</p></div>
          </div>

          <div className='items-center content-center'>
            <h1 className="logo">WHY.C</h1>
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
      </div>

      <Footer/>
    </div>
  );
}

function InputGuess() {
  return (
    <div className="inputWord pt-20">
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

function HistoryGuess(){
  return(
    <div className='pt-20'> 
      <div className="rectangle">
        <p className="text-center text-guess">homem</p>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="p-4 mt-20">
      <p class="text-white text-right text-xs leading-normal">Todos os direitos reservados à Los Hermanos ©</p>
    </footer>
  );
}

export default GameWindow;