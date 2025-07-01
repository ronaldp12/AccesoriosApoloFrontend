import "../Pagination/Pagination.css";

export const Pagination = ({currentPage, setCurrentPage, totalPages}) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <button className="prev" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                Ant
            </button>
            {pages.map((num) => (
                <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={currentPage === num ? "active" : ""}
                >
                    {num}
                </button>
            ))}
            <button className="next" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}>
                Sig
            </button>
        </div>
    );
};

