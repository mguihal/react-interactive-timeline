import React, { useEffect } from 'react';

import { PeriodVariantProps } from './Period';

import styles from './Period.module.css';

const LabelAbovePeriod = (props: PeriodVariantProps) => {
  const { sizeRefs, label, position, color } = props;

  const labelLeftOffset = (position === 'tailOnly') ? -props.containerLeft / props.containerWidth * 100 : 0;

  useEffect(() => {
    if (sizeRefs && sizeRefs.labelSizeRef.current && sizeRefs.barSizeRef.current && position === 'tailOnly') {
      const labelWidth = sizeRefs.labelSizeRef.current.offsetWidth;
      const barWidth = sizeRefs.barSizeRef.current.offsetWidth;

      if (labelWidth > barWidth) {
        sizeRefs.labelSizeRef.current.style.marginLeft = '0%';
      } else {
        const diff = labelWidth - ((100 - labelLeftOffset) / 100 * barWidth);

        if (diff > 0) {
          sizeRefs.labelSizeRef.current.style.marginLeft = (labelLeftOffset - (diff / barWidth * 100)) + '%';
        }
      }
    }
  });

  return (
    <div className={styles.labelAbove}>
      <div
        className={styles.labelAboveLabel}
        ref={sizeRefs ? sizeRefs.labelSizeRef : null}
        style={{ marginLeft: labelLeftOffset + '%', color }}
      >
        {label}
      </div>
      <div className={styles.labelAboveBar} ref={sizeRefs ? sizeRefs.barSizeRef : null} style={{ backgroundColor: color }} />
    </div>
  );
};

export default React.memo(LabelAbovePeriod);
