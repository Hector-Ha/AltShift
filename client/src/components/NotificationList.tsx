import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "../gql";
import { formatDistanceToNow } from "date-fns";
import { Filter } from "lucide-react";
import "../styles/dashboard.css";
import "../styles/NotificationList.css";
import Dropdown from "./Dropdown";
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

const ACCEPT_INVITE = gql(`
  mutation AcceptCollaborateInvitation($documentID: ID!, $notificationID: ID) {
    acceptCollaborateInvitation(documentID: $documentID, notificationID: $notificationID) {
      id
      title
    }
  }
`) as any;

const DECLINE_INVITE = gql(`
  mutation DeclineCollaborateInvitation($documentID: ID!, $notificationID: ID) {
    declineCollaborateInvitation(documentID: $documentID, notificationID: $notificationID)
  }
`) as any;

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

  const [acceptInvite] = useMutation(ACCEPT_INVITE, {
    refetchQueries: ["GetDocuments"], // Refetch dashboard documents
    awaitRefetchQueries: true,
  });
  const [declineInvite] = useMutation(DECLINE_INVITE);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onNewNotification = (notification: any) => {
      console.log("Real-time notification received", notification);
      refetch();
    };

    const onDocActivity = (activity: any) => {
      console.log("Activity received", activity);
      setActiveSessions((prev) => {
        const isLeft = activity.status === "left";
        const userId = activity.user.id;
        const docId = activity.documentId;

        if (isLeft) {
          return prev.filter(
            (s) => !(s.user.id === userId && s.documentId === docId)
          );
        } else {
          const exists = prev.find(
            (s) => s.user.id === userId && s.documentId === docId
          );
          if (exists) return prev;
          return [...prev, activity];
        }
      });
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

  const handleAccept = async (e: React.MouseEvent, notification: any) => {
    e.stopPropagation();
    try {
      if (!notification.document?.id) return;
      await acceptInvite({
        variables: {
          documentID: notification.document.id,
          notificationID: notification.id,
        },
      });
      refetch();
    } catch (err) {
      console.error("Error accepting invitation", err);
      // Try to mark as read if it failed (e.g. already accepted)
      await markAsRead({ variables: { notificationId: notification.id } });
      refetch();
    }
  };

  const handleDecline = async (e: React.MouseEvent, notification: any) => {
    e.stopPropagation();
    try {
      if (!notification.document?.id) return;
      await declineInvite({
        variables: {
          documentID: notification.document.id,
          notificationID: notification.id,
        },
      });
      refetch();
    } catch (err) {
      console.error("Error declining invitation", err);
      await markAsRead({ variables: { notificationId: notification.id } });
      refetch();
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

  // Group active sessions by document
  const groupedSessions = activeSessions.reduce((acc, session) => {
    const docId = session.documentId;
    if (!acc[docId]) {
      acc[docId] = {
        title: session.title,
        users: [],
      };
    }
    acc[docId].users.push(session.user);
    return acc;
  }, {} as Record<string, { title: string; users: any[] }>);

  return (
    <div className="notification-grid-container">
      {/* "New Updates" Panel (5fr) */}
      <div className="updates-panel">
        <div className="section-header">
          <h3 className="section-title">New Updates</h3>
          <div className="filter-dropdown-container">
            <Dropdown
              isOpen={showFilter}
              onOpenChange={setShowFilter}
              align="right"
              trigger={
                <button className="filter-btn">
                  Filter
                  <Filter size={16} />
                </button>
              }
            >
              <button
                className={`dropdown-item ${filter === "all" ? "active" : ""}`}
                onClick={() => {
                  setFilter("all");
                  setShowFilter(false);
                }}
              >
                All
              </button>
              <button
                className={`dropdown-item ${
                  filter === "unread" ? "active" : ""
                }`}
                onClick={() => {
                  setFilter("unread");
                  setShowFilter(false);
                }}
              >
                Unread
              </button>
              <button
                className={`dropdown-item ${filter === "read" ? "active" : ""}`}
                onClick={() => {
                  setFilter("read");
                  setShowFilter(false);
                }}
              >
                Read
              </button>
            </Dropdown>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <p className="no-notifications">
            No {filter !== "all" ? filter : "new"} updates found.
          </p>
        ) : (
          <ul className="notification-items">
            {filteredNotifications.map((notif) => (
              <li
                key={notif.id}
                className={`notification-item ${
                  notif.read ? "read" : "unread"
                }`}
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

                {/* Invitation Buttons */}
                {notif.type === "DOCUMENT_INVITE" && !notif.read && (
                  <div className="invite-actions">
                    <button
                      className="invite-btn accept-btn"
                      onClick={(e) => handleAccept(e, notif)}
                    >
                      Let's Cook
                    </button>
                    <button
                      className="invite-btn reject-btn"
                      onClick={(e) => handleDecline(e, notif)}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {!notif.read && <span className="unread-dot">●</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* "Active Now" Panel (2fr) */}
      <div className="active-panel">
        {Object.keys(groupedSessions).length > 0 ? (
          <div className="active-sessions-content">
            <h3 style={{ marginBottom: "16px" }}>Active Now</h3>
            {Object.entries(groupedSessions).map(
              ([docId, data]: [string, any]) => {
                const users = data.users;
                const userNames = users.map(
                  (u: any) => u.firstName || u.email.split("@")[0]
                );

                let message = "";
                if (userNames.length <= 3) {
                  message = userNames.join(", ");
                } else {
                  const firstThree = userNames.slice(0, 3).join(", ");
                  const count = userNames.length - 3;
                  message = `${firstThree} and ${count} other people`;
                }

                return (
                  <div key={docId} className="active-session-block">
                    <span className="active-user-names">{message}</span>
                    <span className="active-action"> is viewing </span>
                    <span className="active-doc-title">{data.title}</span>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="no-active-sessions">
            <h4>Active Now</h4>
            <p className="no-activity-msg">No one is currently active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
