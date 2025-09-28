import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupMembers, removeGroupMember } from '../../store/slices/groupsSlice';
import { useParams, useNavigate } from 'react-router-dom';

function Members({ groupSlug }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    const members = useSelector((state) => state.groups.members);
    const loading = useSelector((state) => state.groups.membersLoading);

    const acceptedMembers = members.filter((m) => m.status === 'accepted');

    const filteredMembers = acceptedMembers.filter((member) =>
        member.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (groupSlug) {
            dispatch(fetchGroupMembers(groupSlug));
        }
    }, [dispatch, groupSlug]);

    const handleViewProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    const handleRemove = (userId) => {
        dispatch(removeGroupMember({ groupSlug, userId }));
    };

   if (loading) return null;


    return (
        <div className="card-basic">
            <h5 className="mb-3">Group Members</h5>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredMembers.length === 0 && (
                <div className="text-muted">No matching members.</div>
            )}

            {filteredMembers.map((member) => (
                <div key={member.id} className="d-flex align-items-center mb-3">
                    <img
                        src={member.user.avatar_url}
                        alt={member.user.name}
                        className="rounded-circle me-3"
                        style={{ width: 48, height: 48, objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                        <div className="fw-bold">{member.user.name}</div>
                        <div className="text-muted small">{member.user.location}</div>
                    </div>
                    <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleViewProfile(member.user.id)}
                    >
                        View Profile
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(member.user.id)}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Members;
