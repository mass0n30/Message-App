import styles from '../styles/components/chatbody.module.css';

export default function ChatBody({props}) {



  return (
    <div>
      <h2>Chat</h2>
      <div className="messages">
        {/* Render chat messages here */}
      </div>
      <div className="input-area">
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
}
