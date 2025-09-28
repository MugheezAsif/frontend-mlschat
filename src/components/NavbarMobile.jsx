import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faMagnifyingGlass,
  faUserGroup,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';

const NavbarMobile = ({ avatarUrl = 'https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop' }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="navbar z-3 mobile d-block d-sm-none navbar-light bg-white border-top border-bottom">
      <div className="container d-flex justify-content-between">
        <Link className="nav-link text-center" to="/home">
          <FontAwesomeIcon icon={faHouse} />
          <span>Home</span>
        </Link>

        <Link className="nav-link text-center" to="/listings">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <span>Listings</span>
        </Link>

        <Link className="nav-link text-center" to="/friends">
          <FontAwesomeIcon icon={faUserGroup} />
          <span>Find Friends</span>
        </Link>

        <Link className="nav-link text-center position-relative" to="/messenger">
          <FontAwesomeIcon icon={faMessage} />
          <span>Messages</span>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
        </Link>

        <Link className="nav-link text-center" to={`/user/${user.id}`}>
          <img
            src={avatarUrl}
            className="rounded-circle img-fluid nav-profile"
            alt="Profile"
          />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarMobile;
