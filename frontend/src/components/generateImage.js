import React from 'react';
import './generateImage.css';

import astroImage from '../images/image.png';

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
    return (
        <main className='flex flex-line items-center justify-center space-x-40'>
            <div className='flex flex-col items-center content-center'>
                <Image />
                <GenerateButton />
            </div>
            <div className='flex flex-col justify-end'>
                <KeyWord numInput={1} />
                <KeyWord numInput={2} />
                <KeyWord numInput={3} />
                <KeyWord numInput={4} />
                <KeyWord numInput={5} />
            </div>
        </main>
    );
}

function Image() {
    return (
        <image className='pt-3'>
            <img src={astroImage} alt='astro' className='generateImg'/>
        </image>
    );
}

function KeyWord(props) {
    return (
        <keyword className='flex flex-line pb-3 justify-end items-center'>
            <num className='pr-3 text-2xl'>{props.numInput}.</num>
            <input type="text" name="inputKeyword" id="inputKeyword"
                className="block rounded-md py-2 pr-20 sm:text-sm inputLabel"
                placeholder="Input da palavra chave"
            />
        </keyword>
    );
}

function GenerateButton() {
    return(
        <generate>
            <button className='button-home'>GERAR</button>
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