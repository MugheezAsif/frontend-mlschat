import React, { useState, useEffect } from 'react';
import UserPost from './UserPost';
import ShowPostModal from './modal/ShowPostModal';

const ProfilePosts = ({ posts = [], openedPostId, onCloseModal }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    if (openedPostId && posts.length > 0) {
      const postToOpen = posts.find((p) => p.id.toString() === openedPostId);
      if (postToOpen) {
        setSelectedPost(postToOpen);
        setShowPostModal(true);
      }
    }
  }, [openedPostId, posts]);

  return (
    <>
      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post) => {
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

      {showPostModal && selectedPost && (
        <ShowPostModal
          postId={selectedPost.id}
          open={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
            onCloseModal(); // this updates the URL
          }}
          post={selectedPost}
        />
      )}
    </>
  );
};

export default ProfilePosts;
