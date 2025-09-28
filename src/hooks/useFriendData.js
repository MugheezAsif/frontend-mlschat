import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

const useFriendData = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [followers, setFollowers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFollowing, setShowFollowing] = useState(true);

  useEffect(() => {
    if (!user) return;

    apiFetch(`${APP_BASE_URL}/api/users/pending-requests`)
      .then(data => {
        console.log('Pending Requests:', data);
        setRequests(data.data);
      })
      .catch(err => console.error('Error fetching pending requests:', err));

    apiFetch(`${APP_BASE_URL}/api/users/current-followers`)
      .then(data => {
        console.log('Accepted Followers:', data);
        setFollowers(data.data);
      })
      .catch(err => console.error('Error fetching current followers:', err));
  }, [user]);

  const handleUnfollow = (followerId) => {
    apiFetch(`${APP_BASE_URL}/api/users/${followerId}/unfollow`, {
      method: 'DELETE',
    })
      .then(() => {
        setFollowers(prev => prev.filter(item => item.follower_id !== followerId));
      })
      .catch(err => console.error('Unfollow error:', err));
  };

  const handleRemoveFollower = (followerId) => {
    apiFetch(`${APP_BASE_URL}/api/users/remove-follower/${followerId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setFollowers(prev => prev.filter(f => f.follower_id !== followerId));
      })
      .catch(err => console.error('Remove follower error:', err));
  };

  const handleAccept = (followerId) => {
    apiFetch(`${APP_BASE_URL}/api/users/accept-follow/${followerId}`, {
      method: 'POST',
    })
      .then(() => {
        const acceptedUser = requests.find(req => req.follower_id === followerId);
        setRequests(prev => prev.filter(req => req.follower_id !== followerId));
        if (acceptedUser) {
          setFollowers(prev => [...prev, acceptedUser]);
        }
      })
      .catch(err => console.error('Accept error:', err));
  };

  const filteredFollowers = followers.filter(f => {
    const name = f.follower?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredRequests = requests.filter(r => {
    const name = r.follower?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return {
    user,
    searchTerm,
    setSearchTerm,
    showFollowing,
    setShowFollowing,
    filteredFollowers,
    filteredRequests,
    followers,
    requests,
    handleUnfollow,
    handleAccept,
    handleRemoveFollower
  };
};

export default useFriendData;
