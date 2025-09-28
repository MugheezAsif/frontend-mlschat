import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import MindSection from '../components/MindSection';
import ProfilePosts from '../components/ProfilePosts';

import { fetchFeedPosts } from '../store/slices/postSlice';
import { useSearchParams } from 'react-router-dom';
import crmIcon from '../assets/icons/crm-icon.png';
import calendarIcon from '../assets/icons/calendar-icon.png';
import trainingIcon from '../assets/icons/training-icon.png';
import socialIcon from '../assets/icons/social-icon.png';
import digitaldocsIcon from '../assets/icons/digitaldocs-icon.png';
import aicoachIcon from '../assets/icons/aicoach-icon.png';
import savedIcon from '../assets/icons/saved-icon.png';
import friendsIcon from '../assets/icons/friends-icon.png';
import messengerIcon from '../assets/icons/messenger-icon.png';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const feedPosts = useSelector((state) => state.posts.feedPosts);
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdFromUrl = searchParams.get('post');

  useEffect(() => {
    if (user) dispatch(fetchFeedPosts());
  }, [dispatch, user]);

  return (
    <div>
      <div className="sidebar p-2 h-100 d-xl-block d-none" id="sidebar-main">
        <div className="d-flex flex-column justify-content-between h-100">
          <div className="sidebar-items">
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={user.avatar_url} className='img img-fluid rounded-circle' alt="" />
              <a href={`/user/${user.id}`}>
                <span>{user.name}</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={crmIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>Breadlist CRM</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={calendarIcon} className='img img-fluid' alt="" />
              <a href="/upcoming">
                <span>Calendar & Events</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={trainingIcon} className='img img-fluid' alt="" />
              <a href="#">
                <div class="dropdown">
                  <span data-bs-toggle="dropdown" aria-expanded="false">Training & Resources</span>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" target='_blank' href="https://www.mystatemls.com/sales-training/">Real Estate Sales Training</a></li>
                    <li><a class="dropdown-item" target='_blank' href="https://www.mystatemls.com/new-agent-training/">New Agent Training</a></li>
                  </ul>
                </div>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={socialIcon} className='img img-fluid' alt="" />
              <a href="https://www.mystatemls.com/marketing-templates/" target="_blank" rel="noopener noreferrer">
                <span>Free Social Media Post Designs</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={digitaldocsIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>Digital Docs Manager</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={aicoachIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>AI Real Estate Coach</span>
              </a>
            </div>
            <hr />
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={savedIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>Saved Items</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={friendsIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>Friends</span>
              </a>
            </div>
            <div className="item d-flex align-items-center gap-2 py-3 px-2">
              <img src={messengerIcon} className='img img-fluid' alt="" />
              <a href="https://breadlist.com" target="_blank" rel="noopener noreferrer">
                <span>Messenger</span>
              </a>
            </div>
          </div>

          <div className="bottom-side">
            <p><a href="/privacy" className="text-decoration-none text-muted">Privacy policy</a> . <a href="/terms" className="text-decoration-none text-muted">Terms of service</a> . Copyright 2025 MLSChat</p>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="container d-flex justify-content-center">
          <div className="w-100 main-cont" style={{ maxWidth: '680px' }}>
            <MindSection
              user={user}
              page={'home'}
            />
            <ProfilePosts
              posts={feedPosts}
              openedPostId={postIdFromUrl}
              onCloseModal={() => {
                searchParams.delete('post');
                setSearchParams(searchParams);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
