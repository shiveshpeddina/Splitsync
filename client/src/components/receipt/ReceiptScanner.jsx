import React, { useState, useRef } from 'react';
import api from '../../services/api';

const ReceiptScanner = ({ onScanComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setError(null);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        setLoading(true);
        // api interceptor already unwraps response.data, so result = { success, message, data }
        const res = await api.post('/receipt/scan', { image: base64 });
        // res is the response body: { success, message, data: { description, total, items } }
        const scanData = res.data;
        
        onScanComplete({
          items: scanData.items || [],
          description: scanData.description || '',
          total: scanData.total || 0,
          currency: scanData.currency || ''
        });
      } catch (err) {
        console.error('Scan failed:', err.message || err);
        setError(err.message || 'Failed to scan receipt. Please try again.');
      } finally {
        setLoading(false);
        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '24px 20px', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', 
      borderRadius: 16, 
      border: '2px dashed #a5b4fc', 
      marginBottom: 20,
      transition: 'all 0.3s ease'
    }}>
      {loading ? (
        <div>
          {preview && (
            <img 
              src={preview} 
              alt="Receipt preview" 
              style={{ 
                width: 80, height: 80, objectFit: 'cover', 
                borderRadius: 12, marginBottom: 12, 
                border: '2px solid #a5b4fc',
                opacity: 0.7
              }} 
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 24, height: 24, border: '3px solid #4f46e5', borderTopColor: 'transparent',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite'
            }} />
            <h3 style={{ margin: 0, color: '#4f46e5', fontSize: 16 }}>✨ AI is reading your receipt...</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Extracting line items, prices, and totals using Gemini API
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🧾</div>
          <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: 16 }}>AI Receipt Scanner</h3>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
            Upload a photo of your bill — AI will extract all items, prices, and fill the expense for you.
          </p>

          {error && (
            <div style={{ 
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
              padding: '10px 14px', marginBottom: 14, color: '#dc2626', fontSize: 13,
              textAlign: 'left'
            }}>
              ⚠️ {error}
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', 
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, 
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontSize: 14
              }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.35)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Upload Receipt
            </button>
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel} 
                style={{ 
                  padding: '12px 18px', background: '#e2e8f0', color: '#475569', 
                  border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600,
                  fontSize: 14, transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#cbd5e1'}
                onMouseOut={(e) => e.target.style.background = '#e2e8f0'}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
