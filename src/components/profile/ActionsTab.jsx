import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./actionsTab.css";
import { apiFetch } from '../../lib/apiClient';  

const ActionsTab = ({ onSelect }) => {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch(
          `${APP_BASE_URL}/api/group/user/pending-invites`,
          {
            method: "GET",
          }
        );

        if (data.success) {
          setPendingInvites(data.data || []);
        } else {
          throw new Error(data.message || "Failed to fetch pending invites");
        }
      } catch (err) {
        console.error("Error fetching pending invites:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPendingInvites();
    }
  }, [user]);

  const handleInviteAction = async (inviteId, action, group) => {
    try {
      setActionLoading((prev) => ({ ...prev, [inviteId]: true }));

      const endpoint =
        action === "accept"
          ? `${APP_BASE_URL}/api/group/${group.slug}/accept-invite`
          : `${APP_BASE_URL}/api/group/${group.slug}/decline-invite`;

      const data = await apiFetch(endpoint, {
        method: "POST",
      });

      if (data.success) {
        setPendingInvites((prev) => prev.filter((invite) => invite.id !== inviteId));

        onSelect?.(inviteId, action);
      } else {
        throw new Error(data.message || `Failed to ${action} invite`);
      }
    } catch (err) {
      console.error(`Error ${action}ing invite:`, err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  return (
    <div className="actions-tab">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0">Pending Group Invites</h5>
          <small className="text-muted">
            {`${pendingInvites.length} pending invite${
              pendingInvites.length !== 1 ? "s" : ""
            }`}
          </small>
        </div>
      </div>

   

      {!loading && !error && pendingInvites.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-users fa-3x text-muted"></i>
          </div>
          <h6 className="text-muted">No Pending Invites</h6>
          <p className="text-muted small mb-0">
            You don't have any pending group invitations at the moment.
          </p>
        </div>
      )}

      {/* Invite Cards */}
      {!loading && !error && pendingInvites.length > 0 && (
        <div className="row g-3">
          {pendingInvites.map((invite) => (
            <div key={invite.id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 soft-shadow hover-up">
                {/* Group Cover Image */}
                <div className="ratio ratio-16x9 card-img-top overflow-hidden rounded-top">
                  <img
                    src={
                      invite.group.cover_url ||
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={invite.group.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  {/* Group Visibility Badge */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span
                      className={`badge ${
                        invite.group.visibility === "private"
                          ? "bg-danger"
                          : invite.group.visibility === "invite_only"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    >
                      {invite.group.visibility.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <h6
                      className="fw-semibold mb-1 text-truncate"
                      title={invite.group.name}
                    >
                      {invite.group.name}
                    </h6>
                    <p
                      className="text-muted small mb-2 text-truncate"
                      title={invite.group.description}
                    >
                      {invite.group.description}
                    </p>

                    {/* Group Owner Info */}
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={
                          invite.group.owner.avatar_url ||
                          "https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop"
                        }
                        alt={invite.group.owner.name}
                        className="rounded-circle me-2"
                        style={{
                          width: "24px",
                          height: "24px",
                          objectFit: "cover",
                        }}
                      />
                      <small className="text-muted">
                        Invited by <strong>{invite.group.owner.name}</strong>
                      </small>
                    </div>

                    {/* Group Details */}
                    <div className="small text-muted">
                      <div>📍 {invite.group.location}</div>
                      <div>🏷️ {invite.group.category.replace("_", " ")}</div>
                      <div>📅 {new Date(invite.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success w-50"
                      onClick={() =>
                        handleInviteAction(invite.id, "accept", invite.group)
                      }
                      disabled={actionLoading[invite.id]}
                    >
                      {actionLoading[invite.id] ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Accepting...
                        </>
                      ) : (
                        "Accept"
                      )}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger w-50"
                      onClick={() =>
                        handleInviteAction(invite.id, "decline", invite.group)
                      }
                      disabled={actionLoading[invite.id]}
                    >
                      {actionLoading[invite.id] ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Declining...
                        </>
                      ) : (
                        "Decline"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionsTab;

