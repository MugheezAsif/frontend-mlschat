import React from 'react';
import StatCard from './StatCard';

const ProfileStats = () => (
  <div className="stats py-4">
    <div className="row">
      <div className="col-lg-3 col-md-4"><StatCard title="Active Listings" value="24" /></div>
      <div className="col-lg-3 col-md-4"><StatCard title="Sold Listings" value="154" /></div>
      <div className="col-lg-3 col-md-4"><StatCard title="Total Value" value="$724M" /></div>
      <div className="col-lg-3 col-md-4"><StatCard title="Years in Business" value="12" /></div>
    </div>
  </div>
);

export default ProfileStats;
