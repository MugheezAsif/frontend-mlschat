import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGroupMembers, approveGroupMember } from '../../store/slices/groupsSlice';

function Requests({ groupSlug }) {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const members = useSelector((state) => state.groups.members);
  const loading = useSelector((state) => state.groups.membersLoading);
  const pendingRequests = members.filter((m) => m.status === 'pending');

  const filteredRequests = pendingRequests.filter((r) =>
    r.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (groupSlug) {
      dispatch(fetchGroupMembers(groupSlug));
    }
  }, [dispatch, groupSlug]);

  const handleApprove = (userId) => {
    dispatch(approveGroupMember({ groupSlug, userId }));
  };

  if (loading) return null;

  return (
    <div className="card-basic">
      <h5 className="mb-3">Pending Join Requests</h5>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredRequests.length === 0 && (
        <div className="text-muted">No matching requests.</div>
      )}

      {filteredRequests.map((request) => (
        <div key={request.id} className="d-flex align-items-center mb-3">
          <img
            src={request.user.avatar_url}
            alt={request.user.name}
            className="rounded-circle me-3"
            style={{ width: 48, height: 48, objectFit: 'cover' }}
          />
          <div className="flex-grow-1">
            <div className="fw-bold">{request.user.name}</div>
            <div className="text-muted small">{request.user.location}</div>
          </div>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleApprove(request.user_id)}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default Requests;
