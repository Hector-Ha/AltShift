import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "../gql";
import { formatDistanceToNow } from "date-fns";
import "../styles/dashboard.css";
import { socket } from "../socket/socket";
import type {
  MyNotificationsQuery,
  MyNotificationsQueryVariables,
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables,
} from "../gql/graphql";

const GET_MY_NOTIFICATIONS = gql(`
  query MyNotifications($filter: NotificationFilter) {
    myNotifications(filter: $filter) {
      id
      message
      read
      createdAt
      type
      document {
        id
        title
      }
      sender {
        id
        email
        personalInformation {
          firstName
          lastName
        }
      }
    }
  }
`);

const MARK_AS_READ = gql(`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      read
    }
  }
`);

const NotificationList: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [showFilter, setShowFilter] = useState(false);

  const { data, loading, error, refetch } = useQuery<
    MyNotificationsQuery,
    MyNotificationsQueryVariables
  >(GET_MY_NOTIFICATIONS, {
    fetchPolicy: "network-only",
  });

  const [markAsRead] = useMutation<
    MarkNotificationAsReadMutation,
    MarkNotificationAsReadMutationVariables
  >(MARK_AS_READ);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onNewNotification = (notification: any) => {
      console.log("Real-time notification received", notification);
      refetch();
    };

    const onDocActivity = (activity: any) => {
      console.log("Activity received", activity);
      // Add to active sessions, avoid duplicates
      setActiveSessions((prev) => {
        const exists = prev.find(
          (s) =>
            s.user.id === activity.user.id &&
            s.documentId === activity.documentId
        );
        if (exists) return prev;
        return [...prev, activity];
      });

      // Remove after 10 seconds of silence? Or wait for "stop"?
      // For now, let's just show it. Ideally we handle "leave" too.
      // But for "Show them are working", this is a start.
      // Since we don't emit "stop" except on disconnect...
      setTimeout(() => {
        setActiveSessions((prev) => prev.filter((s) => s !== activity));
      }, 30000); // Clear after 30s as a fallback
    };

    socket.on("new-notification", onNewNotification);
    socket.on("doc-activity", onDocActivity);

    return () => {
      socket.off("new-notification", onNewNotification);
      socket.off("doc-activity", onDocActivity);
    };
  }, [refetch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({ variables: { notificationId: id } });
      refetch();
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error loading notifications</div>;

  const notifications = data?.myNotifications || [];

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div className="notification-list">
      <div className="section-header">
        <h3 className="section-title">New Updates</h3>
        <div className="filter-dropdown-container">
          <button
            className="filter-btn"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
          {showFilter && (
            <div className="filter-menu">
              <div
                className={`filter-item ${filter === "all" ? "active" : ""}`}
                onClick={() => {
                  setFilter("all");
                  setShowFilter(false);
                }}
              >
                All
              </div>
              <div
                className={`filter-item ${filter === "unread" ? "active" : ""}`}
                onClick={() => {
                  setFilter("unread");
                  setShowFilter(false);
                }}
              >
                Unread
              </div>
              <div
                className={`filter-item ${filter === "read" ? "active" : ""}`}
                onClick={() => {
                  setFilter("read");
                  setShowFilter(false);
                }}
              >
                Read
              </div>
            </div>
          )}
        </div>
      </div>

      {activeSessions.length > 0 && (
        <div className="active-sessions">
          <h4>Active Now</h4>
          <ul>
            {activeSessions.map((session, i) => (
              <li key={i} className="active-item">
                <span className="active-user">
                  {session.user.firstName || session.user.email}
                </span>
                <span className="active-action"> is viewing </span>
                <span className="active-doc">{session.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {filteredNotifications.length === 0 ? (
        <p className="no-notifications">
          No {filter !== "all" ? filter : "new"} updates found.
        </p>
      ) : (
        <ul className="notification-items">
          {filteredNotifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? "read" : "unread"}`}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
            >
              <div className="notif-header">
                <span className="notif-sender">
                  {notif.sender.personalInformation.firstName ||
                    notif.sender.email}
                </span>
                <span className="notif-time">
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="notif-message">{notif.message}</p>
              {!notif.read && <span className="unread-dot">●</span>}
            </li>
          ))}
        </ul>
      )}

      {/* Basic Inline Styles for quick iteration, move to CSS later */}
      <style>{`
        .active-sessions {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border-radius: 6px;
        }
        .active-sessions h4 {
            margin: 0 0 0.5rem 0;
            font-size: 0.85rem;
            color: #065f46;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .active-sessions ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .active-item {
            font-size: 0.9rem;
            color: #064e3b;
            margin-bottom: 0.25rem;
        }
        .active-user { font-weight: bold; }
        .active-doc { font-style: italic; }

        .notification-list {
          margin-top: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        /* ... rest of styles ... */
        .notification-items {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        .notification-item {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .notification-item:hover {
          background: #f0f0f0;
        }
        .notification-item.unread {
          background: #eef2ff;
        }
        .notif-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        .notif-sender {
          font-weight: 600;
          color: #374151;
        }
        .notif-message {
          margin: 0;
          font-size: 0.95rem;
          color: #111827;
        }
        .unread-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #2563eb;
          font-size: 0.8rem;
        }
        .no-notifications {
           color: #6b7280;
           text-align: center;
           font-style: italic;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .section-title {
          margin: 0; 
          /* Inherit or keep previous margins if they were set globally, user said maintain design */
        }
        .filter-dropdown-container {
          position: relative;
        }
        .filter-btn {
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        .filter-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 120px;
          z-index: 10;
          overflow: hidden;
        }
        .filter-item {
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .filter-item:hover {
          background: #f9fafb;
        }
        .filter-item.active {
          background: #f3f4f6;
          font-weight: 500;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default NotificationList;
