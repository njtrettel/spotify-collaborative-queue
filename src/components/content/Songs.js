import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Table, Segment, Header } from 'semantic-ui-react';

const renderSongsTable = (songs) => (
  <Table basic='very' celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell><Header as='h1'>Songs</Header></Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {_.map(songs, (song, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Header as='h4'>
              <Header.Content>
                  {_.get(song, 'title')}
                <Header.Subheader>{_.get(song, 'artists')}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const Songs = (props) => {
  const classes = classnames(props.className, 'songs');
  const songs = _.get(props, 'songs', { error: 'Empty songs' });
  if (songs.loading) {
    return <Segment loading />;
  }
  if (!!songs.error) {
    return <div>{songs.error.toString()}</div>;
  }
  return (
    <div className={classes}>
      {renderSongsTable(songs.data)}
    </div>
  );
};

export default Songs;
