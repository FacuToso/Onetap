import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons"
import SocialMediaLink from "./SocialMediaLink";

const MediaSocial = ({ links: { facebook, instagram, twitter } }) => {
  return (
    <div className="d-flex justify-content-around">
      {facebook && <SocialMediaLink href={facebook} icon={faFacebook} bckColor="linear-gradient(0deg, #020972 5%, #3A5795 50%)" />}
      {instagram && <SocialMediaLink href={instagram} icon={faInstagram} bckColor="linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)"/>}
      {twitter && <SocialMediaLink href={twitter} icon={faTwitter} bckColor="linear-gradient(0deg, #E1E8ED 0%, #1DA1F2 90%)" />}
    </div>
  );
};


export default MediaSocial;
