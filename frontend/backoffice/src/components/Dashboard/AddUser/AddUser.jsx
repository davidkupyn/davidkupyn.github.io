import { Container, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import './AddUser.scss';
import Input from '../../Input/Input';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { MdErrorOutline, MdPersonAddAlt } from 'react-icons/md';
import { types, countries } from './../../../utils/enums';

const AddUser = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [type, setType] = useState(null);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [responseError, setResponseError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const addUser = async () => {
    if (!name) return setError('NAME');
    else if (!surname) return setError('SURNAME');
    else if (!type) return setError('TYPE');
    else if (!type) return setError('ERROR');
    if (number && number.length != 9) return setError('NUMBER');

    setError('');
    setLoading(true);

    const res = await UsersService.addUser({
      type,
      name,
      surname,
      email,
      number,
    });

    if (res.data.success) navigate('/dashboard/panel');
    else setResponseError(res.data.message);

    setLoading(false);
  };

  return (
    <Container
      className='addUser'
      maxWidth='sm'
      //? idk maxWidth={document.body.clientWidth >= 480 ? 'sm' : false}
    >
      <div className='addUser_container drop-shadow-xl'>
        <div className='addUser_box'>
          <div className='addUser_box_names'>
            <Input
              placeholder='Imię'
              label='Imię'
              error={error.includes('NAME')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
            />
            <Input
              placeholder='Nazwisko'
              label='Nazwisko'
              error={error.includes('SURNAME')}
              value={surname}
              onChange={(e) => {
                setSurname(e.target.value);
                setError('');
              }}
              required
            />
          </div>
          <Autocomplete
            disablePortal
            options={types}
            value={type}
            onChange={(event, newValue) => {
              setType(newValue);
              setError('');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Typ konta'
                error={error.includes('TYPE')}
                required
              />
            )}
          />
          <Input
            placeholder='Adres email'
            label='Adres email'
            value={email}
            error={!!responseError.length || error.includes('EMAIL')}
            onChange={(e) => {
              setEmail(e.target.value);
              setResponseError('');
            }}
            required
            fullWidth
          />
          {responseError && (
            <div className='response_error'>
              <MdErrorOutline size={18} />
              <p>{responseError}</p>
            </div>
          )}
          <Input
            placeholder='Numer telefonu'
            label='Numer telefonu'
            type='number'
            error={error.includes('NUMBER')}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
          />
          <div className='addUser_box_buttons'>
            <Button onClick={() => navigate('/dashboard/panel/')}>Wróć</Button>
            <LoadingButton
              variant={document.body.clientWidth <= 480 ? 'text' : 'contained'}
              loading={loading}
              loadingPosition='start'
              startIcon={<MdPersonAddAlt />}
              onClick={() => addUser()}
            >
              {document.body.clientWidth <= 480 ? 'Dodaj' : 'Dodaj użytkownika'}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddUser;
