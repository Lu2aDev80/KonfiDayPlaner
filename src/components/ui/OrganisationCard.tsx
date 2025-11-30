import React from 'react';
import styles from './OrganisationCard.module.css';

interface OrganisationCardProps {
  name: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}

const OrganisationCard: React.FC<OrganisationCardProps> = ({ name, description, selected, onClick }) => {
  return (
    <button
      className={selected ? `${styles.organisationCard} ${styles.selected}` : styles.organisationCard}
      onClick={onClick}
      aria-pressed={selected}
      tabIndex={0}
    >
      <div>{name}</div>
      {description && <div className={styles.description}>{description}</div>}
    </button>
  );
};

export default OrganisationCard;
