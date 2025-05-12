import React from 'react'

export const Item = ({ styleLi, styleUl, contenido, children, onClick }) => {
    return (
        <div className='container-item'>
            <ul className={styleUl}>
                <li className={styleLi} onClick={onClick}>
                    {children} 
                    <span className='item-content'>
                        {contenido}
                    </span> 
                </li>
            </ul>
        </div>

    )
}
