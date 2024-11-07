import React, { useState, useRef, useEffect } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdAutoDelete } from "react-icons/md";
import Popup from "../PopupComponents/popup"; // Import the Popup component

const Discussion = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false); // State for end discussion popup
  const [showCreatePopup, setShowCreatePopup] = useState(false); // State for create discussion popup
  const [newTopicName, setNewTopicName] = useState(""); // State for new topic name input
  const inputRef = useRef(null);
  const userId = "currentUser"; // Replace this with actual user ID or username

  const topics = [
    { id: 1, name: "UI/UX", createdBy: "currentUser" },
    { id: 2, name: "Frontend Development", createdBy: "anotherUser" },
    { id: 3, name: "Backend Development", createdBy: "currentUser" },
    { id: 4, name: "Blockchain", createdBy: "currentUser" },
    { id: 5, name: "Machine Learning", createdBy: "anotherUser" },
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleEndDiscussion = () => {
    setShowDeletePopup(true); // Show popup when "End Discussion" is clicked
  };

  const confirmEndDiscussion = () => {
    setShowDeletePopup(false);
    setSelectedTopic(null); // Close the selected topic if confirmed
  };

  const handleCreateDiscussion = () => {
    setShowCreatePopup(true); // Show popup for creating a new discussion
  };

  const handleCreateNewTopic = () => {
    if (newTopicName.trim()) {
      topics.push({ id: topics.length + 1, name: newTopicName, createdBy: userId });
      setNewTopicName("");
      setShowCreatePopup(false);
    }
  };

  useEffect(() => {
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
            <button
              className="px-4 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition"
              onClick={handleCreateDiscussion}
            >
              Create Discussion
            </button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Topics</h2>
          <ul className="space-y-3">
            {topics
              .filter((topic) => topic.createdBy === userId)
              .map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  className="cursor-pointer p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-gray-800"
                >
                  {topic.name}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button onClick={() => setSelectedTopic(null)} className="text-gray-700 hover:text-gray-900">
                <IoArrowBackCircleSharp className="text-3xl mr-2" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">{selectedTopic.name}</h2>
            </div>

            {selectedTopic.createdBy === userId && (
              <button
                onClick={handleEndDiscussion}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition flex items-center"
              >
                <MdAutoDelete className="mr-2 text-xl" />
                End Discussion
              </button>
            )}
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
              ref={inputRef}
            />
            <button className="ml-2 p-3 rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-700 transition">
              <BsFillSendFill className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* End Discussion Confirmation Popup */}
      <Popup trigger={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <div className="text-gray-700 mb-4">Are you sure you want to end this discussion?</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowDeletePopup(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            No
          </button>
          <button
            onClick={confirmEndDiscussion}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Yes
          </button>
        </div>
      </Popup>

      {/* Create Discussion Popup */}
      <Popup trigger={showCreatePopup} onClose={() => setShowCreatePopup(false)}>
        <div className="text-gray-700 mb-4">
          <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Enter the topic name"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <div className="flex just">
            <button
              onClick={() => setShowCreatePopup(false)}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNewTopic}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition"
            >
              Create
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Discussion;
