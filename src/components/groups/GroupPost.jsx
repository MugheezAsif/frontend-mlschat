import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MindSection from '../MindSection';
import { fetchGroupPosts } from '../../store/slices/postSlice';
import UserPost from '../UserPost';
import ShowPostModal from '../modal/ShowPostModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const GroupPost = ({ slug: slugProp, group }) => {
  const user = useSelector((state) => state.auth.user);
  const { slug: slugFromUrl } = useParams();
  const slug = slugProp || slugFromUrl;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const posts = useSelector((s) => s.posts.groupPosts);
  const loading = useSelector((s) => s.posts.loading);
  const error = useSelector((s) => s.posts.error);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const isAdmin = !!(user && group && user.id === group?.user_id);
  const canPost = group?.settings?.allow_posting !== false || isAdmin;

  // Get post ID from URL
  const postIdFromUrl = searchParams.get('post');

  useEffect(() => {
    if (slug) dispatch(fetchGroupPosts(slug));
  }, [dispatch, slug]);

  // Handle opening post from URL
  useEffect(() => {
    if (postIdFromUrl && posts.length > 0) {
      const postToOpen = posts.find((p) => p.id.toString() === postIdFromUrl);
      if (postToOpen) {
        setSelectedPost(postToOpen);
        setShowPostModal(true);
      } else {
        // Post not found, remove from URL
        searchParams.delete('post');
        setSearchParams(searchParams);
      }
    }
  }, [postIdFromUrl, posts, searchParams, setSearchParams]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load group posts.');
      setTimeout(() => {
        if (location?.state?.from) {
          navigate(location.state.from);
        } else {
          navigate(-1);
        }
      }, 200);
    }
  }, [error, navigate, location]);

  if (loading || error) return null;

  return (
    <>
      {/* <MindSection user={user} slug={slug} page="group" group={group} /> */}
      {canPost ? (
        <MindSection user={user} slug={slug} page="group" group={group} />
      ) : (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body d-flex align-items-start">
            <div className="me-3">
              <span className="badge bg-secondary p-3 rounded-circle">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
            <div>
              <h6 className="mb-1">Only admins can post</h6>
              <div className="text-muted small">
                Posting is disabled by the group settings. Contact the group admin if you think this is a mistake.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {posts?.map((post) => {
          let images = [];
          try {
            images = typeof post.media_urls === 'string'
              ? JSON.parse(post.media_urls)
              : post.media_urls || [];
          } catch {
            images = [];
          }

          const postData = {
            ...post,
            media_urls: images,
          };

          return (
            <UserPost
              key={post.id}
              post={postData}
              onClick={() => {
                setSelectedPost(postData);
                setShowPostModal(true);
                const newParams = new URLSearchParams(window.location.search);
                newParams.set('post', postData.id);
                window.history.replaceState(null, '', `${window.location.pathname}?${newParams}`);
              }}
            />
          );
        })}
      </div>

      {showPostModal && selectedPost && (
        <ShowPostModal
          postId={selectedPost.id}
          open={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
            // Remove post parameter from URL
            const newParams = new URLSearchParams(window.location.search);
            newParams.delete('post');
            window.history.replaceState(null, '', `${window.location.pathname}?${newParams}`);
          }}
          post={selectedPost}
        />
      )}
    </>
  );
};

export default GroupPost;
