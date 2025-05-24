import React from 'react';
import '../JoinBanner/JoinBanner.css';
import { context } from '../../../Context/Context.jsx';
import { useContext } from 'react';

export const JoinBanner = () => {

    const { userLogin, nameRol} = useContext(context);

    if (userLogin && nameRol === 'cliente') {
        return null;
    }

    return (
        <section className="join-banner">
            <div className="join-content">
                <div className='join-now'>
                    <h2>ÚNETE </h2>

                    <h2 className="highlight">AHORA</h2>
                </div>
                <button>UNIRME</button>
            </div>
        </section>
    );
};
