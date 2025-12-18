import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Logo from "../assets/logos/logo.svg";
import "../styles/dashboard.css";
import "../styles/profile.css";

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

  // Fetch profile
  const { data, loading, error } = useQuery<any>(GET_USER_PROFILE, {
    variables: { id: userId || "" },
    skip: !userId,
  });

  // Fetch header data

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
        <Link to="/dashboard" className="nav-brand" style={{ gap: "6px" }}>
          <img src={Logo} alt="AltShift Logo" width={32} height={32} />
          <span style={{ fontSize: "18px" }}>AltShift</span>
        </Link>
        <div className="nav-actions">
          <Link to="/dashboard" className="btn nav-back-link">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar - Settings Navigation */}
        <aside className="dashboard-sidebar">
          <h3>Account Settings</h3>
          <div className="documents-list">
            {" "}
            {/* Reusing doc list styles for sidebar items */}
            <button
              className={`doc-item profile-nav-btn ${
                activeSection === "personal" ? "active" : ""
              }`}
              onClick={() => setActiveSection("personal")}
            >
              Personal Information
            </button>
            <button
              className={`doc-item profile-nav-btn ${
                activeSection === "security" ? "active" : ""
              }`}
              onClick={() => setActiveSection("security")}
            >
              Security
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content profile-main-content">
          {" "}
          {/* Limit width for readability */}
          {activeSection === "personal" && (
            <section>
              <div className="home-header-row profile-header-row">
                <div>
                  <h2 className="home-title">Personal Information</h2>
                  <p className="profile-header-desc">
                    Manage your personal details and contact info.
                  </p>
                </div>
              </div>

              <div className="profile-card">
                <form onSubmit={handleProfileSubmit}>
                  <div className="profile-grid-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="input-field"
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
                        className="input-field"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-grid-row">
                    <div className="form-group">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="input-field"
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
                        className="input-field"
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

                  <div className="profile-grid-row mb-large">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="input-field"
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
                        className="input-field profile-input-disabled"
                        value={data?.getUserByID?.email || ""}
                        disabled
                      />
                      <small className="profile-input-hint">
                        Email cannot be changed directly.
                      </small>
                    </div>
                  </div>

                  {profileMessage && (
                    <div
                      className={`profile-message ${
                        profileMessage.type === "error" ? "error" : "success"
                      }`}
                    >
                      {profileMessage.text}
                    </div>
                  )}

                  <div className="profile-actions">
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
              <div className="home-header-row profile-header-row">
                <div>
                  <h2 className="home-title">Security</h2>
                  <p className="profile-header-desc">
                    Update your password and security settings.
                  </p>
                </div>
              </div>

              <div className="profile-card">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="input-field"
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

                  <div className="profile-divider"></div>

                  <div className="profile-grid-row mb-large">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="input-field"
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
                        className="input-field"
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
                      className={`profile-message ${
                        passwordMessage.type === "error" ? "error" : "success"
                      }`}
                    >
                      {passwordMessage.text}
                    </div>
                  )}

                  <div className="profile-actions">
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
