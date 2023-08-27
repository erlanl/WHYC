import './popupResultado.css'
import React from 'react';
import { Link } from 'react-router-dom';
import iconLose from '../images/iconLose.png'
import iconWin from '../images/iconWin.png'

export default function PopupResultado ({venceu}) {
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
                <img src={iconWin} className='Resultado-Mensagem-Logo'/>
                <h1 className='Resultado-Mensagem-Texto'>Você venceu!</h1>
            </section>
        )
    } else {
        return (
            <section className="Resultado-Mensagem">
                <img src={iconLose} className='Resultado-Mensagem-Logo'/>
                <h1 className='Resultado-Mensagem-Texto'>Você perdeu!</h1>
            </section>
        )
    }
}

function NovoJogo () {
    const recarregar = () => {
        window.location.reload();
    };
    return (
        <section className="Texto-NovoJogo">
            <p>Deseja jogar novamente?</p>
            <div className='Opcao-NovoJogo'>
                <Link to='/'>
                    <button className='Opcao-NovoJogo-Nao'>Não</button>
                </Link>
                <button className='Opcao-NovoJogo-Sim' onClick={recarregar}>Sim</button>
            </div>
        </section>
    )
}