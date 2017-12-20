import React from 'react';
import { Accordion } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

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
  const path = (name) => `/room/${props.match.params.roomId}/${name}`;
  return (
    <div className="sidebar">
      <div className="sidebar__title"> My Library </div>
      <div className="sidebar__links">
        <Link to={path('songs')} className="sidebar__link">Songs</Link>
        <Link to={path('artists')} className="sidebar__link">Artists</Link>
        <Link to={path('albums')} className="sidebar__link">Albums</Link>
      </div>
      <Accordion panels={panels} fluid exclusive={false}/>
    </div>
  );
};

export default withRouter(Sidebar);
