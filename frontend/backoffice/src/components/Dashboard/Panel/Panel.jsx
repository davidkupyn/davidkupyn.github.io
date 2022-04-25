import { Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Panel.scss';
import Input from '../../Input/Input';
import { Tooltip, IconButton, CircularProgress } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import { MdPersonAdd } from 'react-icons/md';

const itemsPerPage = 5;

const Panel = () => {
  const [users, setUsers] = useState([]);
  const [usersToChange, setUsersToChange] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % usersToChange.length;
    setItemOffset(newOffset);
  };

  const paginate = (_users) => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(_users.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(_users.length / itemsPerPage));
  };

  const searchUser = (data) => {
    data = data.toLowerCase();
    const foundUsers = users.filter(
      (e) =>
        e.name.toLowerCase().includes(data) ||
        e.surname.toLowerCase().includes(data) ||
        e.email?.toLowerCase()?.includes(data) ||
        false ||
        e.telephone?.toLowerCase()?.includes(data) ||
        false
    );
    setUsersToChange(foundUsers);
    paginate(foundUsers);
  };

  const copied = async () => {
    setCopyTitle('Skopiowano!');
    await delay(500);
    setCopyTitle('Skopiuj');
  };

  const getUsers = async () => {
    setLoading(true);

    setUsers([]);
    setUsersToChange([]);
    setCurrentItems([]);

    const res = await UsersService.getAllUsers();
    const users = res.data.users;

    if (res.data.success) {
      setUsers(users);
      setUsersToChange(users);
      setCurrentItems(users);
    }

    paginate(users);

    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    paginate(usersToChange);
  }, [itemOffset, itemsPerPage]);

  return (
    <div className='panel'>
      <div className='panel_container drop-shadow-xl'>
        <p className='font-semibold'>Lista użytkowników w bazie:</p>
        <div className='panel_container_searchbar'>
          <Tooltip title='Odśwież'>
            <span
              style={{ fontSize: '20px', cursor: 'pointer' }}
              onClick={() => getUsers()}
            >
              🔃
            </span>
          </Tooltip>
          <Input
            className='search_input'
            size='small'
            placeholder='🔎 Szukaj...'
            onChange={(e) => searchUser(e.target.value)}
          />
        </div>
        <div className='panel_users'>
          {loading && (
            <div className='panel_users_loading'>
              <CircularProgress /> <span>Ładuję listę użytkowników...</span>
            </div>
          )}
          {!!users.length ? (
            <>
              <Items
                currentItems={currentItems}
                copyTitle={copyTitle}
                copied={copied}
                getUsers={getUsers}
                navigate={navigate}
              />
              <ReactPaginate
                breakLabel='...'
                nextLabel='➡️'
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel='⬅️'
                renderOnZeroPageCount={null}
              />
            </>
          ) : (
            !loading && (
              <div className='ml-[5px]'>
                <Typography component='span' className='select-none opacity-80'>
                  Brak użytkowników w bazie
                </Typography>
              </div>
            )
          )}
        </div>
        <div className='flex w-full items-center justify-between mt-[20px]'>
          {users && (
            <span className='opacity-30 select-none ml-[25px]'>
              Znaleziono {users.length} użytkowników
            </span>
          )}
          <Button
            variant='text'
            startIcon={<MdPersonAdd />}
            onClick={() => navigate('/dashboard/add-user')}
          >
            {document.body.clientWidth <= 480 ? 'Dodaj' : 'Dodaj użytkownika'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Items = ({ currentItems, copyTitle, copied, getUsers, navigate }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('Usuń');

  const deleteUser = async (user) => {
    if (confirmDelete) {
      setDeleteTitle('Usuwam...');

      const res = await UsersService.deleteUser({ id: user._id });

      if (res.data.success) {
        setDeleteTitle('Usunięto!');
        getUsers();
      }
    } else {
      setDeleteTitle('Kliknij, aby potwierdzić');
      setConfirmDelete(true);
    }
  };
  return (
    <div className='panel_users mb-[15px] '>
      {currentItems.map((user, index) => (
        <div key={index} className='panel_users_container'>
          <div className='panel_users_container_user hover:shadow-md'>
            <div className='panel_users_container_user_items pl-[10px]'>
              {user.name} {user.surname}
              {(user.email || user.telephone) && (
                <div className='onhover_info selection:bg-white-100 selection:text-indigo-900'>
                  {user.email && (
                    <p>
                      &#128231;{': '}
                      <CopyToClipboard
                        className='cursor-pointer'
                        onCopy={() => copied()}
                        text={user.email}
                      >
                        <Tooltip title={copyTitle}>
                          <span>
                            {user.email.split('@')[0]}
                            <wbr />@{user.email.split('@')[1]}
                          </span>
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
                              : `+48 ${formatPhoneNumber(user.telephone)}`}
                          </span>
                        </Tooltip>
                      </CopyToClipboard>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className='icons'>
              <Tooltip title='Edytuj'>
                <IconButton
                  size={'small'}
                  onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
                >
                  <span>&#9999;&#65039;</span>
                </IconButton>
              </Tooltip>
              <Tooltip title={deleteTitle}>
                <IconButton
                  size={'small'}
                  onClick={() => deleteUser(user)}
                  onMouseLeave={() => {
                    setDeleteTitle('Usuń');
                    setConfirmDelete(false);
                  }}
                >
                  <span>&#128465;&#65039;</span>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Panel;
