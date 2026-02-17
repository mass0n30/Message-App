
import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import formStyles from '../styles/components/form.module.css';
import profileStyles from '../styles/pages/profile.module.css';

export default function Profile() {
  const { user, SetUser, authRouter, authRouterForm, SetLoading } = useOutletContext();
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    alias: user.alias,
    email: user.email,
    bio: user.profile ? user.profile.bio : '',
    status: user.profile && user.profile?.status,
    id: user.id,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    SetLoading(true);
    try {
      const response = await authRouter.post(`${import.meta.env.VITE_API_URL}/profile`, formData);
      const result = await response.data;
      SetUser(result);
    } catch (error) {
      console.error("Error updating profile:", error);
    } 
  };


const handleUploadAvatar = async (e) => {
  e.preventDefault();
  SetLoading(true);
  try {
    if (!avatarFile) return;

    const fd = new FormData();
    fd.append("avatar", avatarFile); 

    const response = await authRouterForm.post(
      `${import.meta.env.VITE_API_URL}/profile/avatar`,
      fd
    );

    const updatedProfile = await response.data;
    SetUser(updatedProfile);
  } catch (err) {
    console.error(err);
  } finally {
    SetLoading(false);
  }
};

  return (
    <div>
      <h1>Profile Page</h1>
      {user && (
        <div>
          <form onSubmit={handleUpdateProfile} 
          className={formStyles.formContainer}
          style={{ justifyContent: 'flex-start', alignContent: 'flex-start', maxWidth: '400px' }}
          >
            <label>Alias</label>
            <input type="text" value={formData.alias} onChange={(e) => setFormData({ ...formData, alias: e.target.value })} />
            <br />
            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <br />
            <label>Bio</label>
            <textarea value={formData.bio ? formData.bio : ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            <br />
            <label>Status</label>
              <select
                value={formData.status === true ? "Online" : "Offline"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value === "Online" ? true : false })
                }
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>

            <br />
            <label>
              <button type="submit">Update Profile</button>
            </label>
          </form>

          <div>
            <div className={profileStyles.avatarSection}>
              <img src={user.profile && user.profile.avatarUrl ? `${user.profile.avatarUrl}` : ''} alt="User Avatar" />
            </div>
            <button className={profileStyles.openModalButton}>Change Avatar</button>
            <div className={profileStyles.addFileModalContent}>
              <label>Add a File</label>
              <form onSubmit={handleUploadAvatar}>
                <input type="file" name="avatar" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                <button type="submit">Upload</button>
              </form>
              <button className={profileStyles.closeModalButton}>Close</button>
            </div>
          </div>

        </div>

      )}
    </div>
  );
}

// Separate component to view other users' profiles
export function ProfileView() {

  const { SetMount, mount, SetNewFetch, user, SetCurrentRoom, 
  currentRoom, authRouter, SetError } = useOutletContext();

  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ friendshipStatus, setFriendshipStatus ] = useState(null);
  const [pending, setPending] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authRouter.get(`/friends/${userId}`);
        const result = await response.data;
        setSelectedUser(result.friendData);
        setFriendshipStatus(result.friendshipStatus);
        const pendingStatus = user.friendsOf.find(friend => friend.id === parseInt(userId, 10) && result.friendshipStatus !== true);
        setPending(pendingStatus ? true : false);
      } catch (error) {
        SetError(error);
      }
    };

    fetchProfile();
  }, [selectedUser]);


  const handleUpdateFriendship = async (friendId) => {

    try {
      const response = await authRouter.post(`/friends/${friendId}`);
    } catch (error) {
      SetError(error);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    if (!messageContent || messageContent.trim() === '') return;

    try {
      const response = await authRouter.post(`friends/chats/private/${selectedUser.id}`, {
        userId: user.id,
        friendId: selectedUser.id,
        content: messageContent
      });
      const result = await response.data;
    } catch (error) {
      SetError(error);
    }
  };


  return (
    <div>
      {selectedUser && (
        <div>
          <h2>{selectedUser.alias}'s Profile</h2>
          <p>Email: {selectedUser.email}</p>
          <p>{selectedUser.profile.bio}</p>
          <p>Status: {friendshipStatus ? "Friends" : (pending ? "Pending" : "Not Friends")}</p>
          <div>
            <button onClick={() => handleUpdateFriendship(selectedUser.id)}>
              {!friendshipStatus && !pending ? (
                <span>Add Friend</span>
              ) : pending ? (
                <span>Pending...</span>
              ) : (
                <span>Unfriend</span>
              )}
            </button>
          </div>
          <div>
            <form className={formStyles.formContainer} onSubmit={handleSubmitMessage}>
              <input type="text" placeholder="Send Message" onChange={(e) => setMessageContent(e.target.value)} />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}