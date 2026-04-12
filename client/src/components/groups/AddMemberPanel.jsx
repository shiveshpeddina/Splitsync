import React, { useState } from "react";
import api from "../../services/api";
import InviteLinkButton from "./InviteLinkButton";
import Avatar from "../common/Avatar";
import { AvatarDisplay } from "../common/AvatarPicker";
import AvatarPicker from "../common/AvatarPicker";
import { useFriends } from "../../context/FriendContext";
import CurrencySelector from "../currency/CurrencySelector";

export default function AddMemberPanel({ groupId, inviterId, groupName, onMemberAdded, currentMembers = [] }) {
  const { friends, addFriend } = useFriends();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [newAvatar, setNewAvatar] = useState(null);
  const [adding, setAdding] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const availableFriends = friends.filter(
    (f) => !currentMembers.find((m) => m.id === f.id)
  );

  const handleAddExisting = async (friend) => {
    setAdding(friend.id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post(`/groups/${groupId}/members`, { userId: friend.id });
      setSuccessMsg(`✅ ${friend.name} was added to the group!`);
      setTimeout(() => onMemberAdded?.(), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to add member.");
    } finally {
      setAdding(null);
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      return setErrorMsg("Please provide both name and phone number.");
    }
    
    setAdding("new");
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      // Add to friends explicitly
      const res = await addFriend(phone.trim(), name.trim(), currency);
      const newFriend = res.friend;

      // If avatar was selected, update it
      if (newAvatar && newFriend.id) {
        try {
          await api.put(`/friends/${newFriend.id}`, { avatar: newAvatar });
        } catch (_) {}
      }

      // Add to group
      await api.post(`/groups/${groupId}/members`, { userId: newFriend.id });

      setSuccessMsg(`✅ Added ${newFriend.name} to friends and the group!`);
      setName("");
      setPhone("");
      setCurrency("INR");
      setNewAvatar(null);
      setTimeout(() => onMemberAdded?.(), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to add new contact.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Existing Friends Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "14px", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>👥 Existing Friends</h3>
        {availableFriends.length > 0 ? (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", maxHeight: '200px', overflowY: 'auto' }}>
            {availableFriends.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                  {f.avatar ? (
                    <AvatarDisplay avatarId={f.avatar} name={f.alias || f.name} size={32} />
                  ) : (
                    <Avatar name={f.alias || f.name} size={32} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "13px" }}>{f.alias || f.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis" }}>{f.phone || f.email}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleAddExisting(f)} 
                  disabled={adding === f.id} 
                  style={{ padding: "6px 12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: adding === f.id ? "not-allowed" : "pointer" }}
                >
                  {adding === f.id ? "Adding…" : "+ Add"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            {friends.length === 0 ? "You haven't added any friends yet." : "All your friends are already in this group!"}
          </p>
        )}
      </div>

      {/* Add New Contact Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "14px", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>➕ Add New Person</h3>
        <form onSubmit={handleAddNew} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ paddingTop: '2px' }}>
              <AvatarPicker value={newAvatar} onChange={setNewAvatar} size="small" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder="Name (e.g. Alex)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
            />
            <input
              type="tel"
              placeholder="Phone number (+91 00000 00000)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
            />
            <div style={{ border: '1px solid #cbd5e1', padding: '2px', borderRadius: '8px', background: '#fff' }}>
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={adding === "new" || !name || !phone}
            style={{ padding: "10px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: (adding === "new" || !name || !phone) ? "not-allowed" : "pointer", marginTop: '4px' }}
          >
            {adding === "new" ? "Adding..." : "Add to Friends & Group"}
          </button>
        </form>
      </div>

      {/* Messages */}
      {successMsg && <p style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, margin: 0, textAlign: 'center' }}>{successMsg}</p>}
      {errorMsg && <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600, margin: 0, textAlign: 'center' }}>⚠️ {errorMsg}</p>}

      <div style={{ height: "1px", background: "#e2e8f0", margin: "4px 0" }} />

      <InviteLinkButton groupId={groupId} />
    </div>
  );
}
