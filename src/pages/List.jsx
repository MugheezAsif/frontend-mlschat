import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarTop from '../components/NavbarTop';
import NavbarMobile from '../components/NavbarMobile';
import PropertyListingDetails from '../components/PropertyListingDetails';
import { apiFetch } from '../lib/apiClient';

const List = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    apiFetch(APP_BASE_URL + '/api/feed')
      .then((data) => {
        setPosts(data.posts);
        console.log('Fetched posts:', data.posts);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [user]);

  if (!user) return <div className="text-center py-5">Loading list...</div>;

  return (
    <div >
      <div className="main py-4">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <PropertyListingDetails />

          </div>
        </div>
      </div>
    </div>
  );
};

export default List;

