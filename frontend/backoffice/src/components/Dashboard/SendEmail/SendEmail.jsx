import { Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './sendEmail.scss';
import Input from '../../Input/Input';
import { Tooltip, IconButton, CircularProgress } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import { MdPersonAdd } from 'react-icons/md';

const itemsPerPage = 5;

const SendEmail = () => {
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

  return <div className='send-email'></div>;
};

export default SendEmail;
