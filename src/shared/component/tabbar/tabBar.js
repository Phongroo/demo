import React, { useState } from 'react';
import './tabBar.scss';

import { CSSTransition } from 'react-transition-group';


const TabBar = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
  
    const handleTabClick = (index) => {
      setActiveTab(index);
    };
  
    return (
        <div className="horizontal-tab-view">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={index === activeTab ? 'tab active' : 'tab'}
              onClick={() => handleTabClick(index)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className="tab-content">
          <CSSTransition
            in={true}
            appear={true}
            timeout={300}
            classNames="slide"
          >
            <div>{tabs[activeTab].content}</div>
          </CSSTransition>
        </div>
      </div>
    );
  };
  
  export default TabBar;

 