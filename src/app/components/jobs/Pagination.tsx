import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName="pagination flex justify-center mt-8"
      pageClassName="mx-2"
      activeClassName="bg-orange-400 text-gray-800 font-bold rounded-full px-3 py-1"
      previousClassName="mx-2 bg-gray-800 text-white rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-400 hover:text-gray-800"
      nextClassName="mx-2 bg-gray-800 text-white rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-400 hover:text-gray-800"
      disabledClassName="text-gray-400 cursor-not-allowed"
      forcePage={currentPage}
      pageLinkClassName="text-gray-800 rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-100 hover:text-orange-400 font-poppins" // Added custom font class
    />
  );
};

export default Pagination;
