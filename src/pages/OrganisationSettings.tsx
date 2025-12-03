import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Image as ImageIcon,
  Users,
  UserPlus,
  UserMinus,
  Monitor,
  Save,
  ArrowLeft,
  Mail,
  Shield,
  User,
} from 'lucide-react';
import FlipchartBackground from '../components/layout/FlipchartBackground';
import { ConfirmModal } from '../components/ui';
import { api } from '../lib/api';
import styles from './Admin.module.css';

type UserDetails = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  emailVerified: boolean;
  createdAt: string;
};

const OrganisationSettings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orgId = searchParams.get('org');

  // State management
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Invite user form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: string;
    username: string;
  }>({ isOpen: false, userId: '', username: '' });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) {
      navigate('/admin/dashboard');
      return;
    }
    loadData();
  }, [orgId, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgData, usersData] = await Promise.all([
        api.getOrganisation(orgId!),
        api.getOrganisationUsers(orgId!),
      ]);
      
      setOrgName(orgData.name);
      setOrgDescription(orgData.description || '');
      setLogoUrl(orgData.logoUrl || '');
      setLogoPreview(orgData.logoUrl || '');
      setUsers(usersData.map(u => ({
        ...u,
        email: u.email || '',
        emailVerified: u.emailVerified ?? false,
        createdAt: u.createdAt || new Date().toISOString(),
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to load organisation data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrganisation = async () => {
    try {
      setSaving(true);
      setError(null);
      
      let finalLogoUrl = logoUrl;
      
      // Upload logo file if selected
      if (logoFile) {
        try {
          const uploadResult = await api.uploadLogo(logoFile);
          finalLogoUrl = uploadResult.logoUrl;
        } catch (uploadErr: any) {
          setError(`Failed to upload logo: ${uploadErr.message}`);
          setSaving(false);
          return;
        }
      }
      
      await api.updateOrganisation(orgId!, {
        name: orgName,
        description: orgDescription,
        logoUrl: finalLogoUrl || undefined,
      });
      setSuccessMessage('Organisation updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadData();
      setLogoFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update organisation');
    } finally {
      setSaving(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.inviteUser(orgId!, {
        username: inviteUsername,
        email: inviteEmail,
        password: invitePassword,
        role: inviteRole,
      });
      setSuccessMessage('User invited successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowInviteForm(false);
      setInviteUsername('');
      setInviteEmail('');
      setInvitePassword('');
      setInviteRole('member');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to invite user');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      setSaving(true);
      setError(null);
      await api.removeUser(orgId!, userId);
      setSuccessMessage('User removed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteConfirm({ isOpen: false, userId: '', username: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove user');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '1.2rem 1.35rem 1.15rem 1.25rem',
    boxShadow: '2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)',
    padding: '2rem',
    border: '2px solid #181818',
    position: 'relative' as const,
    transform: 'rotate(-0.2deg)',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: '2px solid #181818',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '2px 4px 0 #181818',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
  };

  if (loading) {
    return (
      <div className={styles.adminWrapper}>
        <FlipchartBackground />
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      <FlipchartBackground />

      <main
        className={styles.adminContent}
        style={{
          padding: '2rem 1rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            ...cardStyle,
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate(`/admin/dashboard?org=${orgId}`)}
              style={{
                ...buttonStyle,
                backgroundColor: '#fff',
                color: '#0ea5e9',
                border: '2px solid #0ea5e9',
                boxShadow: '2px 4px 0 #0ea5e9',
                padding: '0.5rem',
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1
              style={{
                fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Organisation Settings
            </h1>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div
            style={{
              ...cardStyle,
              marginBottom: '1.5rem',
              backgroundColor: '#fee2e2',
              border: '2px solid #dc2626',
              color: '#991b1b',
            }}
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div
            style={{
              ...cardStyle,
              marginBottom: '1.5rem',
              backgroundColor: '#d1fae5',
              border: '2px solid #10b981',
              color: '#065f46',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Organisation Details Section */}
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Building2 size={24} />
            Organisation Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Organisation Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                style={inputStyle}
                placeholder="Enter organisation name"
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                placeholder="Enter organisation description (optional)"
              />
            </div>

            <div>
              <label style={labelStyle}>
                <ImageIcon size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Organisation Logo
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                style={{
                  ...inputStyle,
                  padding: '0.5rem',
                  cursor: 'pointer',
                }}
              />
              
              {logoPreview && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img
                    src={logoPreview}
                    alt="Organisation Logo Preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '150px',
                      border: '2px solid #cbd5e1',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                  />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                    {logoFile ? 'New logo selected' : 'Current logo'}
                  </p>
                </div>
              )}
              
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                Upload an image file (JPEG, PNG, GIF, WebP, or SVG). Max size: 5MB
              </p>
            </div>

            <button
              onClick={handleSaveOrganisation}
              disabled={saving}
              style={{
                ...buttonStyle,
                backgroundColor: '#10b981',
                color: '#fff',
                justifyContent: 'center',
              }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* User Management Section */}
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2
              style={{
                fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Users size={24} />
              Users ({users.length})
            </h2>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              style={{
                ...buttonStyle,
                backgroundColor: '#fbbf24',
                color: '#fff',
                padding: '0.625rem 1.25rem',
              }}
            >
              <UserPlus size={18} />
              Invite User
            </button>
          </div>

          {/* Invite User Form */}
          {showInviteForm && (
            <form
              onSubmit={handleInviteUser}
              style={{
                padding: '1.5rem',
                backgroundColor: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
                  fontSize: '1.2rem',
                  margin: 0,
                  marginBottom: '0.5rem',
                }}
              >
                Invite New User
              </h3>

              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter initial password"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label style={labelStyle}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                  style={inputStyle}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#10b981',
                    color: '#fff',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <UserPlus size={18} />
                  {saving ? 'Inviting...' : 'Invite User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#fff',
                    color: '#64748b',
                    border: '2px solid #cbd5e1',
                    boxShadow: '2px 4px 0 #cbd5e1',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Users List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {users.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  color: '#64748b',
                }}
              >
                No users yet. Invite users to get started!
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '1.25rem',
                    border: '2px solid #cbd5e1',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div
                      style={{
                        fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        marginBottom: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <User size={18} />
                      {user.username}
                      {user.role === 'admin' && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#fbbf24',
                            color: '#fff',
                            borderRadius: '4px',
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                          }}
                        >
                          <Shield size={12} style={{ display: 'inline' }} /> ADMIN
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                        fontSize: '0.9rem',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Mail size={14} />
                      {user.email}
                      {user.emailVerified ? (
                        <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✓ Verified</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>✗ Not verified</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        isOpen: true,
                        userId: user.id,
                        username: user.username,
                      })
                    }
                    style={{
                      padding: '0.5rem 1rem',
                      border: '2px solid #ef4444',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                    }}
                  >
                    <UserMinus size={16} />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manage Screens Section - Placeholder */}
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Monitor size={24} />
            Manage Screens
          </h2>
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              color: '#64748b',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            }}
          >
            Screen management coming soon! This will allow you to manage display screens for your organisation.
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: '', username: '' })}
        onConfirm={() => handleRemoveUser(deleteConfirm.userId)}
        title="Remove User"
        message={`Are you sure you want to remove ${deleteConfirm.username} from this organisation?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="error"
      />
    </div>
  );
};

export default OrganisationSettings;
