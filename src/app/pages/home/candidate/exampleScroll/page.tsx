"use client";

import { FC } from "react";

const sampleData = [
  "Apple",
  "Banana",
  "Orange",
  "Grape",
  "Mango",
  "Pineapple",
  "Strawberry",
  "Blueberry",
  "Peach",
  "Kiwi",
  "Watermelon",
  "Papaya",
  "Lemon",
  "Cherry",
  "Raspberry",
  "Blackberry",
  "Cantaloupe",
  "Plum",
  "Apricot",
  "Pear",
  "Fig",
  "Dragonfruit",
  "Lychee",
  "Passion Fruit",
  "Tangerine",
  "Coconut",
];

const DataPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Scroll Through the Fruit List</h1>

      <div
        className="flex flex-col w-full h-128 max-w-2xl md:h-[calc(100vh-80px)] overflow-y-scroll p-4 shadow-md border border-gray-200 rounded-lg scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 bg-orange-400"
      >
        <ul className="space-y-4">
          {sampleData.map((item, index) => (
            <li key={index} className="text-xl text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataPage;
