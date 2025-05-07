import React from 'react';
import '../JoinBanner/JoinBanner.css';

export const JoinBanner = () => {
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
