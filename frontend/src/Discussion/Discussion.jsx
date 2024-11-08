import React, { useState, useRef, useEffect } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdAutoDelete, MdReportProblem } from "react-icons/md";
import axios from "axios";
import Popup from "../PopupComponents/popup";

const Discussion = () => {
  const [topics, setTopics] = useState([]); // Topics state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const userId = "currentUser"; // Replace with actual user ID

  // Fetch topics created by the current user on component mount
  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/topics/${userId}`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchUserTopics();
  }, [userId]);

  // Handle topic selection
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  // Handle ending a discussion (delete a topic)
  const handleEndDiscussion = () => {
    setShowDeletePopup(true);
  };

  const confirmEndDiscussion = async () => {
    try {
      await axios.delete(`http://localhost:9000/api/topics/${selectedTopic._id}`);
      setTopics(topics.filter((topic) => topic._id !== selectedTopic._id));
      setSelectedTopic(null);
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error ending discussion:", error);
    }
  };

  // Handle creating a new discussion topic
  const handleCreateNewTopic = async () => {
    if (newTopicName.trim()) {
      try {
        const response = await axios.post("http://localhost:9000/api/topics", {
          name: newTopicName,
          createdBy: userId,
        });
        setTopics([...topics, response.data]);
        setNewTopicName("");
        setShowCreatePopup(false);
      } catch (error) {
        console.error("Error creating new topic:", error);
      }
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:9000/api/topics/${selectedTopic._id}/messages`,
          { sender: userId, text: message }
        );
        setSelectedTopic(response.data); // Update selected topic with new message
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

      {/* Topic List or Chat View */}
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
              onClick={() => setShowCreatePopup(true)}
            >
              Create Discussion
            </button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Topics</h2>
          <ul className="space-y-3">
            {topics.map((topic) => (
              <li
                key={topic._id}
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
              <div className="flex gap-6 items-center">
                <button className="text-3xl text-red-950" onClick={() => setShowReportPopup(true)}>
                  <MdReportProblem />
                </button>
                <button
                  onClick={handleEndDiscussion}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition flex items-center"
                >
                  <MdAutoDelete className="mr-2 text-xl" />
                  End Discussion
                </button>
              </div>
            )}
          </div>

          {/* Message List */}
          <div className="bg-white p-4 rounded-lg shadow-inner flex-grow overflow-y-auto flex flex-col space-y-4 mb-4">
            {selectedTopic.messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md shadow-md max-w-xs ${msg.sender === userId ? "self-end bg-gray-800 text-white" : "self-start bg-gray-200 text-gray-800"}`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button
              className="ml-2 p-3 rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-700 transition"
              onClick={handleSendMessage}
            >
              <BsFillSendFill className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Popups */}
      <Popup trigger={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <div className="text-gray-700 mb-4">Are you sure you want to end this discussion?</div>
        <div className="flex justify-end gap-4">
          <button onClick={() => setShowDeletePopup(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">No</button>
          <button onClick={confirmEndDiscussion} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Yes</button>
        </div>
      </Popup>

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
          <div className="flex justify-between">
            <button onClick={() => setShowCreatePopup(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">Cancel</button>
            <button onClick={handleCreateNewTopic} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition">Create</button>
          </div>
        </div>
      </Popup>

      <Popup trigger={showReportPopup} onClose={() => setShowReportPopup(false)}>
        <div className="p-4 text-center">
          <h1 className="text-lg font-semibold mb-4">Report Chat Activity</h1>
          <p className="text-sm text-gray-700 mb-6">By clicking "Report," you are flagging any illegal or inappropriate activities within this discussion.</p>
          <button onClick={() => setShowReportPopup(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition">Report</button>
        </div>
      </Popup>
    </div>
  );
};

export default Discussion;
