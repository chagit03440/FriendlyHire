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
      activeClassName="text-orange-500 font-bold"
      previousClassName="mx-2"
      nextClassName="mx-2"
      disabledClassName="text-gray-400"
      forcePage={currentPage}
    />
  );
};

export default Pagination;
