import React from 'react';
import './styles.css';

interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

const Card: React.FC<CardProps> = (props) => {
  const { title, children, actions } = props;
  return (
    <section className="card">
      <div className="card-title">{title}</div>
      <div className="card-content">{children}</div>
      {actions && (
        <div className="card-actions">
          {actions?.map((action) => (
            <button key={action.label} onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Card;
