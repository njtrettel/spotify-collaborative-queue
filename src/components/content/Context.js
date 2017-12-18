import React from 'react';
import _ from 'lodash';
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

const renderSectionBody = (contextSection) => {
  if (contextSection.loading) {
    return <Segment loading />;
  }
  if (contextSection.error) {
    return <div>{contextSection.error}</div>;
  }
  return (
    <Table.Body>
      {_.map(_.get(contextSection, 'songs', []), (song, i) => (
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
  );
};

const renderNowPlaying = (props) => {

};

const renderQueue = (queue) => {
  return (
    <Table basic='very' celled>
      {renderSectionHeader('Queue')}
      {renderSectionBody(queue)}
    </Table>
  );
};

const renderUpNext = (upNext) => {
  return (
    <Table basic='very' celled>
      {renderSectionHeader('Up Next')}
      {renderSectionBody(upNext)}
    </Table>
  );
};

const Context = (props) => {
  const classes = classnames(props.className, 'context');
  return (
    <div className={classes}>
      {renderQueue(_.get(props.context, 'queue'))}
      {renderUpNext(_.get(props.context, 'upNext'))}
    </div>
  );
};

export default Context;
