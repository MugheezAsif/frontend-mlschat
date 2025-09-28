import React from 'react';

const GroupInfo = ({ group }) => {
  if (!group) return null;

  const posts  = group.posts_count ?? '—';
  const members = group.members_count ?? '—';
  const active  = group.active_count ?? '—';

  return (
    <div>
      <div className="card-basic">
        <div className="group-stats text-center d-flex align-items-center justify-content-center">
          <div className="stat w-100">
            <h6 className="mb-1"><strong>{posts}</strong></h6>
            <p className="mb-0">Posts</p>
          </div>
          <div className="stat w-100 border-start border-end">
            <h6 className="mb-1"><strong>{members}</strong></h6>
            <p className="mb-0">Members</p>
          </div>
          <div className="stat w-100">
            <h6 className="mb-1"><strong>{active}</strong></h6>
            <p className="mb-0">Active</p>
          </div>
        </div>
      </div>

      <div className="card-basic">
        <div className="group-info">
          <h6 className="text-black"><strong>About this group</strong></h6>
          <p>{group.description}</p>

          {group.location && (
            <div className="d-flex align-items-center gap-3 mb-2">
              <i className="fa-solid fa-location-dot text-black" />
              <p className="m-0">{group.location}</p>
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mb-2">
            <i className="fa-regular fa-calendar text-black" />
            <p className="m-0">Created {new Date(group.created_at).toLocaleDateString()}</p>
          </div>

          <div className="d-flex align-items-center gap-3 mb-2">
            <i className="fa-solid fa-user-shield text-black" />
            <p className="m-0">Moderated by {group.admin_count ?? '—'} admins</p>
          </div>
        </div>
      </div>

      <div className="card-basic">
        <div className="group-contributors">
          <h4 className="text-black"><strong>Top Contributors</strong></h4>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
