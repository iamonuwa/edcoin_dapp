import React from 'react';
import styles from './card.module.scss';

export const Card = ({ children, classNames, color }) => {
  return (
    <div className={[styles.card, classNames, color].join(' ')}>{children}</div>
  );
};
