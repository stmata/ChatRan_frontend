import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import Chatboot from '../../components/Chatboot/Chatboot';
import Queries from '../../components/Queries/Queries';
import Topics from '../../components/Topics/Topics';
import styles from './RanChat.module.css';

const RanChat = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.chatbootSection}>
          <Chatboot />
        </div>
        <div className={styles.sideSection}>
          <div className={styles.queries}>
            <Queries />
          </div>
          <div className={styles.topics}>
            <Topics />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RanChat;
