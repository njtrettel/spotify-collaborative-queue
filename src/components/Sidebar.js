import React from 'react';
import { Accordion } from 'semantic-ui-react'

const panels = [{
  title: 'Playlists',
  content: {
    content: (
      <div>

      </div>
    ),
    key: 'content-playlists',
  },
}]

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="sidebar__title"> My Library </div>
      <div className="sidebar__links">
        <div className="sidebar__link">Songs</div>
        <div className="sidebar__link">Artists</div>
        <div className="sidebar__link">Albums</div>
      </div>
      <Accordion panels={panels} fluid exclusive={false}/>
    </div>
  );
};

export default Sidebar;
