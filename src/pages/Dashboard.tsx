import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Folder,
  FileText,
  Eye,
  Clock,
} from "lucide-react";
import EventForm from "../components/forms/EventForm";
import DayPlanForm from "../components/forms/DayPlanForm";
import ScheduleManager from "../components/planner/ScheduleManager";
import type { Event, DayPlan } from "../types/event";
import type { ScheduleItem } from "../types/schedule";
import { organisations } from "../data/organisations";

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const orgId = searchParams.get("org");

  // Determine the base path for navigation
  const basePath = location.pathname.startsWith("/login") ? "/login" : "/admin";

  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDayPlanForm, setShowDayPlanForm] = useState(false);
  const [editingDayPlan, setEditingDayPlan] = useState<DayPlan | null>(null);
  const [managingSchedule, setManagingSchedule] = useState<DayPlan | null>(
    null
  );

  // Get organization info
  const organisation = organisations.find((org) => org.id === orgId);

  useEffect(() => {
    if (!orgId) {
      navigate(basePath);
      return;
    }

    // Load events from localStorage
    const storedEvents = localStorage.getItem(`events_${orgId}`);
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      setEvents(
        parsed.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          dayPlans: e.dayPlans.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
          })),
        }))
      );
    }
  }, [orgId, navigate]);

  // Save events to localStorage
  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem(`events_${orgId}`, JSON.stringify(updatedEvents));
  };

  // Event CRUD operations
  const handleCreateEvent = (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "dayPlans">
  ) => {
    const newEvent: Event = {
      ...eventData,
      id: `evt_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      dayPlans: [],
    };
    saveEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const handleUpdateEvent = (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "dayPlans">
  ) => {
    if (!editingEvent) return;

    const updatedEvents = events.map((e) =>
      e.id === editingEvent.id
        ? { ...e, ...eventData, updatedAt: new Date() }
        : e
    );
    saveEvents(updatedEvents);
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (
      confirm(
        "Möchten Sie diese Veranstaltung wirklich löschen? Alle Tagespläne werden ebenfalls gelöscht."
      )
    ) {
      saveEvents(events.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    }
  };

  // DayPlan CRUD operations
  const handleCreateDayPlan = (
    dayPlanData: Omit<DayPlan, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedEvent) return;

    const newDayPlan: DayPlan = {
      ...dayPlanData,
      id: `day_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedEvents = events.map((e) =>
      e.id === selectedEvent.id
        ? { ...e, dayPlans: [...e.dayPlans, newDayPlan], updatedAt: new Date() }
        : e
    );
    saveEvents(updatedEvents);
    setSelectedEvent(
      updatedEvents.find((e) => e.id === selectedEvent.id) || null
    );
    setShowDayPlanForm(false);
  };

  const handleUpdateDayPlan = (
    dayPlanData: Omit<DayPlan, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedEvent || !editingDayPlan) return;

    const updatedEvents = events.map((e) =>
      e.id === selectedEvent.id
        ? {
            ...e,
            dayPlans: e.dayPlans.map((d) =>
              d.id === editingDayPlan.id
                ? { ...d, ...dayPlanData, updatedAt: new Date() }
                : d
            ),
            updatedAt: new Date(),
          }
        : e
    );
    saveEvents(updatedEvents);
    setSelectedEvent(
      updatedEvents.find((e) => e.id === selectedEvent.id) || null
    );
    setEditingDayPlan(null);
    setShowDayPlanForm(false);
  };

  const handleDeleteDayPlan = (dayPlanId: string) => {
    if (!selectedEvent) return;

    if (confirm("Möchten Sie diesen Tagesplan wirklich löschen?")) {
      const updatedEvents = events.map((e) =>
        e.id === selectedEvent.id
          ? {
              ...e,
              dayPlans: e.dayPlans.filter((d) => d.id !== dayPlanId),
              updatedAt: new Date(),
            }
          : e
      );
      saveEvents(updatedEvents);
      setSelectedEvent(
        updatedEvents.find((e) => e.id === selectedEvent.id) || null
      );
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSaveSchedule = (schedule: ScheduleItem[]) => {
    if (!selectedEvent || !managingSchedule) return;

    const updatedEvents = events.map((e) =>
      e.id === selectedEvent.id
        ? {
            ...e,
            dayPlans: e.dayPlans.map((d) =>
              d.id === managingSchedule.id
                ? { ...d, schedule, updatedAt: new Date() }
                : d
            ),
            updatedAt: new Date(),
          }
        : e
    );
    saveEvents(updatedEvents);
    setSelectedEvent(
      updatedEvents.find((e) => e.id === selectedEvent.id) || null
    );
    setManagingSchedule(null);
  };

  // Show Schedule Manager
  if (managingSchedule) {
    return (
      <ScheduleManager
        schedule={managingSchedule.schedule}
        onSave={handleSaveSchedule}
        onCancel={() => setManagingSchedule(null)}
      />
    );
  }

  // Show forms
  if (showEventForm) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <EventForm
          event={editingEvent}
          organizationId={orgId!}
          onSave={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      </div>
    );
  }

  if (showDayPlanForm && selectedEvent) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <DayPlanForm
          dayPlan={editingDayPlan}
          event={selectedEvent}
          onSave={editingDayPlan ? handleUpdateDayPlan : handleCreateDayPlan}
          onCancel={() => {
            setShowDayPlanForm(false);
            setEditingDayPlan(null);
          }}
        />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "1rem",
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily:
                '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: "700",
              color: "#181818",
              marginBottom: "0.5rem",
              margin: 0,
            }}
          >
            Admin Dashboard
          </h1>
          <p
            style={{
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              color: "#64748b",
              margin: 0,
            }}
          >
            {organisation?.name || "Organisation"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.75rem 1.25rem",
            border: "2px solid #dc2626",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: "600",
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            backgroundColor: "#fff",
            color: "#dc2626",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
          }}
        >
          <LogOut size={16} />
          Abmelden
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedEvent
            ? "repeat(auto-fit, minmax(min(100%, 350px), 1fr))"
            : "1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Events List */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontFamily:
                  '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                fontWeight: "600",
                color: "#181818",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}
            >
              <Folder size={20} />
              Veranstaltungen ({events.length})
            </h2>
            <button
              onClick={() => setShowEventForm(true)}
              style={{
                padding: "0.625rem 1rem",
                border: "2px solid #181818",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "700",
                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                backgroundColor: "#fbbf24",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
                boxShadow: "2px 4px 0 #181818",
              }}
            >
              <Plus size={16} />
              Neu
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {events.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  color: "#9ca3af",
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                }}
              >
                Noch keine Veranstaltungen. Klicke auf "Neu" um zu starten!
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    padding: "1rem",
                    border: `2px solid ${
                      selectedEvent?.id === event.id ? "#fbbf24" : "#e5e7eb"
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      selectedEvent?.id === event.id ? "#fef3c7" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow:
                      selectedEvent?.id === event.id
                        ? "2px 4px 0 #fbbf24"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily:
                            '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                          fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                          fontWeight: "600",
                          color: "#181818",
                          marginBottom: "0.25rem",
                          margin: 0,
                        }}
                      >
                        {event.name}
                      </h3>
                      {event.description && (
                        <p
                          style={{
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                            fontSize: "0.85rem",
                            color: "#64748b",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {event.description}
                        </p>
                      )}
                      <div
                        style={{
                          fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                          fontSize: "0.8rem",
                          color: "#9ca3af",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FileText size={12} />
                        {event.dayPlans.length} Tagesplan
                        {event.dayPlans.length !== 1 ? "e" : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEvent(event);
                          setShowEventForm(true);
                        }}
                        style={{
                          padding: "0.4rem",
                          border: "none",
                          borderRadius: "4px",
                          backgroundColor: "#e0f2fe",
                          color: "#0284c7",
                          cursor: "pointer",
                        }}
                        title="Bearbeiten"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        style={{
                          padding: "0.4rem",
                          border: "none",
                          borderRadius: "4px",
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                          cursor: "pointer",
                        }}
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day Plans List - Only shown when event is selected */}
        {selectedEvent && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2
                style={{
                  fontFamily:
                    '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                  fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                  fontWeight: "600",
                  color: "#181818",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: 0,
                }}
              >
                <Calendar size={20} />
                Tagespläne ({selectedEvent.dayPlans.length})
              </h2>
              <button
                onClick={() => setShowDayPlanForm(true)}
                style={{
                  padding: "0.625rem 1rem",
                  border: "2px solid #181818",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  backgroundColor: "#d9fdd2",
                  color: "#181818",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                  boxShadow: "2px 4px 0 #181818",
                }}
              >
                <Plus size={16} />
                Neu
              </button>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fef3c7",
                border: "2px solid #fbbf24",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily:
                    '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#181818",
                  marginBottom: "0.25rem",
                }}
              >
                {selectedEvent.name}
              </div>
              <div
                style={{
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  fontSize: "0.85rem",
                  color: "#64748b",
                }}
              >
                Ausgewählte Veranstaltung
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {selectedEvent.dayPlans.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    border: "2px dashed #d1d5db",
                    borderRadius: "8px",
                    color: "#9ca3af",
                    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  }}
                >
                  Noch keine Tagespläne. Klicke auf "Neu" um einen zu erstellen!
                </div>
              ) : (
                selectedEvent.dayPlans
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((dayPlan) => (
                    <div
                      key={dayPlan.id}
                      style={{
                        padding: "1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontFamily:
                                '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                              fontWeight: "600",
                              color: "#181818",
                              marginBottom: "0.25rem",
                              margin: 0,
                            }}
                          >
                            {dayPlan.name}
                          </h3>
                          <p
                            style={{
                              fontFamily:
                                '"Inter", "Roboto", Arial, sans-serif',
                              fontSize: "0.85rem",
                              color: "#64748b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {new Date(dayPlan.date).toLocaleDateString(
                              "de-DE",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <div
                            style={{
                              fontFamily:
                                '"Inter", "Roboto", Arial, sans-serif',
                              fontSize: "0.8rem",
                              color: "#9ca3af",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Calendar size={12} />
                            {dayPlan.schedule.length} Termin
                            {dayPlan.schedule.length !== 1 ? "e" : ""}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => setManagingSchedule(dayPlan)}
                            style={{
                              padding: "0.4rem",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: "#fef3c7",
                              color: "#f59e0b",
                              cursor: "pointer",
                            }}
                            title="Termine verwalten"
                          >
                            <Clock size={14} />
                          </button>
                          <button
                            onClick={() => {
                              // Navigate to planner view with the day plan
                              navigate(
                                `/planner?dayPlanId=${dayPlan.id}&org=${orgId}`
                              );
                            }}
                            style={{
                              padding: "0.4rem",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: "#f0fdf4",
                              color: "#16a34a",
                              cursor: "pointer",
                            }}
                            title="Vorschau"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDayPlan(dayPlan);
                              setShowDayPlanForm(true);
                            }}
                            style={{
                              padding: "0.4rem",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: "#e0f2fe",
                              color: "#0284c7",
                              cursor: "pointer",
                            }}
                            title="Bearbeiten"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteDayPlan(dayPlan.id)}
                            style={{
                              padding: "0.4rem",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              cursor: "pointer",
                            }}
                            title="Löschen"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;