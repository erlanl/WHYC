import './game.css';
import astroImage from './images/image.png';

function GameWindow() {
  return (
    
    <div className="App">
      
      <header className="App-header w-full">
        <div className='columns-2 w-full flex items-center justify-between'>

          <div className='pl-20'>
            <div className='timer rounded-full'><p className='timerText'>30</p></div>
          </div>

          <div className='items-center content-center pr-20'>
            <h1 className="logo">WHY.C</h1>
          </div>

          <div className='sizeDiv pr-20'></div>
        </div>

        <div className='pt-10'>
          <img src={astroImage} alt='astro' className='genImg'/>
        </div>
        
      </header>
      <div className="divMain">
        <InputGuess/>
        <HistoryGuess className="pt-5"/>
      </div>
      
    </div>
  );
}

export default GameWindow;

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

//Aqui temos q passar uma flag (True or false) para saber se a cor será vermelho ou verde
function HistoryGuess(){
  return(
    <div className="rectangle">
      <p className="text-center text-guess">homem</p>
    </div>
  )
}