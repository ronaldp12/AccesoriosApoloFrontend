export const PromoBannerSkeleton = () => {
    return (
        <div className="promo-banner skeleton-loading">
            <div className="promo-banner-discount">
                <div className="skeleton-text skeleton-discount"></div>
            </div>
            <div className="promo-banner-text">
                <div className="promo-banner-text-percent">
                    <div className="skeleton-text skeleton-percent"></div>
                </div>
                <div className="promo-banner-text-products">
                    <div className="skeleton-text skeleton-off"></div>
                    <div className="skeleton-text skeleton-on"></div>
                    <div className="skeleton-text skeleton-on"></div>
                </div>
            </div>
        </div>
    );
};