
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

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
          <form onSubmit={handleUpdateProfile}>
            <label>Alias:</label>
            <input type="text" value={formData.alias} onChange={(e) => setFormData({ ...formData, alias: e.target.value })} />
            <br />
            <label>Email:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <br />
            <label>Bio:</label>
            <input type="text" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            <br />
            <label>Status:
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="busy">Busy</option>
              </select>
            </label>
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
