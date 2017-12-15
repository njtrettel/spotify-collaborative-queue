import React from 'react';
import { Grid } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import Content from './Content';

const SpotifyContent = (props) => {
  return (
    <Grid columns={16} className="spotify-content">
      <Grid.Row className="spotify-content__wrapper">
        <Grid.Column width={3} className="spotify-content__column spotify-content__column--sidebar">
          <Sidebar />
        </Grid.Column>
        <Grid.Column width={13} className="spotify-content__column spotify-content__column--main">
          <Content />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SpotifyContent;
