import React from 'react';

const StatCard = ({ title, value }) => (
  <div className="card-basic">
    <p className="mb-1">{title}</p>
    <h5>{value}</h5>
  </div>
);

export default StatCard;
