import React from 'react'

export const Item = ({ styleLi, styleUl, contenido, children }) => {
    return (
        <div className='container-item'>
            <ul className={styleUl}>
                <li className={styleLi}>{children} <span className='item-content'>{contenido}</span> </li>
            </ul>
        </div>

    )
}
