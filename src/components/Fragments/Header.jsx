import styled from "styled-components";
import { useEffect, useState } from "react";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import {
  selectUserName,
  selectUserPhoto,
  setSignOutState,
  setUserLoginDetails,
} from "../../features/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userName]);

  const handleAuth = async () => {
    if (!userName) {
      try {
        await signInWithPopup(auth, provider).then((result) => {
          setUser(result.user);
          console.log(result.user);
          navigate("/home");
        });
      } catch (err) {
        console.error(err);
      }
    } else if (userName) {
      try {
        await signOut(auth).then(() => {
          dispatch(setSignOutState());
          navigate("/");
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      })
    );
  };

  return (
    <Container className={scrolled ? "scrolled" : ""}>
      <Logo>
        <img src="/images/virtuo.png" alt="virtuo" />
      </Logo>
      {!userName ? (
        <>
          <Login onClick={handleAuth}>SIGN IN</Login>
        </>
      ) : (
        <>
          <NavMenu>
            <Link to="/home">
              <img src="/images/home-icon.svg" alt="home" />
              <span>HOME</span>
            </Link>
            <Link to="/tracked">
              <img src="/images/original-icon.svg" alt="watchlist" />
              <span>TRACKED</span>
            </Link>
            <Link to="/watchlist">
              <img src="/images/iswatchlist.png" alt="watchlist" />
              <span>WATCHLIST</span>
            </Link>
          </NavMenu>
          <SignOut>
            <SearchComponent />
            <UserImg onClick={handleDropdown} src={userPhoto} alt={userName} />
            {dropdown && (
              <DropDown>
                <Link to="/profile" className="profile">
                  <img src="/images/group-icon.png" alt="watchlist" />
                  <p>PROFILE</p>
                </Link>
                <Link to="/tracked" className="menu">
                  <img src="/images/original-icon.svg" alt="tracked" />
                  <p>TRACKED</p>
                </Link>
                <Link to="/watchlist" className="menu">
                  <img src="/images/iswatchlist.png" alt="watchlist" />
                  <p>WATCHLIST</p>
                </Link>
                <span className="logout" onClick={handleAuth}>
                  LOGOUT
                </span>
              </DropDown>
            )}
          </SignOut>
        </>
      )}
    </Container>
  );
};

const Container = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 48px;
  z-index: 3;
  transition: background-color 0.15s ease-in-out;

  @media (max-width: 768px) {
    padding: 0 24px;
  }

  &.scrolled {
    background-color: rgba(4, 7, 20, 0.97);
    backdrop-filter: blur(10px);
  }
`;
const Logo = styled.a`
  padding: 0;
  width: 64px;
  font-size: 0;
  display: inline-block;
  img {
    display: block;
    width: 100%;
  }
`;
const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  a {
    display: flex;
    align-items: center;
    margin: 0 12px;
    gap: 5px;

    img {
      margin-bottom: 3px;
      height: 20px;
      min-width: 20px;
      width: 20px;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 14px;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;

      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: "";
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }

    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
    @media (max-width: 768px) {
      display: none;
    }
  }
`;
const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;
const UserImg = styled.img`
  border-radius: 10%;
  width: 80%;
  height: 80%;
`;
const DropDown = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 60px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;
  width: 125px;

  .profile {
    padding: 3px;
    background-color: #040714;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    gap: 5px;
    @media (min-width: 1024px) {
      justify-content: center;
    }
    img {
      width: 20%;
      height: 20%;
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }
  .menu {
    padding: 3px;
    background-color: #040714;
    display: flex;
    align-items: center;
    gap: 5px;

    @media (min-width: 1024px) {
      display: none;
    }

    img {
      width: 20%;
      margin-bottom: 5px;
    }
  }
  .logout {
    padding: 10px;
    background-color: maroon;
    border-radius: 0 0 10px 10px;
  }
`;
const SignOut = styled.div`
  height: 48px;
  width: 48px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: flex-end;
`;

export default Header;
