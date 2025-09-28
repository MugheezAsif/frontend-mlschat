import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchPendingGroupPosts } from '../../store/slices/groupsSlice';
import UserPost from '../UserPost'; // path may vary
import ShowPostModal from '../modal/ShowPostModal'; // path may vary

const PendingPosts = ({ slug }) => {
  const dispatch = useDispatch();
  const { pendingPosts, pendingPostsLoading, error } = useSelector((s) => s.groups);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Get post ID from URL
  const postIdFromUrl = searchParams.get('post');

  useEffect(() => {
    if (slug) dispatch(fetchPendingGroupPosts(slug));
  }, [dispatch, slug]);

  // Handle opening post from URL
  useEffect(() => {
    if (postIdFromUrl && pendingPosts.length > 0) {
      const postToOpen = pendingPosts.find((p) => p.id.toString() === postIdFromUrl);
      if (postToOpen) {
        setSelectedPost(postToOpen);
        setShowPostModal(true);
      } else {
        // Post not found, remove from URL
        searchParams.delete('post');
        setSearchParams(searchParams);
      }
    }
  }, [postIdFromUrl, pendingPosts, searchParams, setSearchParams]);

  if (pendingPostsLoading) return <p className="text-center py-5">Loading pending posts...</p>;
  if (pendingPosts.length === 0) return <p className="text-center py-5">No pending posts found.</p>;

  return (
    <>
      {pendingPosts.map((post) => {
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
            groupSlug={slug}
            page="post_approval"
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

export default PendingPosts;
