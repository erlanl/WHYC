import React, {useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';
import './guessingGame.css';
import Footer from '../../common/footer';
import iconLose from '../../../images/iconLose.png'
import iconWin from '../../../images/iconWin.png'
import { Link } from 'react-router-dom';

function GameWindow() {

  axios.defaults.baseURL = 'http://localhost:5001/';
  const [open, setOpen] = useState(false);
  const [win, setWin] = useState(false);
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]);
  const [counter, setCounter] = useState(0);
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const id = sessionStorage.getItem("id")
  let codigo = sessionStorage.getItem("codigo")

  useEffect(() => {
    const receiveImage = async () => {
      const check = await axios.post("http://localhost:5001/get_image", {
        "id": id,
        "room": codigo
      });

      if (check.status == 200) {
        setImages(check.data.data);
        const chStatus = await axios.post("http://localhost:5001/change_status", {
          "id": id,
          "room": codigo
        });
        if (chStatus.status == 200) {
          setLoading(false);
          start();
        };
      };
    };

    receiveImage();
  }, []);

  useEffect(() => {
    if (counter == 3) {
      setOpen(true);
      setWin(true);
      pause();

      const chSt = async () => {
        await axios.post("http://localhost:5001/define_win", {
            "id": id,
            "room": codigo
          });
      };

      chSt();
    }
  }, [words]);

  const defineWiner = async () => {
    console.log("Passei na definição")
  };

  const checkSt = async () => {
    const st = await axios.post("http://localhost:5001/check_oponent_status", {
        "id": id,
        "room": codigo
      });
      console.log(st.data.message)
      if (st.data.message) {
        setOpen(true);
        pause();
      }
  };


  const { seconds, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: new Date().getTime() + 60000,
    onExpire: async () => {
      console.log("Tempo terminou")
      const defineWin = await axios.post("http://localhost:5001/define_score_win", {
      "room": codigo,
      "id"  : id
       });

      if (defineWin.data.message){
        setWin(true);
      }
      setOpen(true);
    },
    autoStart: false,
  });

  useEffect(() => {
    if (seconds % 15 == 0 && seconds != 0) {
      setCount(count - 1);
    }

    checkSt();
  }, [seconds]);

  const formatTime = (time) => {
    const seconds = (time % 61).toString().padStart(2, '0');
    return `${seconds}`;
  };


  const evalWord = async () => {
    let codigo = sessionStorage.getItem("codigo")
    const id = sessionStorage.getItem("id") 
    console.log("id", id)
    try{
      let time = formatTime(seconds);
      const res = await axios.post("/get_answer", {
        "word": word,
        "id": id,
        "room": codigo,
        "time": time
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

  const isWordInList = (inputValue) => {
    return (words) => {
      const count = words.filter((word) => word[0] === inputValue).length;
      return count === 0;
    };
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && word.trim() !== '') {
      let value = await evalWord();
      const isUnique = isWordInList(word)(words);
  
      if (isUnique) {
          if (value) {
            setCounter(counter + 1);
          }
          setWords([...words, [word, value]]);
          console.log(words);
          setWord('');
          console.log(counter);
      } 
      else {
        alert('A palavra já existe na lista!');
      }
    }
  }  

  return (
    
    <div className="Game">
      {loading ? (
        <div className='pl-30 text-white'>Carregando...</div>
      ) : (
            <div>
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
                <ShowImage image={images[count]}/>
              </div>
              
            </header>

            <div className="divMain">

              <InputGuess
                handleKeyPress={handleKeyPress}
                onChange={(e) => setWord(e.target.value.toLowerCase())}
                value={word}
              />

              <HistoryGuess 
                words={words} 
              />
              
              <Popup open={open} closeOnDocumentClick={false} modal>
                <PopupResultado venceu={win} /> {/* Aqui passamos true para venceu quando o jogador ganha e false quando perde */}
              </Popup>

            </div>
            <div className='mt-auto'> <Footer/> </div>
          </div>
      )};
    </div>
  );
}

export default GameWindow;

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

function ShowImage(props) {
  return(
    <img src={`data:image/png;base64,${props.image}`} alt='astro' className='genImg'/>
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

function PopupResultado ({venceu}) {
  return (
      <div className='Tela'>
          <Resultado venceu={venceu} />
          <NovoJogo />
      </div>
  )
}

function Resultado ({venceu}) {
  if (venceu) {
      return (
          <section className='Resultado-Mensagem'>
              <img src={iconWin} className='Resultado-Mensagem-Logo' alt='Win icon'/>
              <h1 className='Resultado-Mensagem-Texto'>Você venceu!</h1>
          </section>
      )
  } else {
      return (
          <section className="Resultado-Mensagem">
              <img src={iconLose} className='Resultado-Mensagem-Logo' alt='Lose icon'/>
              <h1 className='Resultado-Mensagem-Texto'>Você perdeu!</h1>
          </section>
      )
  }
}

function NovoJogo () {
  // Obtém o caminho da URL
  const path = window.location.pathname;

  // Divide o caminho da URL em partes usando '/'
  const pathParts = path.split('/');

  // Encontra o índice da parte que segue "/generate-image/"
  const indexOfGenerateImage = pathParts.indexOf('game');
  const hashedRoom = pathParts[indexOfGenerateImage + 1];
  return (
      <section className="Texto-NovoJogo">
          <p>Deseja jogar novamente?</p>
          <div className='Opcao-NovoJogo'>
              <Link to='/'>
                  <button className='Opcao-NovoJogo-Nao'>Não</button>
              </Link>
              <Link to={`/generate-image/${hashedRoom}`}>
                  <button className='Opcao-NovoJogo-Sim'>Sim</button>
              </Link>
          </div>
      </section>
  )
}