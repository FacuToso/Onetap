import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "context/AuthContext";
import classes from "styles/custom-navbar.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { SearchBox, CustomImage } from "components";

const noNavBarSearchBoxURLs = [
  '/',
  '/media',
  '/media/search',
];

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={classes.dropdownToggle}
  >
    <div className={classes.loginCircle}>{children}</div>
  </div>
));
CustomToggle.displayName = "LoginToggle";

const CustomItem = React.forwardRef(({ children, className }, ref) => (
  <div ref={ref} className={className}>
    {children}
  </div>
));
CustomItem.displayName = "LoginItem";

const CustomNavbar = () => {
  const router = useRouter();

  const { isLoggedIn, userId, profileImageUrl, logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const handleCollapseNavbar = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleSearch = useCallback((searchText) => {
    handleCollapseNavbar();
    router.push(`/media/search?query=${searchText}`);
  }, [router, handleCollapseNavbar]);

  const handleToggleNavbarExpanded = useCallback(() => {
    setExpanded((prevState) => !prevState);
  }, []);

  return (
    <Navbar expand="xxl" fixed="top" className={classes.header} expanded={expanded}>
      <Container>
        <Link href="/" passHref onClick={handleCollapseNavbar}>
          <Navbar.Brand className={classes.brand}>
            <motion.div
              className={classes.logo}
              initial={{
                WebkitFilter: "drop-shadow(0px 0px 0px #000)",
                filter: "drop-shadow(0px 0px 0px #000)",
              }}
              whileHover={{
                scale: 1.1,
                WebkitFilter: "drop-shadow(3px 3px 20px #f00)",
                filter: "drop-shadow(3px 3px 20px #f00)",
              }}
            >
              <CustomImage
                src="/images/header/logo-landscape.webp"
                alt="Logo OneTap"
                quality={100}
                noPlaceholder
                fill
              />
            </motion.div>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={classes.toggler}
          onClick={handleToggleNavbarExpanded}
        >
          <span className={`${classes.togglerIcon} navbar-toggler-icon`}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className={classes.item}>
              <Link href="/media" passHref onClick={handleCollapseNavbar}>
                <Nav.Link className={classes.link} as="div">
                  <motion.div
                    id={classes["btn"]}
                    initial={{ background: "#1E1035", color: "#fff" }}
                    whileHover={{
                      background: "#FFF",
                      color: "#1E1035",
                      scale: 1.2,
                    }}
                  >
                    🎥 Media
                  </motion.div>
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item className={classes.item}>
              <Link href="/social" passHref onClick={handleCollapseNavbar}>
                <Nav.Link className={classes.link} as="div">
                  <motion.div
                    id={classes["btn"]}
                    initial={{ background: "#1E1035", color: "#fff" }}
                    whileHover={{
                      background: "#FFF",
                      color: "#1E1035",
                      scale: 1.2,
                    }}
                  >
                    🌐 Social
                  </motion.div>
                </Nav.Link>
              </Link>
            </Nav.Item>
            {!noNavBarSearchBoxURLs.includes(router.pathname) && (
              <SearchBox
                placeholder="Search Media"
                onSearch={handleSearch}
              />
            )}
            <Nav.Item className={classes.login}>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="profile-nav-dropdown">
                  {isLoggedIn ? (
                    <CustomImage
                      src={
                        profileImageUrl ||
                        "/images/user/user-no-profile-image.webp"
                      }
                      alt="User Logo"
                      width={46}
                      height={46}
                      quality={80}
                      className={classes.userImage}
                      noPlaceholder
                    />
                  ) : (
                    <CustomImage
                      src="/images/header/user-not-logged-in-image.webp"
                      alt="User Logo"
                      width={46}
                      height={46}
                      quality={80}
                      className={classes.userImage}
                      noPlaceholder
                    />
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className={classes.dropdown}>
                  {isLoggedIn ? (
                    <>
                      <Link href={`/social/user/${userId}`} passHref onClick={handleCollapseNavbar}>
                        <Dropdown.Item
                          className={classes.dropdownItem}
                          as="div"
                        >
                          🎭 My Social Profile
                        </Dropdown.Item>
                      </Link>
                      <Link href="/user/media" passHref onClick={handleCollapseNavbar}>
                        <Dropdown.Item
                          className={classes.dropdownItem}
                          as="div"
                        >
                          👁‍🗨 My Media
                        </Dropdown.Item>
                      </Link>
                      <Link href="/social/chat" passHref onClick={handleCollapseNavbar}>
                        <Dropdown.Item
                          className={classes.dropdownItem}
                          as="div"
                        >
                          💬 Chat
                        </Dropdown.Item>
                      </Link>
                      {/* Dropdow divider light color */}
                      <Dropdown.Divider className={classes.dropdownDivider} />
                      <Dropdown.Item as={CustomItem} className={classes.logOut}>
                        <motion.p
                          initial={{ color: "#ff0000" }}
                          whileHover={{ color: "#ff0000" }}
                          onClick={logout}
                        >
                          📛 Log out
                        </motion.p>
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Link href="/auth/login" passHref onClick={handleCollapseNavbar}>
                      <Dropdown.Item
                        className={classes.dropdownItem}
                        as="div"
                      >
                        🔑 Log In
                      </Dropdown.Item>
                    </Link>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
