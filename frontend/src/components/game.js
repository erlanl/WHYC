import React, {useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';
import './game.css';
import astroImage from '../images/image.png';
import Footer from './footer';
import PopupResultado from './popupResultado';

function GameWindow() {

  axios.defaults.baseURL = 'http://localhost:5001/';
  const [open, setOpen] = useState(false);
  const [win, setWin] = useState(false);
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter == 5) {
      setOpen(true);
      setWin(true);
      pause();
    }
  }, [words]);

  const { seconds, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: new Date().getTime() + 60000,
    onExpire: () => {
      setOpen(true);
      setWin(false);
    },
    autoStart: true,
  });

  const evalWord = async () => {
    try{
      const res = await axios.post("/get_answer", {
        "word": word,
      });
      
      if (res.status === 200) {
        return res.data.correct
      }
    } 

    catch (err) {
      console.error(err);
      alert("Erro ao avaliar a palavra");
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && word.trim() !== '') {

      let value = await evalWord();

      if (value){
        setCounter(counter + 1);
      }
      
      setWords([...words, [word, value]]);
      console.log(words);
      setWord('');

      console.log(counter);
    }
  }

  const formatTime = (time) => {
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${seconds}`;
  };

  return (
    
    <div className="Game">
      
      <header className="Game-header w-full mt-12">
        <div className='columns-2 w-full flex items-center justify-between'>

          <div className='pl-20'>
          <TimeCount text={formatTime(seconds)}/>
          </div>

          <div className='items-center content-center'>
            <h1 className="logo font-bold">WHY.C</h1>
          </div>

          <div className='pr-20'>
            <TimeCount text={`${counter}/3`}/>
          </div>
        </div>

        <div className='pt-8'>
          <ShowImage/>
        </div>
        
      </header>

      <div className="divMain">

        <InputGuess
          handleKeyPress={handleKeyPress}
          onChange={(e) => setWord(e.target.value)}
          value={word}
        />

        <HistoryGuess 
          words={words} 
        />
        
        <Popup open={open} closeOnDocumentClick={false} modal>
          <PopupResultado venceu={win} /> {/* Aqui passamos true para venceu quando o jogador ganha e false quando perde */}
        </Popup>

      </div>

      <Footer/>
    </div>
  );
}

function InputGuess({ handleKeyPress, onChange, value }) {
  return (
    <div className="inputWord pt-10">
      <input
        type="text"
        name="inputGuess"
        id="inputGuess"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        className="block w-full rounded-md py-1.5 pr-20 sm:text-sm sm:leading-6 inputLabel"
        placeholder="Digite uma palavra"
      />
    </div>
  );
}

function ShowImage() {
  let url = sessionStorage.getItem("urlImage")
  console.log(url)
  return(
    <img src={url} alt='astro' className='genImg'/>
  );
}

function HistoryGuess({ words }) {
  return (
    <div className='pt-20'>
      {words.map((word, index) => (
        <div className='pt-2' key={index}>
          <div className={`rectangle ${word[1] ? 'colorRight' : 'colorWrong'}`}>
            <p className={`text-center text-guess ${word[1] ? "text-accept" : "text-wrong"}`}>
              {word[0]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TimeCount({text}){
  return(
    <div className='timer rounded-full'><p className='timerText'>{text}</p></div>
  );
}

export default GameWindow;