import React, { useCallback, useEffect, useState } from 'react';
import classes from './Groups.module.css';
import GroupBadge from './GroupBadge';
import Card from '../../ui/Card';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = useCallback(async () => {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/groups/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      let data = await response.json();
      if (response.ok) {
        setGroups(data);
      } else {
        console.log(data, response);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <Card>
      <div className={classes['group-badge']}>
        {groups.map((group, idx) => <GroupBadge
          key={group.id}
          animateNum={idx}
          membersCounter={group.members_counter}
          description={group.description}
          creator={group.creator_name}
          groupImage={group.group_image}
          groupName={group.group_name}
          createdDate={group.created_at}
        />)}
      </div>
    </Card>
  );
};

export default Groups;
