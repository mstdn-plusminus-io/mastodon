import { useEffect } from 'react';

import { fetchStatus } from '../actions/statuses';

import { AbsoluteTimestamp } from './absolute_timestamp';
import { AnimatedNumber } from './animated_number';
import { Avatar } from './avatar';
import { DisplayName } from './display_name';
import EditedTimestamp from './edited_timestamp';
import { Icon } from './icon';
import { RelativeTimestamp } from './relative_timestamp';
import StatusContent from './status_content';

interface Props {
  id?: string;
  status?: unknown;
  dispatch: (...args: unknown[]) => void;
  history: History;
}

export const Quote: React.FC<Props> = (props) => {
  const { id, status, dispatch, history } = props;

  useEffect(() => {
    if (id) {
      dispatch(fetchStatus(id, false, true));
    }
  }, [id]);

  if (!status) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const account = status.get('account');

  let timestamp;
  if (localStorage.plusminus_config_timestamp === 'absolute') {
    timestamp = <AbsoluteTimestamp timestamp={status.get('created_at')} />;
  } else {
    timestamp = <RelativeTimestamp timestamp={status.get('created_at')} />;
  }
  let edited;
  if (status.get('edited_at')) {
    edited = (
      <>
        {' · '}
        <EditedTimestamp statusId={status.get('id')} timestamp={status.get('edited_at')} />
      </>
    );
  }

  const visibilityIconInfo = {
    'public': { icon: 'globe' },
    'unlisted': { icon: 'unlock' },
    'private': { icon: 'lock' },
    'direct': { icon: 'at' },
  };

  const visibilityIcon = visibilityIconInfo[status.get('visibility')];
  const visibilityLink = <> · <Icon id={visibilityIcon.icon} title={visibilityIcon.text} /></>;

  let reblogLink;
  if (['private', 'direct'].includes(status.get('visibility'))) {
    reblogLink = '';
  } else {
    reblogLink = (
      <>
        {' · '}
        <span>
          <Icon id={"retweet"} />
          <span className='detailed-status__reblogs'>
            <AnimatedNumber value={status.get('reblogs_count')} />
          </span>
        </span>
      </>
    );
  }

  const favouriteLink = (
    <span>
      <Icon id='star' />
      <span className='detailed-status__favorites'>
        <AnimatedNumber value={status.get('favourites_count')} />
      </span>
    </span>
  );

  const onClickContainer = (e: any) => {
    if (e && (e.button !== 0 || e.ctrlKey || e.metaKey)) {
      return;
    }

    if (e) {
      e.preventDefault();
    }

    console.log("props:", props);

    history.push(`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`);
  };

  return (
    <a
      className='status__quote__container'
      href={status.get('url')}
      target='_blank'
      rel='noopener noreferrer'
      onClick={(e) => onClickContainer(e)}
    >
      <div className='status__quote'>
        <Icon id='quote-right' fixedWidth className='status__quote__icon' />
        <div className='status__quote__inner'>
          <div className='status__quote__inner__header'>
            <Avatar size={32} account={account} />
            <DisplayName account={account} />
          </div>
          <div className='status__quote__inner__content'>
            <StatusContent status={status} expanded={!status.get('hidden')} />
          </div>
          <div className='status__quote__inner__footer'>
            {timestamp}
            {edited}
            {visibilityLink}
            {reblogLink} · {favouriteLink}
          </div>
        </div>
      </div>
    </a>
  );
};
