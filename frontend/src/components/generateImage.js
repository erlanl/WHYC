import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './generateImage.css';

function GenerateImagePage() {
    return (
        <body className="custom-font min-h-screen bg-custom-color flex flex-col">
            <Header />
            <Main />
            <Footer />
        </body>
    );
}
export default GenerateImagePage;

function Header() {
    return (
      <header className="text-white text-center font-bold mt-12">
        <h1>WHY.C</h1>
      </header>
    );
}

function Main() {
    const [keyWordInput, setKeyWordInput] = useState(["", "", "", "", ""]);

    return (
        <main className='flex flex-line items-center justify-center space-x-40'>
            <div className='flex flex-col items-center content-center'>
                <Image />
                <GenerateButton input={keyWordInput} setKeyWord={setKeyWordInput} />
            </div>
            <div className='flex flex-col justify-end'>
                <KeyWord numInput={1} input={keyWordInput} setKeyWord={setKeyWordInput} />
                <KeyWord numInput={2} input={keyWordInput} setKeyWord={setKeyWordInput} />
                <KeyWord numInput={3} input={keyWordInput} setKeyWord={setKeyWordInput} />
                <KeyWord numInput={4} input={keyWordInput} setKeyWord={setKeyWordInput} />
                <KeyWord numInput={5} input={keyWordInput} setKeyWord={setKeyWordInput} />
            </div>
        </main>
    );
}

function Image() {
    let imageURL = "https://media.discordapp.net/attachments/1136100675391078410/1146048266761416776/image.png"

    return (
        <image className='pt-3'>
            <img src={imageURL} alt='dalleImg' className='generateImg'/>
        </image>
    );
}

function KeyWord(props) {
    return (
        <keyword className='flex flex-line pb-3 justify-end items-center'>
            <num className='pr-3 text-2xl'>{props.numInput}.</num>
            <input type="text" name="inputKeyword" id="inputKeyword"
                className="block rounded-md py-2 pr-20 sm:text-sm inputLabel"
                placeholder="Insira a palavra chave aqui"
                value={props.input[props.numInput-1]}
                onChange={(e) => props.setKeyWord(
                    props.input.map((inputKeyWord, index) => {
                        if (index === props.numInput-1) {
                            return e.target.value;
                        }
                        return inputKeyWord;
                    })
                )}
            />
        </keyword>
    );
}

function GenerateButton(props) {   
    const generateImageClick = async () => {
        if (props.input.includes("")) {
            alert("Todos as palavras chaves precisam ser definidas")
        }
        else {
            try{
                const res = await axios.post("http://localhost:5000/generate-image/test-post", {
                    "key_words": props.input
                });

                if (res.status === 200) {
                    alert(JSON.stringify(res.data));
                    props.setKeyWord(["", "", "", "", " "]);
                }
                else {
                    alert("ERROR: " + res.status);
                }
            }
            catch (err) {
                console.error(err);
                alert(err);
            }
        }

        
    }

    return(
        <generate>
            <button className='button-home' onClick={generateImageClick}>GERAR</button>
        </generate>
    );
}

function Footer() {
    return (
      <footer className="p-4 mt-auto">
        <p class="text-white text-right text-xs leading-normal">Todos os direitos reservados a Los Hermanos ©</p>
      </footer>
    );
}