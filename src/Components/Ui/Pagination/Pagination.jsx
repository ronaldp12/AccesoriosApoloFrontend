import "../Pagination/Pagination.css";

export const Pagination = ({currentPage, setCurrentPage, totalPages}) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2; 
        const range = [];
        const rangeWithDots = [];

        range.push(1);

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Agregar puntos suspensivos donde sea necesario
        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="pagination">
            <button className="prev" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                Ant
            </button>
            {visiblePages.map((item, index) => (
                item === '...' ? (
                    <span key={index} className="dots">...</span>
                ) : (
                    <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={currentPage === item ? "active" : ""}
                    >
                        {item}
                    </button>
                )
            ))}
            <button className="next" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}>
                Sig
            </button>
        </div>
    );
};