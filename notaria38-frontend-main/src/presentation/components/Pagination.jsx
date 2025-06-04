import {useState, useEffect} from 'react';

/**
 * Componente de paginación reutilizable.
 * 
 * @param {number} currentPage - Página actual.
 * @param {number} totalPages - Total de páginas.
 * @param {Function} onPageChange - Función a llamar al cambiar de página.
 * @param {string} className - Clases CSS extra.
 * @returns {JSX.Element|null} Componente de paginación o null si no hay páginas.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) {
  if (totalPages <= 1) return null;

  // Responsivo: 3 páginas en móvil, 5 en tablet, 7 en desktop
  const getMaxPages = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 640) return 3;
    if (windowWidth < 1024) return 5;
    return 7;
  };

  const [maxPages, setMaxPages] = useState(getMaxPages());

  useEffect(() => {
    const handleResize = () => setMaxPages(getMaxPages());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getPages() {
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages = [];
    let startPage = Math.max(2, currentPage - Math.floor((maxPages - 2) / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPages - 3);
    if (endPage - startPage < maxPages - 3) startPage = Math.max(2, endPage - (maxPages - 3));
    pages.push(1);
    if (startPage > 2) pages.push('...');
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) pages.push(pageNum);
    if (endPage < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  const pages = getPages();

  return (
    <div className={`flex justify-center items-center space-x-2 mt-6 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className='px-3 py-1 border border-[#E5E4E2] rounded disabled:opacity-50 hover:bg-gray-200'
      >
        Anterior
      </button>
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 select-none">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border border-[#E5E4E2] rounded ${
              currentPage === page ? 'bg-[#D07024] text-white' : 'hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className='px-3 py-1 border border-[#E5E4E2] rounded disabled:opacity-50 hover:bg-gray-200'
      >
        Siguiente
      </button>
    </div>
  );
}