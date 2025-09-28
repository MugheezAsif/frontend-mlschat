import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBed,
  faBath,
  faRuler,
  faLocationDot,
  faCalendarWeek,
  faPhone,
  faUser,
  faCar,
  faDog,
  faSnowflake,
  faFire,
} from '@fortawesome/free-solid-svg-icons';

const PropertyListingDetails = () => {
  const carouselImages = [
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div className="col-lg-8 col-md-12">
      <div className="main-listing shadow">
        <div className="top">
          <div className="listing-images">
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : undefined}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {carouselImages.map((img, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img src={img} className="d-block w-100" alt="listing" />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="listing-details py-4">
            <div className="top px-4">
              <h3 className="main-heading">1234 Maple Dr, San Francisco, CA</h3>
              <div className="features d-flex align-items-center gap-4 mt-3">
                <div className="feature"><FontAwesomeIcon icon={faBed} /> 3 beds</div>
                <div className="feature"><FontAwesomeIcon icon={faBath} /> 2 baths</div>
                <div className="feature"><FontAwesomeIcon icon={faRuler} /> 2,340 sft</div>
              </div>
              <div className="main-heading-price my-3 d-flex align-items-center gap-3">
                <h3>$1,246,000</h3>
                <span className="type-badge">For sale</span>
              </div>
              <div className="location-date gap-3 d-flex align-items-center">
                <div className="location">
                  <FontAwesomeIcon icon={faLocationDot} /> <span>San Francisco, CA</span>
                </div>
                <div className="date">
                  <FontAwesomeIcon icon={faCalendarWeek} /> <span>Listed 3 days ago</span>
                </div>
              </div>
            </div>

            <div className="middle my-4">
              <div className="agent-details p-4">
                <div className="d-block d-md-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-4">
                    <div className="agent-img">
                      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/KH1_2018.png/500px-KH1_2018.png'
                        className="img-fluid rounded-circle" alt="Agent" />
                    </div>
                    <div className="agent-info">
                      <p className="name mb-1">
                        Ryan Keller <span className="type-badge">Buyer's Agent</span>
                      </p>
                      <p className="mb-0">
                        <strong>Compas Reality</strong>
                        <span><FontAwesomeIcon icon={faPhone} className="ms-2" /> (415) 123-4567</span>
                      </p>
                    </div>
                  </div>
                  <div className="py-2 py-md-0 text-center mt-2 mt-md-0">
                    <a href="#" className="visit-profile">
                      <FontAwesomeIcon icon={faUser} className="me-2" />Visit Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom">
              <div className="px-4 listing-description">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sapien libero, volutpat nec placerat et, condimentum non massa...
                </p>
              </div>
              <div className="listing-features px-4">
                <div className="d-block d-md-flex align-items-center">
                  <div className="d-flex text-center py-3 gap-4 align-items-center">
                    <p className="m-0"><FontAwesomeIcon icon={faCar} className="me-2" />2 Garage</p>
                    <p className="m-0"><FontAwesomeIcon icon={faDog} className="me-2" />Pet friendly</p>
                  </div>
                  <div className="d-flex ms-0 ms-md-4 text-center py-3 gap-4 align-items-center">
                    <p className="m-0"><FontAwesomeIcon icon={faSnowflake} className="me-2" />Central AC</p>
                    <p className="m-0"><FontAwesomeIcon icon={faFire} className="me-2" />Fireplace</p>
                  </div>
                </div>
              </div>
              <div className="listing-dates px-4">
                <div className="container py-4">
                  <div className="row">
                    <div className="col-6"><p>MLS#</p></div>
                    <div className="col-6"><p>SF234567</p></div>
                    <div className="col-6"><p>Year Built</p></div>
                    <div className="col-6"><p>2015</p></div>
                    <div className="col-6"><p>Lot Size</p></div>
                    <div className="col-6"><p>5,200 sqft</p></div>
                    <div className="col-6"><p>HOA Fees</p></div>
                    <div className="col-6"><p>$350/mo</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingDetails;
