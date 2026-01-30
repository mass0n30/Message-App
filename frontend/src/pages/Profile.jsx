
import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import formStyles from '../styles/components/form.module.css';

export default function Profile() {
  const { user, authRouter, SetLoading } = useOutletContext();
  const [formData, setFormData] = useState({
    alias: user.alias,
    email: user.email,
    id: user.id,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    SetLoading(true);
    try {
      const response = await authRouter.post(`${import.meta.env.VITE_API_URL}/profile`, formData);
      const result = await response.data;
      setFormData({
        ...formData,
        alias: result.profile.alias,
        email: result.profile.email,
        id: result.profile.userId,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
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
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            <br />
            <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="busy">Busy</option>
              </select>
            <br />
            <label>
              <button type="submit">Update Profile</button>
            </label>
          </form>
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


  return (
    <div>
      {selectedUser && (
        <div>
          <h2>{selectedUser.alias}'s Profile</h2>
          <p>Email: {selectedUser.email}</p>
          <p>Bio: {selectedUser.bio}</p>
          <p>Status: {friendshipStatus ? "Friends" : (pending ? "Pending" : "Not Friends")}</p>
          <div className={formStyles.form_row}>
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
        </div>
      )}
    </div>
  );
}