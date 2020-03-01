import React from 'react';

import { PeriodVariantProps } from './Period';

import styles from './Event.module.css';

const LabelAboveEvent = (props: PeriodVariantProps) => {
  const { sizeRefs, label, color } = props;

  return (
    <div className={styles.labelAbove}>
      <div className={styles.labelAboveLabelContainer}>
        <div
          className={styles.labelAboveLabel}
          style={{ color }}
          ref={sizeRefs ? sizeRefs.labelSizeRef : null}
        >
          {label}
        </div>
      </div>
      <div
        className={styles.labelAboveBar}
        style={{ backgroundColor: color }}
        ref={sizeRefs ? sizeRefs.barSizeRef : null}
      />
    </div>
  );
};

export default React.memo(LabelAboveEvent);
