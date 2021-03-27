import React from 'react';
import styles from './Event.module.css';
import { PeriodVariantProps } from './Period';

const LabelAboveEvent = (props: PeriodVariantProps) => {
  const { sizeRefs, label, color } = props;

  const labelRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  sizeRefs.push(labelRef);
  sizeRefs.push(barRef);

  return (
    <div className={styles.labelAbove}>
      <div className={styles.labelAboveLabelContainer}>
        <div
          className={styles.labelAboveLabel}
          style={{ color }}
          ref={labelRef}
        >
          {label}
        </div>
      </div>
      <div
        className={styles.labelAboveBar}
        style={{ backgroundColor: color }}
        ref={barRef}
      />
    </div>
  );
};

export default React.memo(LabelAboveEvent);
