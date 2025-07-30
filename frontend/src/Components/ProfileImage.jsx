import React from "react";
import "./ProfileImage.css";

const ProfileImage = ({ name, imageUrl, size = "medium" }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "A";

  if (imageUrl) {
    return (
      <div className={`profile-image-container ${size}`}>
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="profile-image"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.classList.add("show-initial");
            e.target.parentElement.setAttribute("data-initial", initial);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`profile-image-container ${size} show-initial`}
      data-initial={initial}
    ></div>
  );
};

export default ProfileImage;
