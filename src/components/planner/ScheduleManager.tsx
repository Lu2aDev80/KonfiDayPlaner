import React, { useState } from 'react';
import { Plus, Trash2, Clock, GripVertical, Save, X } from 'lucide-react';
import type { ScheduleItem } from '../../types/schedule';

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  onSave: (schedule: ScheduleItem[]) => void;
  onCancel: () => void;
}

const typeLabels: Record<string, string> = {
  session: 'Session',
  workshop: 'Workshop',
  break: 'Pause',
  game: 'Spiel',
  announcement: 'Ansage',
  transition: 'Übergang'
};

const typeColors: Record<string, { bg: string; border: string; icon: string }> = {
  session: { bg: '#dbeafe', border: '#3b82f6', icon: '#1e40af' },
  workshop: { bg: '#fef3c7', border: '#f59e0b', icon: '#b45309' },
  break: { bg: '#d1fae5', border: '#10b981', icon: '#047857' },
  game: { bg: '#fce7f3', border: '#ec4899', icon: '#be185d' },
  announcement: { bg: '#e0e7ff', border: '#6366f1', icon: '#4338ca' },
  transition: { bg: '#f3f4f6', border: '#9ca3af', icon: '#4b5563' }
};

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, onSave, onCancel }) => {
  const [items, setItems] = useState<ScheduleItem[]>(schedule);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = () => {
    const lastTime = items.length > 0 ? items[items.length - 1].time : '09:00';
    const [hours, minutes] = lastTime.split(':').map(Number);
    const newMinutes = minutes + 15;
    const newHours = hours + Math.floor(newMinutes / 60);
    const newTime = `${String(newHours % 24).padStart(2, '0')}:${String(newMinutes % 60).padStart(2, '0')}`;

    const newItem: ScheduleItem = {
      id: Date.now(),
      time: newTime,
      type: 'session',
      title: ''
    };
    setItems([...items, newItem]);
    setEditingIndex(items.length);
  };

  const updateItem = (index: number, updates: Partial<ScheduleItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '2px solid #181818',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#181818',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={24} />
            Termine verwalten
          </h2>
          <button
            onClick={addItem}
            style={{
              padding: '0.5rem 1rem',
              border: '2px solid #181818',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '700',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#d9fdd2',
              color: '#181818',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '2px 3px 0 #181818'
            }}
          >
            <Plus size={16} />
            Neu
          </button>
        </div>

        {/* Schedule Items */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem'
        }}>
          {items.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#9ca3af',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif'
            }}>
              <Clock size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Noch keine Termine</p>
              <p style={{ fontSize: '0.9rem' }}>Klicke auf "Neu" um den ersten Termin hinzuzufügen</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item, index) => {
                const colors = typeColors[item.type];
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={item.id}
                    style={{
                      border: `2px solid ${colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: isEditing ? '#fff' : colors.bg,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isEditing ? (
                      // Editing Mode
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '0 0 auto' }}>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#64748b',
                                marginBottom: '0.25rem',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                              }}>
                                Uhrzeit
                              </label>
                              <input
                                type="time"
                                value={item.time}
                                onChange={(e) => updateItem(index, { time: e.target.value })}
                                style={{
                                  width: '110px',
                                  padding: '0.5rem',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '0.95rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 auto', minWidth: '140px' }}>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#64748b',
                                marginBottom: '0.25rem',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                              }}>
                                Typ
                              </label>
                              <select
                                value={item.type}
                                onChange={(e) => updateItem(index, { type: e.target.value as any })}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '0.95rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                  backgroundColor: '#fff'
                                }}
                              >
                                {Object.entries(typeLabels).map(([value, label]) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              color: '#64748b',
                              marginBottom: '0.25rem',
                              fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                            }}>
                              Titel *
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItem(index, { title: e.target.value })}
                              placeholder="z.B. Begrüßung & Kennenlernen"
                              autoFocus
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '2px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.95rem',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          
                          {/* Type-specific fields */}
                          {(item.type === 'session' || item.type === 'workshop') && (
                            <>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    {item.type === 'session' ? 'Sprecher' : 'Leiter'}
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).speaker || ''}
                                    onChange={(e) => updateItem(index, { speaker: e.target.value })}
                                    placeholder="Name"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Ort
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).location || ''}
                                    onChange={(e) => updateItem(index, { location: e.target.value })}
                                    placeholder="Raum/Ort"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              </div>
                              {item.type === 'workshop' && (
                                <div>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Materialien
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).materials || ''}
                                    onChange={(e) => updateItem(index, { materials: e.target.value })}
                                    placeholder="z.B. Stifte, Papier"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <label style={{
                                  display: 'block',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                }}>
                                  Details
                                </label>
                                <textarea
                                  value={(item as any).details || ''}
                                  onChange={(e) => updateItem(index, { details: e.target.value })}
                                  placeholder="Zusätzliche Informationen"
                                  rows={2}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                    boxSizing: 'border-box',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>
                            </>
                          )}

                          {item.type === 'break' && (
                            <>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Dauer
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).duration || ''}
                                    onChange={(e) => updateItem(index, { duration: e.target.value })}
                                    placeholder="z.B. 15 Min"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Snacks
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).snacks || ''}
                                    onChange={(e) => updateItem(index, { snacks: e.target.value })}
                                    placeholder="z.B. Obst & Getränke"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {item.type === 'game' && (
                            <>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Spielleiter
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).facilitator || ''}
                                    onChange={(e) => updateItem(index, { facilitator: e.target.value })}
                                    placeholder="Name"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    marginBottom: '0.25rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                  }}>
                                    Ort
                                  </label>
                                  <input
                                    type="text"
                                    value={(item as any).location || ''}
                                    onChange={(e) => updateItem(index, { location: e.target.value })}
                                    placeholder="Raum/Ort"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '0.95rem',
                                      fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label style={{
                                  display: 'block',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                }}>
                                  Materialien
                                </label>
                                <input
                                  type="text"
                                  value={(item as any).materials || ''}
                                  onChange={(e) => updateItem(index, { materials: e.target.value })}
                                  placeholder="z.B. Ball, Seile"
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                    boxSizing: 'border-box'
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{
                                  display: 'block',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                                }}>
                                  Details
                                </label>
                                <textarea
                                  value={(item as any).details || ''}
                                  onChange={(e) => updateItem(index, { details: e.target.value })}
                                  placeholder="Spielregeln oder Hinweise"
                                  rows={2}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                    boxSizing: 'border-box',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>
                            </>
                          )}

                          {item.type === 'announcement' && (
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#64748b',
                                marginBottom: '0.25rem',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                              }}>
                                Details
                              </label>
                              <textarea
                                value={(item as any).details || ''}
                                onChange={(e) => updateItem(index, { details: e.target.value })}
                                placeholder="Details zur Ansage"
                                rows={2}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '0.95rem',
                                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                  boxSizing: 'border-box',
                                  resize: 'vertical'
                                }}
                              />
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setEditingIndex(null)}
                              style={{
                                padding: '0.4rem 0.75rem',
                                border: '2px solid #10b981',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                backgroundColor: '#d1fae5',
                                color: '#047857',
                                cursor: 'pointer',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif'
                              }}
                            >
                              Fertig
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div style={{
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <button
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: colors.icon,
                            cursor: 'grab',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                          }}
                          onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                          onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                        >
                          <GripVertical size={16} />
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: colors.icon,
                            marginBottom: '0.25rem',
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {item.time} • {typeLabels[item.type]}
                          </div>
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#181818',
                            fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif'
                          }}>
                            {item.title || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Kein Titel</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0}
                            style={{
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: index === 0 ? '#f3f4f6' : '#fff',
                              color: index === 0 ? '#9ca3af' : colors.icon,
                              cursor: index === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                            title="Nach oben"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === items.length - 1}
                            style={{
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: index === items.length - 1 ? '#f3f4f6' : '#fff',
                              color: index === items.length - 1 ? '#9ca3af' : colors.icon,
                              cursor: index === items.length - 1 ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                            title="Nach unten"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => setEditingIndex(index)}
                            style={{
                              padding: '0.4rem 0.6rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: '#fff',
                              color: colors.icon,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                            title="Bearbeiten"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            style={{
                              padding: '0.4rem',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              cursor: 'pointer'
                            }}
                            title="Löschen"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem',
          borderTop: '2px solid #e5e7eb',
          display: 'flex',
          gap: '0.75rem',
          backgroundColor: '#f9fafb'
        }}>
          <button
            onClick={() => onSave(items)}
            style={{
              flex: 1,
              padding: '0.875rem',
              border: '2px solid #181818',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#fbbf24',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '2px 4px 0 #181818'
            }}
          >
            <Save size={16} />
            Speichern
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '0.875rem 1.5rem',
              border: '2px solid #64748b',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              backgroundColor: '#fff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <X size={16} />
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
