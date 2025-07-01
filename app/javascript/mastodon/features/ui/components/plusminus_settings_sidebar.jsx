import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const PlusMinusSettingsSidebar = ({ sections, activeSection, onSectionChange, isMobile, isOpen, onClose }) => {
  const handleItemClick = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className='plusminus-settings__sidebar-overlay' onClick={onClose} />
      )}
      <div className={classNames('plusminus-settings__sidebar', { 'plusminus-settings__sidebar--open': isOpen, 'plusminus-settings__sidebar--mobile': isMobile })}>
        <nav className='plusminus-settings__sidebar-nav'>
          {sections.map((section) => (
            <button
              key={section.id}
              className={classNames('plusminus-settings__sidebar-item', {
                'plusminus-settings__sidebar-item--active': activeSection === section.id,
              })}
              onClick={() => handleItemClick(section.id)}
              type='button'
            >
              {section.icon && <i className={`fa fa-fw fa-${section.icon}`} />}
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

PlusMinusSettingsSidebar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
  })).isRequired,
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default PlusMinusSettingsSidebar;