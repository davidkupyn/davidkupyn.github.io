import React from 'react';
import './Dashboard.scss';
import { Routes, Route } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Admin from './Admin/Admin';
import Panel from './Panel/Panel';
import Groups from './Groups/Groups';
import AddUser from './AddUser/AddUser';
import EditUser from './EditUser/EditUser';
import CreateGroup from './CreateGroup/CreateGroup';
import CheckSession from '../CheckSession';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className='dashboard'>
      <CheckSession />
      {(window.location.pathname == '/dashboard' ||
        window.location.pathname == '/dashboard/') && (
        <div className='dashboard_container sm:justify-center'>
          <div className='dashboard_container_box-wrap'>
            <div
              className='dashboard_container_box-wrap_box drop-shadow-md'
              onClick={() => navigate('/dashboard/panel')}
            >
              <h2>Panel</h2>
            </div>
          </div>
          <div className='dashboard_container_box-wrap'>
            <div
              className='dashboard_container_box-wrap_box drop-shadow-md '
              onClick={() => navigate('/dashboard/groups')}
            >
              <h2>Grupy</h2>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path='/admin' element={<Admin />} />
        <Route path='/panel' element={<Panel />} />
        <Route path='/groups' element={<Groups />} />
        <Route path='/add-user' element={<AddUser />} />
        <Route path='/edit-user/:id' element={<EditUser />} />
        <Route path='/create-group' element={<CreateGroup />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
