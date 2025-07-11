import React, { useState, useEffect } from 'react';
import styles from './Topics.module.css';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import accounting from '../../assets/images/accounting.png';
import marketing from '../../assets/images/marketing.png';
import geopolitics from '../../assets/images/geopolitics.png';
import statistics from '../../assets/images/statistics.png';
import economy from '../../assets/images/economy.png';

geopolitics
const topics = [
  { title: 'Economy', image: economy },
  { title: 'Marketing', image: marketing },
  { title: 'Accounting', image: accounting},
  { title: 'Statistics', image: statistics },
  { title: 'Geopolitics', image:geopolitics }
];

const Topics = () => {
  const [current, setCurrent] = useState(0);
useEffect(() => {
  let intervalId;

  if (!intervalId) {
    intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % topics.length);
    }, 5000);
  }

  return () => clearInterval(intervalId);
}, []);

//   const handlePrev = () => {
//     setCurrent((prev) => (prev - 1 + topics.length) % topics.length);
//   };

//   const handleNext = () => {
//     setCurrent((prev) => (prev + 1) % topics.length);
//   };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        {/* <button className={styles.navButton} onClick={handlePrev}>
          <FaChevronLeft />
        </button> */}
        <div className={styles.imageContainer} >
          <img
            src={topics[current].image}
            alt={topics[current].title}
            className={styles.topicImage}
          />
          <div className={styles.caption}>{topics[current].title}</div>
        </div>
        {/* <button className={styles.navButton} onClick={handleNext}>
          <FaChevronRight />
        </button> */}
      </div>
    </div>
  );
};

export default Topics;
