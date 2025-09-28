const FollowRequestCard = ({ user, onAccept }) => {
  const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="col d-flex justify-content-center">
      <div className="request-card shadow-sm m-2">
        <div className="top mb-2">
          <img
            src={user.avatar_url || 'images/profile.png'}
            className="img img-fluid"
            alt="User Avatar"
          />
        </div>
        <div className="bottom p-2">
          <p className="m-0 text-black">
            <strong>{user.name}</strong>
          </p>
          <p className="m-0">{formattedDate}</p>
          <div className="actions my-2">
            <button
              className="btn-main btn-small btn-solid w-100 mb-2"
              onClick={() => onAccept(user.id)}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FollowRequestCard;

