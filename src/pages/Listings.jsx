import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarTop from '../components/NavbarTop';
import NavbarMobile from '../components/NavbarMobile';
import MindSection from '../components/MindSection';
import ProfilePosts from '../components/ProfilePosts';
import SearchInputCard from '../components/SearchInputCard';
import ListingCard from '../components/ListingCard';
import { apiFetch } from '../lib/apiClient';

const Listings = () => {
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

  if (!user) return <div className="text-center py-5">Loading home...</div>;

  return (
    <div >
      <div className="main py-2 pt-0">
        <div className="container d-flex justify-content-center">
          <div className="w-100 main-cont" style={{ maxWidth: '680px' }}>
            <SearchInputCard/>
            <ListingCard/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;

