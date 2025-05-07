export const PromoBanner = ({ discount, text, subtext }) => {
    return (
        <div className="promo-banner">

            <div className="promo-banner-discount">
                <h1>{discount}</h1>
            </div>

            <div className="promo-banner-text">
                <div className="promo-banner-text-percent">
                    <h2 className="percent">%</h2>
                </div>
                <div className="promo-banner-text-products">
                    <span className="off">OFF</span>
                    <span className="on">ON ALL</span>
                    <span className="on">PRODUCTS</span>
                </div>

            </div>
        </div>
    );
};

