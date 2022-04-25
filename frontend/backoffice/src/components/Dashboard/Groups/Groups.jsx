import { Box, Container, Paper, Typography } from '@mui/material';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Groups.scss';
import { Tooltip, CircularProgress } from '@mui/material';
import Input from '../../Input/Input';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupsToDisplay, setGroupsToDisplay] = useState([]);
  const [chosenGroup, setChosenGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersToFilter, setUsersToFilter] = useState([]);
  const [newName, setNewName] = useState('');
  const [isUserOpened, setUserOpened] = useState([false, null]);
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [editing, isEditing] = useState([false, null]);
  const [loading, setLoading] = useState(null);
  const [openedListSection, isOpenedListSection] = useState(true);
  const [tablet, isTablet] = useState(document.body.clientWidth <= 768);
  const [openedAddSection, isOpenedAddSection] = useState(!tablet);

  const userListRef = React.createRef();

  const scrollToRef = (ref) => {
    if (!tablet) return;
    if (ref?.current) ref.current.scrollIntoView();
  };
  const getUserById = (userId) =>
    users.filter((user) => user._id === userId)[0];

  const copied = async () => {
    setCopyTitle('Skopiowano!');
    await delay(500);
    setCopyTitle('Skopiuj');
  };

  const getGroups = async () => {
    setLoading(true);

    const res = await GroupsService.getAllGroups();
    if (res.data.success) {
      setGroups(res.data.groups);
      setGroupsToDisplay(res.data.groups);
    }

    setLoading(false);
  };

  const getUsers = async () => {
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      setUsers(res.data.users);
      setUsersToFilter(res.data.users);
    }
  };

  const refreshUsers = async () => {
    await getGroups();
  };

  const removeGroup = async (id) => {
    if (!editing[0] || editing[1] != id) {
      await GroupsService.deleteGroup({ id: id });

      getGroups();
      setChosenGroup(null);
    } else {
      if (!editing[0]) return isEditing([true, id]);
      if (id != editing[1]) isEditing([editing[0], id]);
      else isEditing([!editing[0], id]);
    }
  };

  const editGroup = async (id) => {
    setLoading(true);

    if (!editing[0] || editing[1] != id) isEditing([!editing[0], id]);
    else if (newName) {
      await GroupsService.editGroup({ id, name: newName });

      getGroups();
      if (!editing[0]) return isEditing([true, id]);
      if (id != editing[1]) isEditing([editing[0], id]);
      else isEditing([!editing[0], id]);
    }

    setLoading(false);
  };

  const addToGroup = async (groupId, userId) => {
    refreshUsers();
    const _chosenGroup = chosenGroup;
    _chosenGroup.userid.push(userId);
    setChosenGroup(_chosenGroup);
    await GroupsService.addToGroup({ groupId, userId });
  };

  const removeFromGroup = async (groupId, userId) => {
    refreshUsers();
    const _chosenGroup = chosenGroup;
    _chosenGroup.userid = _chosenGroup.userid.filter((_) => _ != userId);
    setChosenGroup(_chosenGroup);
    await GroupsService.removeFromGroup({ groupId, userId });
  };

  const openSection = (type) => {
    if (!tablet) return;
    if (type === 1) isOpenedListSection(!openedListSection);
    else isOpenedAddSection(!openedAddSection);
  };

  const searchGroup = (data) => {
    data = data.toLowerCase();
    const foundGroup = groups.filter(
      (e, index) =>
        e.name.toLowerCase().includes(data) ||
        (index + 1).toString() === data ||
        e.userid.some((u) => getUserById(u).name.toLowerCase().includes(data))
    );
    setGroupsToDisplay(foundGroup);
  };

  const searchUser = (data) => {
    data = data.toLowerCase();

    const foundUser = [];
    users.forEach(
      (e, index) =>
        (e.name.toLowerCase().includes(data) ||
          e.surname.toLowerCase().includes(data) ||
          e.email?.toLowerCase().includes(data)) &&
        foundUser.push(e)
    );

    setUsersToFilter(foundUser);
    isOpenedAddSection(true);
    isOpenedListSection(true);
  };

  useEffect(() => {
    getGroups();
    getUsers();
  }, []);

  useEffect(() => {
    isTablet(document.body.clientWidth <= 768);
  }, [document.body.clientWidth]);

  return (
    <div className='groups'>
      <div className='groups_container drop-shadow-xl'>
        <div className='groups_container_groups'>
          <div className='groups_container_groups_input-container'>
            <Input
              className='groups_container_groups_input-container_input'
              size='small'
              placeholder='&#x1F50D; Szukaj grupy...'
              onChange={(e) => searchGroup(e.target.value)}
            />
            <Tooltip title='Utwórz grupę'>
              <a href='/dashboard/create-group'>&#10133;</a>
            </Tooltip>
          </div>
          <div className='groups_container_groups_list'>
            {loading && !groups && (
              <div className='groups_container_groups_list_loader'>
                <CircularProgress /> <span>Ładuję grupy...</span>
              </div>
            )}
            {groupsToDisplay.map((group, index) => {
              return (
                <div className='group-item-container' key={index}>
                  <div className='group-item'>
                    <div
                      className={
                        chosenGroup && chosenGroup.name === group.name
                          ? 'group-item_main chosen-group drop-shadow-md'
                          : 'group-item_main hover:drop-shadow-md'
                      }
                    >
                      <div
                        className='group-item_main_names'
                        onClick={() => {
                          setChosenGroup(group);
                          scrollToRef(userListRef);
                        }}
                      >
                        <h2>
                          {groups.indexOf(group) + 1}.{' '}
                          {!editing[0] || editing[1] != group._id ? (
                            group.name
                          ) : (
                            <Input
                              className='rename-input'
                              size='small'
                              placeholder={group.name}
                              onChange={(e) => setNewName(e.target.value)}
                              onKeyDown={(e) =>
                                `${e.code}`.toLowerCase() === 'enter' &&
                                editGroup(group._id)
                              }
                            />
                          )}
                        </h2>
                      </div>
                      {!editing[0] || editing[1] != group._id ? (
                        <div className='group-item_main_buttons'>
                          <Tooltip title='Edytuj'>
                            <h2 onClick={() => editGroup(group._id)}>✏️</h2>
                          </Tooltip>
                          <Tooltip title='Usuń'>
                            <h2 onClick={() => removeGroup(group._id)}>🗑️</h2>
                          </Tooltip>
                        </div>
                      ) : (
                        <div className='group-item_main_buttons'>
                          <Tooltip title='Zapisz'>
                            <h2 onClick={() => editGroup(group._id)}>💾</h2>
                          </Tooltip>
                          <Tooltip title='Anuluj'>
                            <h2 onClick={() => removeGroup(group._id)}>❌</h2>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='groups_container_main'>
          <div className='groups_container_main_input-container'>
            <Input
              className='groups_container_main_input-container_input'
              size='small'
              placeholder='&#x1F50D; Szukaj użytkowników...'
              onChange={(e) => searchUser(e.target.value)}
            />
          </div>
          <div className='groups_container_main_lists'>
            <div className='groups_container_main_lists_list'>
              <div
                className={`groups_container_main_lists_list_titles select-none ${
                  !chosenGroup ? 'chosen' : ''
                }`}
                onClick={() => openSection(1)}
              >
                <h2 className='groups_container_main_lists_list_titles_title '>
                  W grupie
                </h2>
                {tablet && chosenGroup ? (
                  <h2
                    className={`groups_container_main_lists_list_titles_title ${
                      openedListSection ? 'flipped' : ''
                    }`}
                  >
                    ⤵️
                  </h2>
                ) : null}
              </div>
              <div className='userListRef' ref={userListRef}></div>
              {chosenGroup ? (
                <div
                  className={`groups_container_main_lists_list_users ${
                    openedListSection ? 'opened' : 'closed'
                  }`}
                >
                  {openedListSection &&
                    usersToFilter
                      .filter((u) => chosenGroup?.userid.includes(u._id))
                      .map((id, index) => {
                        id = id._id;
                        return (
                          getUserById(id) && (
                            <div
                              className={`user-item_container ${
                                isUserOpened[0] && isUserOpened[1] == id
                                  ? 'opened'
                                  : ''
                              }`}
                              key={index}
                            >
                              <span className='user-item hover:drop-shadow-md'>
                                <div>
                                  <h4
                                    onClick={() => {
                                      if (!isUserOpened[0])
                                        return setUserOpened([true, id]);
                                      if (id != isUserOpened[1])
                                        setUserOpened([isUserOpened[0], id]);
                                      else
                                        setUserOpened([!isUserOpened[0], id]);
                                    }}
                                  >
                                    {getUserById(id)
                                      ? getUserById(id).name
                                      : '-'}{' '}
                                    {getUserById(id)
                                      ? getUserById(id).surname
                                      : '-'}
                                  </h4>
                                  <Tooltip title='Usuń'>
                                    <h2
                                      onClick={() =>
                                        removeFromGroup(chosenGroup._id, id)
                                      }
                                      className='select-none'
                                    >
                                      &#10134;
                                    </h2>
                                  </Tooltip>
                                </div>
                                {isUserOpened[0] &&
                                  isUserOpened[1] == id &&
                                  getUserById(id) && (
                                    <div>
                                      {getUserById(id).email && (
                                        <p>
                                          &#128231;{': '}
                                          <CopyToClipboard
                                            className='cursor-pointer'
                                            onCopy={() => copied()}
                                            text={getUserById(id).email}
                                          >
                                            <Tooltip title={copyTitle}>
                                              <span>
                                                {getUserById(id).email}
                                              </span>
                                            </Tooltip>
                                          </CopyToClipboard>
                                        </p>
                                      )}
                                      {getUserById(id).telephone && (
                                        <p>
                                          &#128241;{': '}
                                          <CopyToClipboard
                                            className='cursor-pointer'
                                            onCopy={() => copied()}
                                            text={getUserById(id).telephone}
                                          >
                                            <Tooltip title={copyTitle}>
                                              <span>
                                                {getUserById(
                                                  id
                                                ).telephone.startsWith('+48')
                                                  ? getUserById(id).telephone
                                                  : `+48 ${formatPhoneNumber(
                                                      getUserById(id).telephone
                                                    )}`}
                                              </span>
                                            </Tooltip>
                                          </CopyToClipboard>
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </span>
                            </div>
                          )
                        );
                      })}
                </div>
              ) : (
                <h3>Wybierz grupę</h3>
              )}
            </div>
            <div className='groups_container_main_lists_add'>
              <div
                className={`groups_container_main_lists_add_titles select-none ${
                  !chosenGroup ? 'chosen' : ''
                }`}
                onClick={() => openSection(2)}
              >
                <h2 className='groups_container_main_lists_add_titles_title'>
                  {tablet ? 'Dodaj' : 'Dodaj do grupy'}
                </h2>
                {tablet && chosenGroup ? (
                  <h2
                    className={`groups_container_main_lists_add_titles_title ${
                      openedAddSection ? 'flipped' : ''
                    }`}
                  >
                    ⤵️
                  </h2>
                ) : null}
              </div>
              <div
                className={`groups_container_main_lists_add_users ${
                  openedAddSection ? 'opened' : 'closed'
                }`}
              >
                {openedAddSection &&
                  chosenGroup &&
                  usersToFilter
                    .filter((u) => !chosenGroup?.userid.includes(u._id))
                    .map((user, index) => {
                      return (
                        <div
                          className={`user-item_container ${
                            isUserOpened[0] && isUserOpened[1] == user._id
                              ? 'opened'
                              : ''
                          }`}
                          key={index}
                        >
                          <span className='user-item hover:drop-shadow-md'>
                            <div>
                              <h4
                                onClick={() => {
                                  if (!isUserOpened[0])
                                    return setUserOpened([true, user._id]);
                                  if (user._id != isUserOpened[1])
                                    setUserOpened([isUserOpened[0], user._id]);
                                  else
                                    setUserOpened([!isUserOpened[0], user._id]);
                                }}
                              >
                                {user.name} {user.surname}
                              </h4>
                              <Tooltip title='Dodaj'>
                                <h2
                                  onClick={() =>
                                    addToGroup(chosenGroup._id, user._id)
                                  }
                                  className='select-none'
                                >
                                  &#10133;
                                </h2>
                              </Tooltip>
                            </div>
                            {isUserOpened[0] && isUserOpened[1] == user._id && (
                              <div>
                                {user.email && (
                                  <p>
                                    &#128231;{': '}
                                    <CopyToClipboard
                                      className='cursor-pointer'
                                      onCopy={() => copied()}
                                      text={user.email}
                                    >
                                      <Tooltip title={copyTitle}>
                                        {document.body.clientWidth >= 970 ? (
                                          <span>{user.email}</span>
                                        ) : (
                                          <span>
                                            {user.email.split('@')[0]}
                                            <wbr />@{user.email.split('@')[1]}
                                          </span>
                                        )}
                                      </Tooltip>
                                    </CopyToClipboard>
                                  </p>
                                )}
                                {user.telephone && (
                                  <p>
                                    &#128241;{': '}
                                    <CopyToClipboard
                                      className='cursor-pointer'
                                      onCopy={() => copied()}
                                      text={user.telephone}
                                    >
                                      <Tooltip title={copyTitle}>
                                        <span>
                                          {user.telephone.startsWith('+48')
                                            ? user.telephone
                                            : `+48 ${formatPhoneNumber(
                                                user.telephone
                                              )}`}
                                        </span>
                                      </Tooltip>
                                    </CopyToClipboard>
                                  </p>
                                )}
                              </div>
                            )}
                          </span>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
