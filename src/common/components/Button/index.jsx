import React from 'react';
// import ReactImageFallback from "react-image-fallback";
import styles from './button.module.scss';

export const Button = ({
  classNames,
  text,
  image,
  onClick,
  altImage,
  disabled,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      className={[styles.button, classNames].join(' ')}
      onClick={onClick}
      type={type}
    >
      {/* {image && (
        <ReactImageFallback
          src={image}
          fallbackImage={image}
          initialImage={image}
          alt={altImage}
          className={styles.buttonImage}
        />
      )} */}
      <span>{text}</span>
    </button>
  );
};
