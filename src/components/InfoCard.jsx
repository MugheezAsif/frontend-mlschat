import React from 'react';

const InfoCard = ({ title, content }) => {
  return (
    <div className="card-basic mb-4">
      <h5>{title}</h5>
      <div className="pt-2">
        {content}
      </div>
    </div>
  );
};

export default InfoCard;
