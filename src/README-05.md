# project 00 login page, Dashboard loader , logout page

- Backend Server is already setup
- In this project , I will fully setup the Register Page with logic
- videos 115-119
- continue from 115

### General notes

- logo built in Figma
- [Cool Images](https://undraw.co/)

### Installed following dependencies (So far):

```sh
npm install react-router-dom
npm install styled-components
npm install react-icons
npm install styled-components
npm install axios
npm i react-toastify
```

### Already done in previous projects

1. custom `axios` instance + Server Setup
2. Typical Form submission
3. Styled Components
4. Register page full setup
5. `Toastify` setup

### Topics cover in this project-05

1. Login User setup (JSX , export `action` )
2. define `action` in `App.jsx`
3. useNavigation() and navigation.state

<!-- ############################################################################## -->
<!-- ############################################################################## -->

#### Styled Components

- CSS in JS
- Styled Components
- have logic and styles in component
- no name collisions
- apply javascript logic
- [Styled Components Docs](https://styled-components.com/)
- [Styled Components Course](https://www.udemy.com/course/styled-components-tutorial-and-project-course/?referralCode=9DABB172FCB2625B663F)
- In VsCode install the extenstion of `vscode-styled-components`

<!-- ############################################################################## -->
<!-- ############################################################################## -->

#### 1. Login User setup

check Register setup (with more explanations) Since the setup for Login and Register are the same:

```js
import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import { Logo, FormRow } from '../components';
import Wrapper from '../../../assets/wrappers/RegisterAndLoginPage';
import { jwtAuthController } from '../../../utils/customInstance';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    await jwtAuthController.post('/login', data);
    toast.success('login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>login</h4>
        <FormRow type="email" name="email" defaultValue="john@gmail.com" />
        <FormRow type="password" name="password" defaultValue="secret123" />
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
```

#### 2. define `action` in `App.jsx`

- `App.jsx` call a callback for the action

```jsx
import { action as loginAction } from './pages/Register';

{
  path: 'register',
  element: <Register />,
  action: loginAction
},
```

#### 3. Access `action` Data in the Login component (optional)

```js
import { useActionData } from 'react-router-dom';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' };
  if (data.password.length < 3) {
    errors.msg = 'password too short';
    return errors;
  }
  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    // toast.error(error?.response?.data?.msg);
    errors.msg = error.response.data.msg;
    return errors;
  }
};

const Login = () => {
  const errors = useActionData();

  return (
    <Wrapper>
      <Form method="post" className="form">
        ...
        {errors && <p style={{ color: 'red' }}>{errors.msg}</p>}
        ...
      </Form>
    </Wrapper>
  );
};
export default Login;
```

#### Get Current User

Each route can define a "loader" function to provide data to the route element before it renders.

- must return a value

DashboardLayout.jsx

```jsx
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import customFetch from '../utils/customFetch';

export const loader = async () => {
  try {
    const { data } = await customFetch('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};


const DashboardLayout = ({ isDarkThemeEnabled }) => {
  const { user } = useLoaderData();

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
         ...
            <div className='dashboard-page'>
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;

```

#### Logout User

DashboardLayout.jsx

```js
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
  };
};
```
