import React, {useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';
import './guessingGame.css';
import Footer from '../../common/footer';
import iconLose from '../../../images/iconLose.png'
import iconWin from '../../../images/iconWin.png'
import { Link } from 'react-router-dom';

import serverUrlBase from '../../common/urlServer'

function GameWindow() {

  axios.defaults.baseURL = serverUrlBase + "/";
  const [open, setOpen] = useState(false);
  const [win, setWin] = useState(false);
  const [word, setWord] = useState('');
  const [words, setWords] = useState([]);
  const [counter, setCounter] = useState(0);
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [pontos, setPontos] = useState(0);
  const [opPontos, setOpPontos] = useState(0);
  const id = sessionStorage.getItem("id")
  let codigo = sessionStorage.getItem("codigo")

  useEffect(() => {
    const receiveImage = async () => {
      let url = serverUrlBase + "/get_image"
      const check = await axios.post(url, {
        "id": id,
        "room": codigo
      });

      if (check.status === 200) {
        setImages(check.data.data);
        let url = serverUrlBase + "/change_status"
        const chStatus = await axios.post(url, {
          "id": id,
          "room": codigo
        });
        if (chStatus.status === 200) {
          setLoading(false);
          start();
        };
      };
    };

    receiveImage();
  }, []);

  useEffect(() => {
    if (counter === 3) {
      setOpen(true);
      setWin(true);
      pause();

      const chSt = async () => {
        let url = serverUrlBase + "/define_win"
        await axios.post(url, {
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
    let url = serverUrlBase + "/check_oponent_status"
    const st = await axios.post(url, {
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
      let url = serverUrlBase + "/define_score_win"
      const defineWin = await axios.post(url, {
      "room": codigo,
      "id"  : id
       });

      if (defineWin.data.message){
        setWin(true);
      }
      setPontos(defineWin.data.score);
      setOpPontos(defineWin.data.opScore);
      setOpen(true);
    },
    autoStart: false,
  });

  useEffect(() => {
    if (seconds % 15 === 0 && seconds != 0) {
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
      let url = serverUrlBase + "/get_answer"
      const res = await axios.post(url, {
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
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
          <div role="status" className="grid place-items-center">
            <svg aria-hidden="true" class="inline w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-custom-color" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <p className="font-semibold text-white text-center custom-font-inter my-2">Aguardando próximo jogador...</p>
          </div>
        </div>
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
                <PopupResultado venceu={win} pontos={pontos} opPontos={opPontos}/> {/* Aqui passamos true para venceu quando o jogador ganha e false quando perde */}
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

function PopupResultado (props) {
  return (
      <div className='Tela'>
          <Resultado venceu={props.venceu} pontos={props.pontos} opPontos={props.opPontos}/>
          <NovoJogo />
      </div>
  )
}

function Resultado (props) {
  if (props.venceu) {
      return (
          <section className='Resultado-Mensagem'>
              <img src={iconWin} className='Resultado-Mensagem-Logo' alt='Win icon'/>
              <h1 className='Resultado-Mensagem-Texto'>Você venceu!</h1>
              <Pontuacao pontos={props.pontos} opPontos={props.opPontos} />
          </section>
      )
  } else {
      return (
          <section className="Resultado-Mensagem">
              <img src={iconLose} className='Resultado-Mensagem-Logo' alt='Lose icon'/>
              <h1 className='Resultado-Mensagem-Texto'>Você perdeu!</h1>
              <Pontuacao pontos={props.pontos} opPontos={props.opPontos} />
          </section>
      )
  }
}

function Pontuacao (props) {
  if (props.pontos != 0 || props.opPontos != 0) {
    return (
      <div className='Resultado-pontuacao'>
                <p>Sua pontuação: {props.pontos}</p>
                <p>Pontuação do oponente: {props.opPontos}</p>
      </div>
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

  let codigo = sessionStorage.getItem("codigo")
  const id = sessionStorage.getItem("id")
  let url = serverUrlBase + "/redefine_game"
  const redfunc = async () => {await axios.post(url,  {
    "id": id,
    "room": codigo
  })};

  return (
      <section className="Texto-NovoJogo">
          <p>Deseja jogar novamente?</p>
          <div className='Opcao-NovoJogo'>
              <Link to='/'>
                  <button className='Opcao-NovoJogo-Nao'>Não</button>
              </Link>
              <Link to={`/generate-image/${hashedRoom}`}>
                  <button className='Opcao-NovoJogo-Sim' onClick={redfunc}>Sim</button>
              </Link>
          </div>
      </section>
  )
}