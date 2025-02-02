import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

export default function UserInfo() {
const [initialValues, setInitialValues] = useState({
    id: '',
    username: '',
    email: '',
    mobileContact: '',
    role: '',
    location:'',
    password: ''
    });

const navigate = useNavigate();

useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("Stored User in LocalStorage:", storedUser);

    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            console.log("Parsed User Data:", parsedUser);
            setInitialValues({
                id: parsedUser.id || '',
                username: parsedUser.username || '',
                email: parsedUser.email || '',
                mobileContact: parsedUser.mobileContact || '',
                role: parsedUser.role || '',
                location: parsedUser.location || '',
                password: parsedUser.password ||''
                });
            console.log("parsedUser by Ali", parsedUser)
            } catch (error) {
            console.error("Error parsing stored user data:", error);
            toast.error('Error loading user data. Please log in again.');
            navigate('/LoginForm');
            }
        } else {
            toast.error('Please log in to access this page.');
            navigate('/LoginForm');
        }
    }, [navigate]);

const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Unauthorized action. Please log in.');
            return;
        }

    const updatedData = {
        username: values.username,
        email: values.email,
        mobileContact: values.mobileContact,
        role: values.role,
        location: values.location,
        password: values.password
        };

        console.log("Form values before update:", updatedData);

            try {
                const response = await fetch(`http://localhost:5000/api/users/${values.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const updatedUser = await response.json(); 

                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                toast.success('User information updated successfully.');

                setInitialValues({
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    mobileContact: updatedUser.mobileContact,
                    role: updatedUser.role,
                    location: updatedUser.location,
                    password: updatedUser.password
                });

            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Failed to update user information.');
            }
        }
    });

    
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Unauthorized action. Please log in.');
            return;
        }
    
        console.log("User ID for deletion:", formik.values.id); 
    
        try {
            const response = await fetch(`http://localhost:5000/api/users/delete/${formik.values.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                const errorBody = await response.json();
                console.error('Error Response Body:', errorBody); 
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            toast.success('User account deleted successfully. Logging out...');
            navigate('/LoginForm');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user account. Please try again.');
        }
    };
    
return (
<div className="container-fluid">
    <div>
    <div className="col-lg-12 col-md-12 col-sm-12">
        <div className='colo'>
        <Link to='/Home'><img src='./logo-pets.png' className='update_logo' alt='Logo' /></Link>
        </div>
        <div className='colo'>
        <h2 className='userinfo'>Profile Management</h2>
        </div>
    </div>
    </div>
    <form style={{ marginTop: '2rem' }} onSubmit={formik.handleSubmit}>
    <div className="row">
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="text" className="input-fields2 float1" onChange={formik.handleChange} value={formik.values.username} placeholder='Username'
     id='username' name='username' required/>
    </div>
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="email" className="input-fields2" onChange={formik.handleChange} value={formik.values.email} placeholder='Email'
     id='email' name='email' required readOnly/>
    </div>
    </div>
    <div className="row">
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="text" className="input-fields2 float1" onChange={formik.handleChange} value={formik.values.mobileContact} placeholder='Mobile Contact'
     id='mobileContact' name='mobileContact' required />
    </div>
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="text" className="input-fields2" onChange={formik.handleChange} value={formik.values.role} placeholder='Role'
     id='role' name='role' required readOnly />
    </div>
    </div>
    <div className="row">
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="text" className="input-fields2 float1" onChange={formik.handleChange} value={formik.values.location} placeholder='Address'
     id='location' name='location' required />
    </div>
    <div className="col-lg-6 col-md-12 col-sm-12">
    <input type="text" className="input-fields2" onChange={formik.handleChange} value={formik.values.password} placeholder='Password'
     id='password' name='password' required readOnly />
    </div>
    </div>
    <div className="row">
    <div className="col-lg-6 col-md-12 col-sm-12" style={{float:'right', display:'flex', justifyContent:'center', marginLeft:'9rem'}}>
    {initialValues.role === 1 ? (
  <Link to='/AdminDashboard' style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none', marginLeft:'2rem' }}>
    Admin Dashboard...
  </Link>
) : (
  <Link to={{ pathname: '/PetsManage', state: { userId: String(localStorage.getItem('userId')) } }} style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>
    Manage Pets...
  </Link>
)}
    </div>
    <div className="col-lg-6 col-md-12 col-sm-12"></div>
    </div>
    <div className="row mt-3">
    <div className="col-lg-6 col-md-6">
        <button style={{ float: 'right' }} className="update_btn" type="submit">Update</button>
    </div>
    <div className="col-lg-6 col-md-6">
         <button className="delete_btn" type="button" onClick={handleDelete}>Delete Account</button>
    </div>
    </div>
    </form>
</div>
    );
}
