import React from 'react';

function Following({ followings }) {
    return (
        <>
            {followings.map((follower, index) => (
                <h1 key={index}>{follower.follower?.name || 'No Name'}</h1>
            ))}
        </>
    );
}

export default Following;
