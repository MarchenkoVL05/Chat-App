import React from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, userName, roomID}) {

    const [currentMessage, setCurrentMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                author: userName,
                roomID: roomID,
                message: currentMessage,
                time: new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            }

            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
      };

      React.useEffect(() => {
        socket.on('receive_message', (data) => {
          setMessageList((list) => [...list, data]);
        });
      }, [socket]);

    return (
        <div className='chat'>
            <div className='chat__header'>
                <p>LIVE</p>
            </div>
            <div className='chat__body'>
                <ScrollToBottom>
                    {messageList.map((messageContent) => {
                        return (
                            <div>
                                <div 
                                    className='message'
                                    id={userName === messageContent.author ? "you" : "other"}
                                >
                                    <div className="message__content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message__meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat__footer'>
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Message..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )

}

export default Chat;