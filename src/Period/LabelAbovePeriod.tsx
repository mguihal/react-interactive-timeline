import React, { useEffect } from 'react';
import { PeriodVariantProps } from './Period';
import styles from './Period.module.css';

const LabelAbovePeriod = (props: PeriodVariantProps) => {
  const { sizeRefs, label, position, color } = props;

  const labelRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  sizeRefs.push(labelRef);
  sizeRefs.push(barRef);

  const labelLeftOffset =
    position === 'tailOnly'
      ? (-props.containerLeft / props.containerWidth) * 100
      : 0;

  useEffect(() => {
    if (
      labelRef &&
      barRef &&
      labelRef.current &&
      barRef.current &&
      position === 'tailOnly'
    ) {
      const labelWidth = labelRef.current.offsetWidth;
      const barWidth = barRef.current.offsetWidth;

      if (labelWidth > barWidth) {
        labelRef.current.style.marginLeft = '0%';
      } else {
        const diff = labelWidth - ((100 - labelLeftOffset) / 100) * barWidth;

        if (diff > 0) {
          labelRef.current.style.marginLeft =
            labelLeftOffset - (diff / barWidth) * 100 + '%';
        }
      }
    }
  });

  return (
    <div className={styles.labelAbove}>
      <div
        className={styles.labelAboveLabel}
        ref={labelRef}
        style={{ marginLeft: labelLeftOffset + '%', color }}
      >
        {label}
      </div>
      <div
        className={styles.labelAboveBar}
        ref={barRef}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default React.memo(LabelAbovePeriod);
