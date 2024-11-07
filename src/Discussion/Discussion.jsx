import React, { useState, useRef, useEffect } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Discussion = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const inputRef = useRef(null); // Create a reference for the input element

  const topics = ["UI/UX", "Frontend Development", "Backend Development", "Blockchain", "Machine Learning"];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  useEffect(() => {
    // Focus on the input when the page loads or topic is selected
    if (selectedTopic && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTopic]);

  return (
    <div className="flex flex-col basis-full min-h-screen bg-gray-50">
      <div className="text-4xl p-5 font-medium text-gray-800">Discussion</div>

      {!selectedTopic ? (
        <div className="p-5">
            <div className="flex gap-6 mb-4">
    <input
      type="text"
      placeholder="Search for Topics..."
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition"
    />
    <button className="px-4 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition">
      Create Discussion
    </button>
  </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Topics</h2>
          <ul className="space-y-3">
            {topics.map((topic) => (
              <li
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className="cursor-pointer p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-gray-800"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <button onClick={() => setSelectedTopic(null)} className="text-gray-700 hover:text-gray-900">
              <IoArrowBackCircleSharp className="text-3xl mr-2" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{selectedTopic}</h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner flex-grow overflow-y-auto flex flex-col space-y-4 mb-4">
            <div className="self-start bg-gray-200 p-3 rounded-md shadow-md max-w-xs text-gray-800">
              <strong>User1:</strong> What’s the best way to approach UI/UX design?
            </div>
            <div className="self-end bg-gray-800 text-white p-3 rounded-md shadow-md max-w-xs">
              <strong>User2:</strong> I’d recommend starting with user research and wireframing!
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition"
              ref={inputRef} // Attach the ref to the input element
            />
            <button className="ml-2 p-3 rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-700 transition">
              <BsFillSendFill className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussion;
