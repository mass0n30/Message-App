import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/message.module.css';
import { CircleUserRound } from 'lucide-react';
import Cluster from '../primitives/Cluster';
import { useState } from 'react';

export default function Message({ user, msg, guestMode, setAlertGuest, setToggleMessages, showDayHeader
 }) {

    const navigate = useNavigate();

    const formattedTime = new Date(msg.timestamp).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const formattedDate = new Date(msg.timestamp).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    });


    const handleGetProfile = async (userId) => {
      if (userId === user?.id) {
        if (setToggleMessages) setToggleMessages(false);
        navigate("/home/profile");
        return;
      }

      if (guestMode) {
        setAlertGuest(true);
        return;
      } else {
        if (setToggleMessages) setToggleMessages(false);
        navigate(`/home/profile/${userId}`);
      }
    }

    return (
      <div className={styles.message}>
        {showDayHeader && (
          <div className={styles.dateSeparator}>
            <span>{formattedDate}</span>
          </div>
        )}
        <div className={user ? (msg.senderId=== user.id || msg.sender?.id === user.id ? styles.ownMessageContainer : styles.messageContainer) :  styles.messageContainer}>
          <div className={user ? (msg.senderId === user.id || msg.sender?.id === user.id ? styles.messageHeaderLeft : styles.messageHeader) : styles.messageHeader}>
            <Cluster>
              <div className={styles.avatarContainer}>
                <button
                  className={styles.avatarButton}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                  }}
                onClick={() => msg?.senderId !== user?.id || msg?.sender?.id !== user?.id ? handleGetProfile(msg.sender.id) : null}
                >
                {msg?.sender?.profile?.avatarUrl ? (

                  <img
                    src={msg.sender.profile.avatarUrl}
                    alt={msg.sender.alias}
                    className={styles.avatar}
                  />
                ) : (
                  <CircleUserRound className={styles.avatar} />
                )}
                  </button>
                </div>
                  <div className={styles.messageContent}>
                    <strong>
                      {msg?.senderId === user?.id || msg?.sender?.id === user?.id ? "You" : msg.sender.alias}:
                    </strong>
                   <div>{msg.content}</div>
                  </div>
                </Cluster>
          </div>
        <div className={msg?.senderId === user?.id || msg?.sender?.id === user?.id ? styles.messageTimeStampLeft : styles.messageTimeStamp}>
          <div className={styles.timeTxt}>{formattedTime}</div>
        </div>
        </div>
      </div>
    );
}
