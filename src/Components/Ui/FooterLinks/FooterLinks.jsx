export const FooterLinks = ({ title, links, style, styleH4 }) => (
    <div className={style}>
        <h4 className={styleH4} >{title}</h4>
        <ul>
            {links.map(link => (
                <li key={link}>{link}</li>
            ))}
        </ul>
    </div>
);
