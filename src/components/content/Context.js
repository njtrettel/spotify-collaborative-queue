import React from 'react';
import classnames from 'classnames';
import { Table, Segment, Header } from 'semantic-ui-react';

const renderSectionHeader = (sectionTitle) => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>
        <Header as='h1' className="context__header">{sectionTitle}</Header>
      </Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const renderNowPlaying = (props) => {

};

const renderQueue = (props) => {

};

const renderUpNext = (props) => {
  return (
    <Table basic='very' celled>
      {renderSectionHeader('Up Next')}
      <Table.Body>
        {_.map(_.get(props.context, 'upNext', []), (song, i) => (
          <Table.Row key={i} className="context__song">
            <Table.Cell>
              <Header as='h4'>
                <Header.Content className="context__song--title">
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
};

const Context = (props) => {
  const classes = classnames(props.className, 'context');
  return (
    <div className={classes}>
    </div>
  );
};

export default Context;
