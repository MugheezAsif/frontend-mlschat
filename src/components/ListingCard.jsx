// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';

// const ListingCard = ({
//   image = 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   price = '$0',
//   title = 'Default Title',
//   address = '123 Default Street',
//   beds = 0,
//   baths = 0,
//   area = '0 sqft',
//   href = '#',
// }) => {
//   return (
//     <div>
//         <div className="listing-card shadow-sm my-3">
//         <div className="top position-relative">
//             <img src={image} className="img-fluid img-main" alt="Listing" />
//             <div className="price-cont position-absolute top-0 end-0 m-3">
//             <p className="m-0">{price}</p>
//             </div>
//         </div>
//         <div className="bottom p-3">
//             <a href={href}>
//             <p className="main-heading m-0">{title}</p>
//             <p className="address mb-1">{address}</p>
//             <div className="features d-flex align-items-center gap-3">
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBed} /> {beds} beds
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBath} /> {baths} baths
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faRuler} /> {area}
//                 </div>
//             </div>
//             </a>
//         </div>
//         </div>
//         <div className="listing-card shadow-sm my-3">
//         <div className="top position-relative">
//             <img src={image} className="img-fluid img-main" alt="Listing" />
//             <div className="price-cont position-absolute top-0 end-0 m-3">
//             <p className="m-0">{price}</p>
//             </div>
//         </div>
//         <div className="bottom p-3">
//             <a href={href}>
//             <p className="main-heading m-0">{title}</p>
//             <p className="address mb-1">{address}</p>
//             <div className="features d-flex align-items-center gap-3">
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBed} /> {beds} beds
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBath} /> {baths} baths
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faRuler} /> {area}
//                 </div>
//             </div>
//             </a>
//         </div>
//         </div>
//         <div className="listing-card shadow-sm my-3">
//         <div className="top position-relative">
//             <img src={image} className="img-fluid img-main" alt="Listing" />
//             <div className="price-cont position-absolute top-0 end-0 m-3">
//             <p className="m-0">{price}</p>
//             </div>
//         </div>
//         <div className="bottom p-3">
//             <a href={href}>
//             <p className="main-heading m-0">{title}</p>
//             <p className="address mb-1">{address}</p>
//             <div className="features d-flex align-items-center gap-3">
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBed} /> {beds} beds
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faBath} /> {baths} baths
//                 </div>
//                 <div className="feature">
//                 <FontAwesomeIcon icon={faRuler} /> {area}
//                 </div>
//             </div>
//             </a>
//         </div>
//         </div>
//     </div>

//   );
// };

// export default ListingCard;


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ListingCard = () => {
  const imageUrl =
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const listings = [
    {
      id: 1,
      price: '$1,200,000',
      title: 'Modern Villa in Beverly Hills',
      address: '123 Palm Avenue',
      beds: 3,
      baths: 2,
      area: '2,340 sqft',
      href: '/listing/1',
      imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      price: '$950,000',
      title: 'Cozy Bungalow in LA',
      address: '456 Sunset Blvd',
      beds: 2,
      baths: 1,
      area: '1,600 sqft',
      href: '/listing/2',
      imageUrl: 'https://images.unsplash.com/photo-1697299261580-876d107bf090?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    },
    {
      id: 3,
      price: '$2,750,000',
      title: 'Luxury Penthouse',
      address: '789 Ocean Drive',
      beds: 4,
      baths: 3,
      area: '3,100 sqft',
      href: '/listing/3',
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    },
  ];

  return (
    <div>
      {listings.map((listing) => (
        <div key={listing.id} className="listing-card shadow-sm my-3">
          <div className="top position-relative">
            <img src={listing.imageUrl} className="img-fluid img-main" alt="Listing" />
            <div className="price-cont position-absolute top-0 end-0 m-3">
              <p className="m-0">{listing.price}</p>
            </div>
          </div>
          <div className="bottom p-3">
            <Link to="/list" className="text-decoration-none text-dark">
              <p className="main-heading m-0">{listing.title}</p>
              <p className="address mb-1">{listing.address}</p>
              <div className="features d-flex align-items-center gap-3">
                <div className="feature">
                  <FontAwesomeIcon icon={faBed} /> {listing.beds} beds
                </div>
                <div className="feature">
                  <FontAwesomeIcon icon={faBath} /> {listing.baths} baths
                </div>
                <div className="feature">
                  <FontAwesomeIcon icon={faRuler} /> {listing.area}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingCard;
