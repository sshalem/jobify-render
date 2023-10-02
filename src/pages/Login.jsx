import React, { useEffect } from 'react';
import { Form, redirect, useNavigation, Link, useNavigate } from 'react-router-dom';
import { Logo, FormRow } from '../components';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { jwtAuthController } from '../utils/customInstance';
import { toast } from 'react-toastify';

const addUserToLocalStorage = (user, token, refreshToken, location) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('location', location);
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const dataFormSend = Object.fromEntries(formData);
  try {
    const { data } = await jwtAuthController.post('/login', dataFormSend);
    addUserToLocalStorage(data.user, data.token, data.refreshToken, data.location);
    toast.success('login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      // don't do anything
      // stay on login page
    } else {
      navigate('/dashboard');
    }
  }, [user]);

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>login</h4>
        <FormRow type="email" name="email" defaultValue="shabtay.shalem@gmail.com" />
        <FormRow type="password" name="password" defaultValue="123" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'submitting...' : 'submit'}
        </button>
        <button type="button" className="btn btn-block">
          explore the app
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
