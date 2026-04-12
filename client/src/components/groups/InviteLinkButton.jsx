import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function InviteLinkButton({ groupId }) {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (groupId) {
      api.get(`/groups/${groupId}/invite-link`)
        .then(res => {
          // api interceptor already unwraps response.data, so res = { success, message, data }
          const link = res?.data?.inviteLink;
          if (link) setInviteLink(link);
        })
        .catch(err => console.error('Failed to load invite link', err));
    }
  }, [groupId]);

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my group on SplitSync",
          text: "I added you to a group on SplitSync. Join here to view your expenses!",
          url: inviteLink,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold mb-2">Share Invite Link</h3>
      <p className="text-xs text-gray-500 mb-4">
        Send this link to someone so they can join the group directly.
      </p>
      <div className="flex items-center gap-2 w-full max-w-sm">
        <input
          type="text"
          readOnly
          value={inviteLink}
          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none bg-white"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded hover:bg-gray-700 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {navigator.share && (
        <button
          onClick={handleShare}
          className="mt-3 px-4 py-2 w-full max-w-sm bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Share via App
        </button>
      )}
    </div>
  );
}
