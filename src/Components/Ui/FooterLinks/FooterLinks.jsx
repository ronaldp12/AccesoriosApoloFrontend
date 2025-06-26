export const FooterLinks = ({ title, links, style, styleH4, onLinkClick }) => (
    <div className={style}>
        <h4 className={styleH4}>{title}</h4>
        <ul>
            {links.map((link) => (
                <li
                    key={link}
                    onClick={onLinkClick ? () => onLinkClick(link) : undefined}
                    style={{ cursor: onLinkClick ? "pointer" : "default" }}
                >
                    {link}
                </li>
            ))}
        </ul>
    </div>
);
