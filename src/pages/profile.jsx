// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import NavbarTop from '../components/NavbarTop';
// import NavbarMobile from '../components/NavbarMobile';
// import ProfileHeader from '../components/ProfileHeader';
// import ProfileStats from '../components/ProfileStats';
// import ProfileSidebar from '../components/ProfileSidebar';
// import ProfilePosts from '../components/ProfilePosts';
// import ProfileNavigation from '../components/ProfileNavigation';


// const Profile = () => {
//   const userData = useSelector((state) => state.auth.user);
//   useEffect(() => {
//     if (userData) {
//       console.log('User data:', userData);
//     }
//   }, [userData]);

//   if (!userData) return <div className="text-center py-5">Loading profile...</div>;

//   return (
//     <div>


//       <div className="d-none d-md-block py-5"></div>

//       <div className="main py-4">
//                   <ProfileNavigation user={user} />

//         <div className="container">
//           <ProfileHeader user={userData} />
//           <ProfileStats stats={userData.stats} />
//           <div className="profile-main row">
//             <div className="col-lg-4">
//               <ProfileSidebar user={userData} />
//             </div>
//             <div className="col-lg-8">
//               <ProfilePosts posts={userData.posts} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
