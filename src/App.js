import React from 'react';
import './index.css';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect('http://localhost:3001');

function App() {

  const [userName, setUserName] = React.useState('');
  const [roomID, setRoomID] = React.useState('');
  const [showChat, setShowChat] = React.useState(false);

  const JoinRoom = () => {
    if (userName !== '' && roomID !== '') {
      socket.emit('join_room', roomID);
      setShowChat(true);
    }
    if (userName === '' || roomID === '') {
      alert('Input your name and room ID');
    }
  };

  return (
    <div className='App'>
      {!showChat ? (
        <div className="join-chat-container">
          <h3>Join A Chat</h3>
          <input 
            type='text' 
            placeholder='Vladimir...' 
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />
          <input 
            type='text' 
            placeholder='Room ID...'
            onChange={(event) => {
              setRoomID(event.target.value);
            }}
          />
          <button onClick={ JoinRoom }>Chat</button>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} roomID={roomID}/>
      )}
    </div>
  );
}

export default App;
