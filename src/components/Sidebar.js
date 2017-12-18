import React from 'react';
import { Accordion } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
        <Link to="/songs" className="sidebar__link">Songs</Link>
        <Link to="artists" className="sidebar__link">Artists</Link>
        <Link to="albums" className="sidebar__link">Albums</Link>
      </div>
      <Accordion panels={panels} fluid exclusive={false}/>
    </div>
  );
};

export default Sidebar;
