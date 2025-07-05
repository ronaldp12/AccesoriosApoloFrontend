export const ProductCardSkeleton = () => {
    return (
        <div className="product-card skeleton-loading">
            <div className="image-container">
                <div className="skeleton-image"></div>
            </div>
            <div className="skeleton-text skeleton-brand"></div>
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-title-short"></div>
            <div className="skeleton-rating"></div>
            <div className="price-container-product-card">
                <div className="skeleton-text skeleton-price"></div>
                <div className="skeleton-icon"></div>
            </div>
        </div>
    );
};