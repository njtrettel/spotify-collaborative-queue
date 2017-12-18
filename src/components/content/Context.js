import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { Table, Segment, Header } from 'semantic-ui-react';

const stateToProps = (state, ownProps) => {
  const context = state.context;
  return {
    context
  };
};

const renderSection = (contextSection) => {
  if (contextSection.loading) {
    return <Segment loading basic className="context__loading" />;
  }
  if (contextSection.error) {
    return <div>{contextSection.error}</div>;
  }
  return (
    <Table basic='very' celled>
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
    </Table>
  );
};

const renderNowPlaying = (props) => {

};

const Context = (props) => {
  const classes = classnames(props.className, 'context');
  return (
    <div className={classes}>
      <Header as='h1' className="context__header">Queue</Header>
      {renderSection(_.get(props.context, 'queue'))}
      <Header as='h1' className="context__header">Up Next</Header>
      {renderSection(_.get(props.context, 'upNext'))}
    </div>
  );
};

export default connect(stateToProps)(Context);
