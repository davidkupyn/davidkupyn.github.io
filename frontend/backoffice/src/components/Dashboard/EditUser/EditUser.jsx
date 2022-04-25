import { Container, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import './EditUser.scss';
import Input from '../../Input/Input';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { MdErrorOutline, MdSave } from 'react-icons/md';
import { types } from './../../../utils/enums';

const EditUser = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [type, setType] = useState(null);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [responseError, setResponseError] = useState('');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const addUser = async () => {
    if (!name) return setError('NAME');
    else if (!surname) return setError('SURNAME');
    else if (!type) return setError('TYPE');
    else if (!type) return setError('ERROR');
    if (number && number.length != 9) return setError('NUMBER');

    setError('');
    setLoading(true);

    const res = await UsersService.editUser({
      id,
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

  useEffect(async () => {
    console.log(id);
    const res = await UsersService.getUser({ id });
    console.log(res);
    if (res.data.success) {
      const user = res.data.user;
      setName(user.name);
      setSurname(user.surname);
      setEmail(user.email);
      setNumber(user.telephone);
      setType(user.type);
    }
  }, []);

  return (
    <Container className='addUser' maxWidth='sm'>
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
              variant='contained'
              loading={loading}
              loadingPosition='start'
              startIcon={<MdSave />}
              onClick={() => addUser()}
            >
              Zapisz
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditUser;
