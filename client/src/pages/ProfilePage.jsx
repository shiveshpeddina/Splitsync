import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useToast } from "../components/common/Toast";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import CurrencySelector from "../components/currency/CurrencySelector";

import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeCurrency, setHomeCurrency] = useState("INR");
  
  const [fcmPush, setFcmPush] = useState(true);
  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [autoSms, setAutoSms] = useState(false);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setHomeCurrency(user.homeCurrency || "INR");
      setAutoSms(user.autoSMSReminders || false);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/profile", {
        name,
        phone,
        homeCurrency,
        autoSMSReminders: autoSms
      });
      if (res?.success) {
        updateUser(res.data);
        addToast("Profile updated successfully", "success");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      addToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    // Use hard redirect — ProtectedRoute unmounts this component
    // when user becomes null, so navigate() won't work reliably
    window.location.href = "/login";
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Settings</h1>
      </header>

      <div className={styles.content}>
        
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <img 
              src={user?.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
              alt="Profile" 
            />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.userName}>{user?.name}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className={styles.formSection}>
          
          {/* Account Section */}
          <div className={styles.settingGroup}>
            <h3 className={styles.groupTitle}>
              <User size={18} /> Account
            </h3>
            <div className={styles.cardGroup}>
              <div className={styles.cardItem}>
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.cardItem}>
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.cardItem}>
                <label className={styles.itemLabel}>Base Currency</label>
                <div className={styles.currencyWrap}>
                  <CurrencySelector value={homeCurrency} onChange={setHomeCurrency} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className={styles.settingGroup}>
            <h3 className={styles.groupTitle}>
              <Bell size={18} /> Notifications
            </h3>
            <div className={styles.cardGroup}>
              <div className={styles.toggleItem}>
                <div className={styles.toggleText}>
                  <span className={styles.toggleTitle}>Push Notifications</span>
                  <span className={styles.toggleSubtitle}>Stay updated on new expenses</span>
                </div>
                <Toggle isToggled={fcmPush} onToggle={() => setFcmPush(!fcmPush)} />
              </div>
              <div className={styles.borderDivider} />
              <div className={styles.toggleItem}>
                <div className={styles.toggleText}>
                  <span className={styles.toggleTitle}>WhatsApp Reminders</span>
                  <span className={styles.toggleSubtitle}>Get nudged on WhatsApp</span>
                </div>
                <Toggle isToggled={whatsappReminders} onToggle={() => setWhatsappReminders(!whatsappReminders)} />
              </div>
              <div className={styles.borderDivider} />
              <div className={styles.toggleItem}>
                <div className={styles.toggleText}>
                  <span className={styles.toggleTitle}>Auto SMS Reminders</span>
                  <span className={styles.toggleSubtitle}>Send SMS to friends (Standard rates apply)</span>
                </div>
                <Toggle isToggled={autoSms} onToggle={() => setAutoSms(!autoSms)} />
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className={styles.settingGroup}>
            <h3 className={styles.groupTitle}>
              <Shield size={18} /> Security
            </h3>
            <div className={styles.cardGroup}>
              <button type="button" className={styles.actionItem}>
                <span>Change Password</span>
                <ChevronRight size={20} color="var(--color-text-muted)" />
              </button>
              <div className={styles.borderDivider} />
              <button type="button" className={styles.actionItem}>
                <span>Privacy Policy</span>
                <ChevronRight size={20} color="var(--color-text-muted)" />
              </button>
            </div>
          </div>

          <div className={styles.submitWrap}>
            <Button type="submit" variant="primary" loading={saving} size="large" fullWidth>
              Save Changes
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className={`${styles.settingGroup} ${styles.dangerZone}`}>
          <div className={styles.cardGroup}>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
          <p className={styles.dangerText}>
            Signing out will require you to log in again to access your data.
          </p>
        </div>

      </div>
    </div>
  );
}
