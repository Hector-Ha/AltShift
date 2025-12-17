import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Logo from "../components/Logo";
import "../styles/dashboard.css";
// We might keep profile.css for specific tweaks if needed, but aim to use dashboard styles
// import "../styles/profile.css";

const GET_USER_PROFILE = gql(`
  query GetUserProfile($id: ID!) {
    getUserByID(id: $id) {
      id
      email
      personalInformation {
        firstName
        lastName
        jobTitle
        organization
        DOB
      }
      profilePicture
    }
  }
`);

const UPDATE_USER = gql(`
  mutation UpdateUser($userID: ID!, $input: updateUserInput!) {
    updateUser(userID: $userID, input: $input) {
      id
      personalInformation {
        firstName
        lastName
        jobTitle
        organization
        DOB
      }
    }
  }
`);

const CHANGE_PASSWORD = gql(`
  mutation ChangePassword($userID: ID!, $input: changePasswordInput!) {
    changePassword(userID: $userID, input: $input)
  }
`);

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [activeSection, setActiveSection] = useState<"personal" | "security">(
    "personal"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    organization: "",
    DOB: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch standard profile data
  const { data, loading, error } = useQuery<any>(GET_USER_PROFILE, {
    variables: { id: userId || "" },
    skip: !userId,
  });

  // Fetch header data (avatar etc) separately or reuse cached if smart enough,
  // but to be safe and consistent with Dashboard we fetch what we need.

  useEffect(() => {
    if (data?.getUserByID?.personalInformation) {
      const info = data.getUserByID.personalInformation;
      setFormData({
        firstName: info.firstName || "",
        lastName: info.lastName || "",
        jobTitle: info.jobTitle || "",
        organization: info.organization || "",
        DOB: info.DOB ? new Date(info.DOB).toISOString().split("T")[0] : "",
      });
    }
  }, [data]);

  const [updateUser, { loading: updating }] = useMutation<any>(UPDATE_USER, {
    onCompleted: () => {
      setProfileMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
      setTimeout(() => setProfileMessage(null), 3000);
    },
    onError: (err) => {
      setProfileMessage({ type: "error", text: err.message });
    },
  });

  const [changePassword, { loading: changingPassword }] = useMutation<any>(
    CHANGE_PASSWORD,
    {
      onCompleted: () => {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully.",
        });
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordMessage(null), 3000);
      },
      onError: (err) => {
        setPasswordMessage({ type: "error", text: err.message });
      },
    }
  );

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    updateUser({
      variables: {
        userID: userId,
        input: {
          personalInformation: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            jobTitle: formData.jobTitle,
            organization: formData.organization,
            DOB: formData.DOB ? new Date(formData.DOB) : null,
          },
        },
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    changePassword({
      variables: {
        userID: userId,
        input: {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
      },
    });
  };

  if (loading)
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content">Error: {error.message}</div>
      </div>
    );

  return (
    <div className="dashboard-layout">
      {/* Navbar copied from Dashboard for consistency */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Logo />
          <span>AltShift</span>
        </div>
        <div className="nav-actions">
          <Link
            to="/dashboard"
            className="btn"
            style={{
              textDecoration: "none",
              color: "#64748b",
              marginRight: "1rem",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar - Settings Navigation */}
        <aside className="dashboard-sidebar">
          <div className="section-title">Account Settings</div>
          <div className="documents-list">
            {" "}
            {/* Reusing doc list styles for sidebar items */}
            <button
              className={`doc-item ${
                activeSection === "personal" ? "active" : ""
              }`}
              onClick={() => setActiveSection("personal")}
              style={{
                border: "none",
                background:
                  activeSection === "personal" ? "#e0e7ff" : "transparent",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Personal Information
            </button>
            <button
              className={`doc-item ${
                activeSection === "security" ? "active" : ""
              }`}
              onClick={() => setActiveSection("security")}
              style={{
                border: "none",
                background:
                  activeSection === "security" ? "#e0e7ff" : "transparent",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Security
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: "800px" }}>
          {" "}
          {/* Limit width for readability */}
          {activeSection === "personal" && (
            <section>
              <div className="home-header-row" style={{ marginBottom: "1rem" }}>
                <div>
                  <h2 className="home-title">Personal Information</h2>
                  <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                    Manage your personal details and contact info.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <form onSubmit={handleProfileSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Organization</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.DOB}
                        onChange={(e) =>
                          setFormData({ ...formData, DOB: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={data?.getUserByID?.email || ""}
                        disabled
                        style={{
                          backgroundColor: "#f1f5f9",
                          cursor: "not-allowed",
                          color: "#64748b",
                        }}
                      />
                      <small
                        style={{
                          color: "#94a3b8",
                          marginTop: "4px",
                          display: "block",
                          fontSize: "0.75rem",
                        }}
                      >
                        Email cannot be changed directly.
                      </small>
                    </div>
                  </div>

                  {profileMessage && (
                    <div
                      style={{
                        padding: "0.75rem",
                        borderRadius: "6px",
                        marginBottom: "1rem",
                        backgroundColor:
                          profileMessage.type === "error"
                            ? "#fef2f2"
                            : "#f0fdf4",
                        color:
                          profileMessage.type === "error"
                            ? "#ef4444"
                            : "#10b981",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {profileMessage.text}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
          {activeSection === "security" && (
            <section>
              <div className="home-header-row" style={{ marginBottom: "1rem" }}>
                <div>
                  <h2 className="home-title">Security</h2>
                  <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                    Update your password and security settings.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      margin: "1.5rem 0",
                    }}
                  ></div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {passwordMessage && (
                    <div
                      style={{
                        padding: "0.75rem",
                        borderRadius: "6px",
                        marginBottom: "1rem",
                        backgroundColor:
                          passwordMessage.type === "error"
                            ? "#fef2f2"
                            : "#f0fdf4",
                        color:
                          passwordMessage.type === "error"
                            ? "#ef4444"
                            : "#10b981",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {passwordMessage.text}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={changingPassword}
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
