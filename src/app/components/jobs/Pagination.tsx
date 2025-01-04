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
      previousLabel="Previous "
      nextLabel="Next"
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName="pagination flex flex-wrap justify-center items-center mt-8 gap-2"
      pageClassName="flex items-center justify-center"
      activeClassName="bg-orange-400 text-gray-800 font-bold rounded-full px-3 py-1"
      previousClassName="flex items-center justify-center bg-gray-800 text-white rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-400 hover:text-gray-800"
      nextClassName="flex items-center justify-center bg-gray-800 text-white rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-400 hover:text-gray-800"
      disabledClassName="text-gray-400 cursor-not-allowed"
      forcePage={currentPage}
      pageLinkClassName="text-gray-800 rounded-full px-3 py-1 transition-colors duration-200 hover:bg-orange-100 hover:text-orange-400 font-poppins text-sm md:text-base"
    />
  );
};

export default Pagination;
