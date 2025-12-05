import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Tag } from 'lucide-react';
import { api } from '../../lib/api';

interface TagManagerProps {
  orgId: string;
  type: 'event' | 'scheduleItem';
  title: string;
  description: string;
}

interface TagData {
  id: string;
  name: string;
  color: string;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#10b981', // green
  '#14b8a6', // teal
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#ec4899', // pink
  '#64748b', // slate
];

const TagManager: React.FC<TagManagerProps> = ({ orgId, type, title, description }) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#64748b' });
  const [loading, setLoading] = useState(false);

  const cardStyle = {
    background: "#fff",
    borderRadius: "1.2rem 1.35rem 1.15rem 1.25rem",
    boxShadow: "2px 4px 0 #e5e7eb, 0 2px 8px 0 rgba(0,0,0,0.08)",
    padding: "2rem",
    border: "2px solid #181818",
    position: "relative" as const,
    transform: "rotate(-0.2deg)",
  };

  const buttonStyle = {
    padding: "clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)",
    border: "2px solid #181818",
    borderRadius: "8px",
    fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
    fontWeight: "700" as const,
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    cursor: "pointer" as const,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease",
    boxShadow: "2px 4px 0 #181818",
  };

  const inputStyle = {
    width: '100%',
    padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.875rem, 2.5vw, 1rem)',
    border: '2px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: 'clamp(0.9rem, 2.25vw, 1rem)',
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
    fontSize: 'clamp(0.9rem, 2.25vw, 1rem)',
    fontWeight: '700',
    color: '#0f172a',
  };

  useEffect(() => {
    loadTags();
  }, [orgId, type]);

  const loadTags = async () => {
    try {
      const data = type === 'event' 
        ? await api.getEventTags(orgId)
        : await api.getScheduleItemTags(orgId);
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags', error);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    setLoading(true);
    try {
      if (editingId) {
        // Update existing tag
        const updated = type === 'event'
          ? await api.updateEventTag(editingId, formData)
          : await api.updateScheduleItemTag(editingId, formData);
        setTags(tags.map(t => t.id === editingId ? updated : t));
      } else {
        // Create new tag
        const created = type === 'event'
          ? await api.createEventTag(orgId, formData)
          : await api.createScheduleItemTag(orgId, formData);
        setTags([...tags, created]);
      }
      
      setFormData({ name: '', color: '#64748b' });
      setIsAdding(false);
      setEditingId(null);
    } catch (error: any) {
      alert(error.message || 'Failed to save tag');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: TagData) => {
    setFormData({ name: tag.name, color: tag.color });
    setEditingId(tag.id);
    setIsAdding(true);
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Tag wirklich löschen?')) return;
    
    try {
      if (type === 'event') {
        await api.deleteEventTag(tagId);
      } else {
        await api.deleteScheduleItemTag(tagId);
      }
      setTags(tags.filter(t => t.id !== tagId));
    } catch (error) {
      alert('Failed to delete tag');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', color: '#64748b' });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div style={{
      ...cardStyle,
      marginBottom: '2rem'
    }}>
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "30%",
          width: "45px",
          height: "16px",
          background: "repeating-linear-gradient(135deg, #fffbe7 0 6px, #a855f7 6px 12px)",
          borderRadius: "6px",
          border: "1.5px solid #9333ea",
          boxShadow: "0 1px 4px rgba(147,51,234,0.3)",
          transform: "translateX(-50%) rotate(-2deg)",
          zIndex: 2,
        }}
      />
      
      <h2 style={{
        fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Tag size={24} strokeWidth={2.5} />
        {title}
      </h2>

      <p style={{
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
        fontSize: '0.9rem',
        color: '#64748b',
        marginBottom: '1.5rem',
        fontWeight: '500'
      }}>
        {description}
      </p>

        {/* Tag List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {tags.map(tag => (
            <div
              key={tag.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.boxShadow = '2px 4px 0 #cbd5e1';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: tag.color,
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  flexShrink: 0
                }}
              />
              <div style={{
                flex: 1,
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#0f172a'
              }}>
                {tag.name}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => handleEdit(tag)}
                  style={{
                    padding: '0.5rem',
                    border: '2px solid #0ea5e9',
                    borderRadius: '6px',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '1px 2px 0 #0ea5e9',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Tag bearbeiten"
                >
                  <Edit2 size={16} strokeWidth={2} />
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  style={{
                    padding: '0.5rem',
                    border: '2px solid #ef4444',
                    borderRadius: '6px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '1px 2px 0 #ef4444',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Tag löschen"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
          
          {tags.length === 0 && !isAdding && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#94a3b8',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: '0.9rem',
              border: '2px dashed #cbd5e1',
              borderRadius: '10px',
              backgroundColor: '#f8fafc'
            }}>
              Noch keine Tags erstellt
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 1rem 0'
            }}>
              {editingId ? 'Tag bearbeiten' : 'Neues Tag erstellen'}
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>
                Tag Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Konfi 2025, Workshop, etc."
                autoFocus
                style={inputStyle as any}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                Farbe wählen
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))',
                gap: '0.75rem'
              }}>
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '10px',
                      backgroundColor: color,
                      border: formData.color === color ? '3px solid #0f172a' : '2px solid #fff',
                      cursor: 'pointer',
                      boxShadow: formData.color === color 
                        ? `0 0 0 2px #fbbf24, 2px 4px 0 #0f172a` 
                        : '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease',
                      transform: formData.color === color ? 'scale(1.05)' : 'scale(1)',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.color !== color) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.color !== color) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSave}
                disabled={loading || !formData.name.trim()}
                style={{
                  ...buttonStyle,
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: '#fff',
                  borderColor: '#10b981',
                  opacity: loading || !formData.name.trim() ? 0.6 : 1,
                  cursor: loading || !formData.name.trim() ? 'not-allowed' : 'pointer',
                  justifyContent: 'center',
                } as any}
                onMouseEnter={(e) => {
                  if (!loading && formData.name.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '3px 6px 0 #181818';
                    e.currentTarget.style.backgroundColor = '#059669';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && formData.name.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '2px 4px 0 #181818';
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }
                }}
              >
                <Check size={18} strokeWidth={2} />
                {editingId ? 'Aktualisieren' : 'Erstellen'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#fff',
                  color: '#ef4444',
                  borderColor: '#ef4444',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                } as any}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '3px 6px 0 #ef4444';
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '2px 4px 0 #ef4444';
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              ...buttonStyle,
              width: '100%',
              backgroundColor: '#fff',
              color: '#a855f7',
              borderColor: '#a855f7',
              borderStyle: 'solid',
              justifyContent: 'center',
              fontWeight: '700',
            } as any}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3e8ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '3px 6px 0 #a855f7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '2px 4px 0 #181818';
            }}
          >
            <Plus size={18} strokeWidth={2} />
            Neues Tag hinzufügen
          </button>
        )}
    </div>
  );
};

export default TagManager;
