export const FooterLinks = ({ title, links, style }) => (
    <div className={style}>
        <h4 >{title}</h4>
        <ul>
            {links.map(link => (
                <li key={link}>{link}</li>
            ))}
        </ul>
    </div>
);
