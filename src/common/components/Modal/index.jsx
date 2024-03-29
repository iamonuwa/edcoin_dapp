import React from 'react';
import styles from './modal.module.scss';

export default function Modal({
  visible,
  children,
  modalClassName,
  windowClassName,
  contentClassName,
  closeClassName,
  onClickClose,
}) {
  return (
    <div
      className={`${modalClassName} ${styles.wrapper} ${
        visible ? styles.active : ''
      }`}
    >
      <div className={`${styles.window} ${windowClassName}`}>
        {onClickClose && (
          <div
            className={[styles.close, closeClassName].join(' ')}
            onClick={onClickClose}
          >
            +
          </div>
        )}
        <div className={contentClassName}>{visible && children}</div>
      </div>
    </div>
  );
}
