#### HTTP Only Cookie

An HTTP-only cookie is a cookie that can't be accessed by JavaScript running in the browser. It is designed to help prevent cross-site scripting (XSS) attacks, which can be used to steal cookies and other sensitive information.

##### HTTP Only Cookie VS Local Storage

An HTTP-only cookie is a type of cookie that is designed to be inaccessible to JavaScript running in the browser. It is primarily used for authentication purposes and is a more secure way of storing sensitive information like user tokens. Local storage, on the other hand, is a browser-based storage mechanism that is accessible to JavaScript, and is used to store application data like preferences or user-generated content. While local storage is convenient, it is not a secure way of storing sensitive information as it can be accessed and modified by JavaScript running in the browser.

This line sets a cookie with the name "token" and a value of token, which is the JWT that was generated for the user. The ... represents an object containing additional options for the cookie.

httpOnly: true: This option makes the cookie inaccessible to JavaScript running in the browser. This helps to prevent cross-site scripting (XSS) attacks, which can be used to steal cookies and other sensitive information.

expires: new Date(Date.now() + oneDay): This option sets the expiration time for the cookie. In this case, the cookie will expire one day from the current time (as represented by Date.now() + oneDay).

secure: process.env.NODE_ENV === 'production': This option determines whether the cookie should be marked as secure or not. If the NODE_ENV environment variable is set to "production", then the cookie is marked as secure, which means it can only be transmitted over HTTPS. This helps to prevent man-in-the-middle (MITM) attacks, which can intercept and modify cookies that are transmitted over unsecured connections.

#### AddJob - Structure

pages/AddJob.jsx

```js
import { FormRow } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

const AddJob = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" />
          <FormRow type="text" name="company" />
          <FormRow type="text" labelText="job location" name="jobLocation" defaultValue={user.location} />

          <button type="submit" className="btn btn-block form-btn " disabled={isSubmitting}>
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddJob;
```

#### Select Input

```js
<div className="form-row">
  <label htmlFor="jobStatus" className="form-label">
    job status
  </label>
  <select name="jobStatus" id="jobStatus" className="form-select" defaultValue={JOB_TYPE.FULL_TIME}>
    {Object.values(JOB_TYPE).map((itemValue) => {
      return (
        <option key={itemValue} value={itemValue}>
          {itemValue}
        </option>
      );
    })}
  </select>
</div>
```

#### FormRowSelect Component

components/FormRowSelect.jsx

```js
const FormRowSelect = ({ name, labelText, list, defaultValue = '' }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select name={name} id={name} className="form-select" defaultValue={defaultValue}>
        {list.map((itemValue) => {
          return (
            <option key={itemValue} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
```

pages/AddJob.jsx

```js
<FormRowSelect
  labelText='job status'
  name='jobStatus'
  defaultValue={JOB_STATUS.PENDING}
  list={Object.values(JOB_STATUS)}
  />
<FormRowSelect
  name='jobType'
  labelText='job type'
  defaultValue={JOB_TYPE.FULL_TIME}
  list={Object.values(JOB_TYPE)}
  />
```

#### Create Job

AddJob.jsx

```js
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/jobs', data);
    toast.success('Job added successfully');
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
```

#### Pending Class and Redirect

wrappers/BigSidebar.js

```css
.pending {
  background: var(--background-color);
}
```

AddJob.jsx

```js
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/jobs', data);
    toast.success('Job added successfully');
    return redirect('all-jobs');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
```

#### Add Job - CSS(optional)

wrappers/DashboardFormPage.js

```js
import styled from 'styled-components';

const Wrapper = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background: var(--background-secondary-color);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  .form-title {
    margin-bottom: 2rem;
  }

  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 1rem;
  }
  .form-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export default Wrapper;
```

#### All Jobs - Structure

- create JobsContainer and SearchContainer (export)
- handle loader in App.jsx

```js
import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async ({ request }) => {
  try {
    const { data } = await customFetch.get('/jobs');
    return {
      data,
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data } = useLoaderData();

  return (
    <>
      <SearchContainer />
      <JobsContainer />
    </>
  );
};
export default AllJobs;
```

#### Setup All Jobs Context

```js
const AllJobsContext = createContext();

const AllJobs = () => {
  const { data } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);
```

#### Render Jobs

- create Job.jsx

JobsContainer.jsx

```js
import Job from './Job';
import Wrapper from '../assets/wrappers/JobsContainer';

import { useAllJobsContext } from '../pages/AllJobs';

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs } = data;
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </Wrapper>
  );
};

export default JobsContainer;
```

#### JobsContainer - CSS (optional)

wrappers/JobsContainer.js

```js
import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 1120px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
`;
export default Wrapper;
```

#### Dayjs

```sh
npm i dayjs@1.11.7
```

[Dayjs Docs](https://day.js.org/docs/en/installation/installation)

#### Job Component

- create JobInfo component

```js
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, jobStatus }) => {
  const date = day(createdAt).format('MMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>

        <footer className="actions">
          <Link className="btn edit-btn">Edit</Link>
          <Form>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
```

#### JobInfo Component

```js
import Wrapper from '../assets/wrappers/JobInfo';

const JobInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="job-icon">{icon}</span>
      <span className="job-text">{text}</span>
    </Wrapper>
  );
};

export default JobInfo;
```

#### JobInfo - CSS (optional)

wrappers/JobInfo.js

```js
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .job-icon {
    font-size: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    svg {
      color: var(--text-secondary-color);
    }
  }
  .job-text {
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
  }
`;
export default Wrapper;
```

#### Job - CSS (optional)

```js
import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--border-radius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      color: var(--text-secondary-color);
      letter-spacing: var(--letter-spacing);
    }
  }

  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: grid;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .status {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    width: 100px;
    height: 30px;
    display: grid;
    align-items: center;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
  .edit-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .edit-btn {
    margin-right: 0.5rem;
  }
`;

export default Wrapper;
```

#### Edit Job - Setup

Job.jsx

```js
<Link to={`../edit-job/${_id}`} className="btn edit-btn">
  Edit
</Link>
```

pages/EditJob.jsx

```js
import { FormRow, FormRowSelect } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async () => {
  return null;
};
export const action = async () => {
  return null;
};

const EditJob = () => {
  return <h1>EditJob Page</h1>;
};
export default EditJob;
```

- import EditJob page
  App.jsx

```js
import { loader as editJobLoader } from './pages/EditJob';
import { action as editJobAction } from './pages/EditJob';


{
  path: 'edit-job/:id',
  element: <EditJob />,
  loader: editJobLoader,
  action: editJobAction,
},
```

pages/EditJob.jsx

```js
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect('/dashboard/all-jobs');
  }
};
export const action = async () => {
  return null;
};

const EditJob = () => {
  const params = useParams();
  console.log(params);
  const { job } = useLoaderData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return <h1>EditJob Page</h1>;
};
export default EditJob;
```

#### Edit Job - Complete

```js
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success('Job edited successfully');
    return redirect('/dashboard/all-jobs');
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow type="text" labelText="job location" name="jobLocation" defaultValue={job.jobLocation} />

          <FormRowSelect name="jobStatus" labelText="job status" defaultValue={job.jobStatus} list={Object.values(JOB_STATUS)} />
          <FormRowSelect name="jobType" labelText="job type" defaultValue={job.jobType} list={Object.values(JOB_TYPE)} />
          <button type="submit" className="btn btn-block form-btn " disabled={isSubmitting}>
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
```

#### Delete Job

Job.jsx

```js
<Form method="post" action={`../delete-job/${_id}`}>
  <button type="submit" className="btn delete-btn">
    Delete
  </button>
</Form>
```

pages/DeleteJob.jsx

```js
import { redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export async function action({ params }) {
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success('Job deleted successfully');
  } catch (error) {
    toast.error(error.response.data.msg);
  }
  return redirect('/dashboard/all-jobs');
}
```

App.jsx

```js
import { action as deleteJobAction } from './pages/DeleteJob';

 { path: 'delete-job/:id', action: deleteJobAction },
```

#### Admin Page

pages/Admin.jsx

```js
import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';

import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';
export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    return response.data;
  } catch (error) {
    toast.error('You are not authorized to view this page');
    return redirect('/dashboard');
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();

  return (
    <Wrapper>
      <h2>admin page</h2>
    </Wrapper>
  );
};
export default Admin;
```

App.jsx

```js
import { loader as adminLoader } from './pages/Admin';

{
  path: 'admin',
  element: <Admin />,
  loader: adminLoader,
},

```

NavLinks.jsx

```js
{
  links.map((link) => {
    const { text, path, icon } = link;
    const { role } = user;
    if (role !== 'admin' && path === 'admin') return;
  });
}
```

#### StatItem Component

- create StatItem.jsx
- import/export

  StatItem.jsx

```js
import Wrapper from '../assets/wrappers/StatItem';

const StatItem = ({ count, title, icon, color, bcg }) => {
  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{count}</span>
        <span className="icon">{icon}</span>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};

export default StatItem;
```

Admin.jsx

```js
import { StatItem } from '../components';

const Admin = () => {
  const { users, jobs } = useLoaderData();

  return (
    <Wrapper>
      <StatItem title="current users" count={users} color="#e9b949" bcg="#fcefc7" icon={<FaSuitcaseRolling />} />
      <StatItem title="total jobs" count={jobs} color="#647acb" bcg="#e0e8f9" icon={<FaCalendarCheck />} />
    </Wrapper>
  );
};
export default Admin;
```

#### Admin - CSS (optional)

wrappers/StatsContainer.js

```js
import styled from 'styled-components';

const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1rem;
  }
`;
export default Wrapper;
```

wrappers/StatItem.js

```js
import styled from 'styled-components';

const Wrapper = styled.article`
  padding: 2rem;
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  border-bottom: 5px solid ${(props) => props.color};
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .count {
    display: block;
    font-weight: 700;
    font-size: 50px;
    color: ${(props) => props.color};
    line-height: 2;
  }
  .title {
    margin: 0;
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: left;
    margin-top: 0.5rem;
    font-size: 1.25rem;
  }
  .icon {
    width: 70px;
    height: 60px;
    background: ${(props) => props.bcg};
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 2rem;
      color: ${(props) => props.color};
    }
  }
`;

export default Wrapper;
```

#### Avatar Image

- get two images from pexels

[pexels](https://www.pexels.com/search/person/)

#### Setup Public Folder

server.js

```js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './public')));
```

- http://localhost:5100/imageName

#### Profile Page - Initial Setup

- remove jobs,users from DB
- add avatar property in the user model

models/UserModel.js

```js
const UserSchema = new mongoose.Schema({
  avatar: String,
  avatarPublicId: String,
});
```

#### Profile Page - Structure

pages/Profile.jsx

```js
import { FormRow } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { useNavigation, Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>

        <div className="form-center">
          <div className="form-row">
            <label htmlFor="image" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input type="file" id="avatar" name="avatar" className="form-input" accept="image/*" />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow type="text" labelText="last name" name="lastName" defaultValue={lastName} />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button className="btn btn-block form-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'submitting...' : 'save changes'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Profile;
```

#### Profile Page - Action

- import/export action (App.jsx)

```js
export const action = async ({ request }) => {
  const formData = await request.formData();

  const file = formData.get('avatar');
  if (file && file.size > 500000) {
    toast.error('Image size too large');
    return null;
  }

  try {
    await customFetch.patch('/users/update-user', formData);
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return null;
};
```

#### Update User - Server

```sh
npm i multer@1.4.5
```

Multer is a popular middleware package for handling multipart/form-data in Node.js web applications. It is commonly used for handling file uploads. Multer simplifies the process of accepting and storing files submitted through HTTP requests by providing an easy-to-use API. It integrates seamlessly with Express.js and allows developers to define upload destinations, file size limits, and other configurations.

- create middleware/multerMiddleware.js
- setup multer

```js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
});
const upload = multer({ storage });

export default upload;
```

routes/userRouter.js

```js
import upload from '../middleware/multerMiddleware.js';

router.patch('/update-user', upload.single('avatar'), validateUpdateUserInput, updateUser);
```

First, the multer package is imported.

Then, a storage object is created using multer.diskStorage(). This object specifies the configuration for storing uploaded files. In this case, the destination function determines the directory where the uploaded files will be saved, which is set to 'public/uploads'. The filename function defines the name of the uploaded file, which is set to the original filename.

Next, a multer middleware is created by passing the storage object as a configuration option. This multer middleware will be used to handle file uploads in the application.

In this case, upload is an instance of the Multer middleware that was created earlier. The .single() method is called on this instance to indicate that only one file will be uploaded. The argument 'avatar' specifies the name of the field in the HTTP request that corresponds to the uploaded file.

When this middleware is used in an HTTP route handler, it will process the incoming request and extract the file attached to the 'avatar' field. Multer will then save the file according to the specified storage configuration, which includes the destination directory and filename logic defined earlier. The uploaded file can be accessed in the route handler using req.file.

#### Cloudinary - Create Account/Get API Keys

[Cloudinary](https://cloudinary.com/)

Cloudinary is a cloud-based media management platform that helps businesses store, optimize, and deliver images and videos across the web. It provides developers with an easy way to upload, manipulate, and serve media assets, enabling faster and more efficient delivery of visual content on websites and applications. Cloudinary also offers features like automatic resizing, format conversion, and responsive delivery to ensure optimal user experiences across different devices and network conditions.

.env

```sh
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

#### Cloudinary - Setup Instance

```sh
npm i cloudinary@1.37.3
```

server

```js
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
```

#### Update User Controller

controllers/userController.js

```js
import cloudinary from 'cloudinary';
import { promises as fs } from 'fs';

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: 'update user' });
};
```

#### Logout Container

```js
{
  user.avatar ? <img src={user.avatar} alt="avatar" className="img" /> : <FaUserCircle />;
}
```

#### Submit Btn Component

- create component SubmitBtn (export/import)
- add all classes, including'.form-btn'
- setup in Register,Login, AddJob, EditJob, Profile
- make sure to add formBtn prop

```js
import { useNavigation } from 'react-router-dom';
const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <button type="submit" className={`btn btn-block ${formBtn && 'form-btn'}`} disabled={isSubmitting}>
      {isSubmitting ? 'submitting...' : 'submit'}
    </button>
  );
};
export default SubmitBtn;
```

#### Test User

- create test user
- feel free to use one of the chatGPT options

```json
{
  "name": "Zippy",
  "email": "test@test.com",
  "password": "secret123",
  "lastName": "ShakeAndBake",
  "location": "Codeville"
}
{
  "name": "Chuckleberry",
  "email": "test@test.com",
  "password": "secret123",
  "lastName": "Gigglepants",
  "location": "Laughterland"
}

{
  "name": "Bubbles McLaughster",
  "email": "test@test.com",
  "password": "secret123",
  "lastName": "Ticklebottom",
  "location": "Giggle City"
}


{
  "name": "Gigglesworth",
  "email": "test@test.com",
  "password": "secret123",
  "lastName": "Snickerdoodle",
  "location": "Chuckleburg"
}
```

#### Test User - Login Page

```js
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const loginDemoUser = async () => {
    const data = {
      email: 'test@test.com',
      password: 'secret123',
    };
    try {
      await customFetch.post('/auth/login', data);
      toast.success('take a test drive');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };
  return (
    <Wrapper>
      ...
        <button type='button' className='btn btn-block' onClick={loginDemoUser}>
          explore the app
        </button>
        ...
      </Form>
    </Wrapper>
  );
};
export default Login;
```

#### Test User - Restrict Access

authMiddleware

```js
import {
  BadRequestError,
} from '../errors/customErrors.js';

export const authenticateUser = (req, res, next) => {
  ...
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === 'testUserId';
    req.user = { userId, role, testUser };
    next();
  }
  ....
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!');
  }
  next();
};

```

- add to updateUser, createJob, updateJob, deleteJob

#### Mock Data

[Mockaroo ](https://www.mockaroo.com/)

```json
{
  "company": "Cogidoo",
  "position": "Help Desk Technician",
  "jobLocation": "Vyksa",
  "jobStatus": "pending",
  "jobType": "part-time",
  "createdAt": "2022-07-25T21:26:23Z"
}
```

- rename and save json in utils

#### Populate DB

- create populate.js
- setup for test user and admin

```js
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Job from './models/JobModel.js';
import User from './models/UserModel.js';
try {
  await mongoose.connect(process.env.MONGO_URL);
  // const user = await User.findOne({ email: 'john@gmail.com' });
  const user = await User.findOne({ email: 'test@test.com' });

  const jsonJobs = JSON.parse(await readFile(new URL('./utils/mockData.json', import.meta.url)));
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log('Success!!!');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
```

#### Stats - Setup

- create controller
- setup route and thunder client
- install/setup dayjs on the server

jobController.js

```js
import mongoose from 'mongoose';
import day from 'dayjs';

export const showStats = async (req, res) => {
  const defaultStats = {
    pending: 22,
    interview: 11,
    declined: 4,
  };

  let monthlyApplications = [
    {
      date: 'May 23',
      count: 12,
    },
    {
      date: 'Jun 23',
      count: 9,
    },
    {
      date: 'Jul 23',
      count: 3,
    },
  ];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
```

#### Stats - Complete Server Functionality

[MongoDB Docs](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)

The MongoDB aggregation pipeline is like a factory line for data. Data enters, it goes through different stages like cleaning, sorting, or grouping, and comes out at the end changed in some way. It's a way to process data inside MongoDB.

jobController.js

```js
export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
```

#### Commentary

```js
let stats = await Job.aggregate([
  { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
  { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
]);
```

let stats = await Job.aggregate([ ... ]); This line says we're going to perform an aggregation operation on the Job collection in MongoDB and save the result in a variable called stats. The await keyword is used to wait for the operation to finish before continuing, as the operation is asynchronous (i.e., it runs in the background).

{ $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } } This is the first stage of the pipeline. It filters the jobs so that only the ones created by the user specified by req.user.userId are passed to the next stage. The new mongoose.Types.ObjectId(req.user.userId) part converts req.user.userId into an ObjectId (which is the format MongoDB uses for ids).

{ $group: { _id: '$jobStatus', count: { $sum: 1 } } } This is the second stage of the pipeline. It groups the remaining jobs by their status (the jobStatus field). For each group, it calculates the count of jobs by adding 1 for each job ({ $sum: 1 }), and stores this in a field called count.

```js
let monthlyApplications = await Job.aggregate([
  { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      count: { $sum: 1 },
    },
  },
  { $sort: { '_id.year': -1, '_id.month': -1 } },
  { $limit: 6 },
]);
```

let monthlyApplications = await Job.aggregate([ ... ]); This line indicates that an aggregation operation will be performed on the Job collection in MongoDB. The result will be stored in the variable monthlyApplications. The await keyword ensures that the code waits for this operation to complete before proceeding, as it is an asynchronous operation.

{ $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } } This is the first stage of the pipeline. It filters the jobs to only those created by the user identified by req.user.userId.

{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } } This is the second stage of the pipeline. It groups the remaining jobs based on the year and month when they were created. For each group, it calculates the count of jobs by adding 1 for each job in the group.

{ $sort: { '\_id.year': -1, '\_id.month': -1 } } This is the third stage of the pipeline. It sorts the groups by year and month in descending order. The -1 indicates descending order. So it starts with the most recent year and month.

{ $limit: 6 } This is the fourth and last stage of the pipeline. It limits the output to the top 6 groups, after sorting. This is effectively getting the job count for the last 6 months.

So, monthlyApplications will be an array with up to 6 elements, each representing the number of jobs created by the user in a specific month and year. The array will be sorted by year and month, starting with the most recent.

#### Stats - Front-End Setup

- create four components
- StatsContainer and ChartsContainer (import/export)
- AreaChart, BarChart (local)

pages/Stats.jsx

```js
import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
export const loader = async () => {
  try {
    const response = await customFetch.get('/jobs/stats');
    return response.data;
  } catch (error) {
    return error;
  }
};

const Stats = () => {
  const { defaultStats, monthlyApplications } = useLoaderData();
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 0 && <ChartsContainer data={monthlyApplications} />}
    </>
  );
};
export default Stats;
```

#### Stats Container

```js
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import StatItem from './StatItem';
const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: 'pending applications',
      count: defaultStats?.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#f59e0b',
      bcg: '#fef3c7',
    },
    {
      title: 'interviews scheduled',
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: defaultStats?.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];
  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />;
      })}
    </Wrapper>
  );
};
export default StatsContainer;
```

#### ChartsContainer

```js
import { useState } from 'react';

import BarChart from './BarChart';
import AreaChart from './AreaChart';
import Wrapper from '../assets/wrappers/ChartsContainer';

const ChartsContainer = ({ data }) => {
  const [barChart, setBarChart] = useState(true);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
```

#### Charts

[recharts](https://recharts.org/en-US/)

- in the client

```sh
npm i recharts@2.5.0
```

#### Area Chart

```js
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const AreaChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#2cb1bc" fill="#bef8fd" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
```

#### Bar Chart

```js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3 " />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#2cb1bc" barSize={75} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
```

#### Charts CSS (optional)

wrappers/ChartsContainer.js

```js
import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;
  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500);
    font-size: 1.25rem;
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }
`;

export default Wrapper;
```

#### Get All Jobs - Server

jobController.js

Query parameters, also known as query strings or URL parameters, are used to pass information to a web server through the URL of a webpage. They are typically appended to the end of a URL after a question mark (?) and separated by ampersands (&). Query parameters consist of a key-value pair, where the key represents the parameter name and the value represents the corresponding data being passed. They are commonly used in web applications to provide additional context or parameters for server-side processing or to filter and sort data.

```js
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [{ position: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }];
  }
  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage: page, jobs });
};
```

#### Search Container

- setup log in AllJobs loader

```js
import { FormRow, FormRowSelect, SubmitBtn } from '.';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from '../../../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';

const SearchContainer = () => {
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          {/* search position */}

          <FormRow type="search" name="search" defaultValue="a" />
          <FormRowSelect labelText="job status" name="jobStatus" list={['all', ...Object.values(JOB_STATUS)]} defaultValue="all" />
          <FormRowSelect labelText="job type" name="jobType" list={['all', ...Object.values(JOB_TYPE)]} defaultValue="all" />
          <FormRowSelect name="sort" defaultValue="newest" list={[...Object.values(JOB_SORT_BY)]} />

          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
          {/* TEMP!!!! */}
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
```

#### All Jobs Loader

AllJobs.jsx

```js
import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
const AllJobsContext = createContext();
export const loader = async ({ request }) => {
  try {
    const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

    const { data } = await customFetch.get('/jobs', {
      params,
    });

    return {
      data,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};
export default AllJobs;

export const useAllJobsContext = () => useContext(AllJobsContext);
```

```js
const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
```

new URL(request.url): This creates a new URL object by passing the request.url to the URL constructor. The URL object provides various methods and properties to work with URLs.

.searchParams: The searchParams property of the URL object gives you access to the query parameters in the URL. It is an instance of the URLSearchParams class, which provides methods to manipulate and access the parameters.

.entries(): The entries() method of searchParams returns an iterator containing arrays of key-value pairs for each query parameter. Each array contains two elements: the parameter name and its corresponding value.

([...new URL(request.url).searchParams.entries()]): The spread operator ... is used to convert the iterator obtained from searchParams.entries() into an array. This allows us to pass the array to the Object.fromEntries() method.

Object.fromEntries(): This static method creates an object from an array of key-value pairs. It takes an iterable (in this case, the array of parameter key-value pairs) and returns a new object where the keys and values are derived from the iterable.

Putting it all together, the code retrieves the URL from the request.url property, extracts the search parameters using the searchParams property, converts them into an array of key-value pairs using entries(), and finally uses Object.fromEntries() to create an object with the parameter names as keys and their corresponding values. The resulting object, params, contains all the search parameters from the URL.

#### Submit Form Programmatically

- setup default values from the context
- remove SubmitBtn
- add onChange to FormRow, FormRowSelect and all inputs

SearchContainer.js

```js
import { FormRow, FormRowSelect } from '.';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from '../../../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';
const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;

  const submit = useSubmit();

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          {/* search position */}

          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={['all', ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            defaultValue={jobType}
            list={['all', ...Object.values(JOB_TYPE)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
```

#### Debounce

[JS Nuggets - Debounce](https://youtu.be/tYx6pXdvt1s)

In JavaScript, debounce is a way to limit how often a function gets called. It helps prevent rapid or repeated function executions by introducing a delay. This is useful for tasks like handling user input, where you want to wait for a pause before triggering an action to avoid unnecessary processing.

```js
const debounce = (onChange) => {
  let timeout;
  return (e) => {
    const form = e.currentTarget.form;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChange(form);
    }, 2000);
  };
};
<FormRow
  type="search"
  name="search"
  defaultValue={search}
  onChange={debounce((form) => {
    submit(form);
  })}
/>;
```

#### Pagination - Setup

- create PageBtnContainer

JobsContainer.jsx

```js
import Job from './Job';
import Wrapper from '../assets/wrappers/JobsContainer';
import PageBtnContainer from './PageBtnContainer';
import { useAllJobsContext } from '../pages/AllJobs';

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs, totalJobs, numOfPages } = data;
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
```

#### Basic PageBtnContainer

```js
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const pages = Array.from({ length: numOfPages }, (_, index) => index + 1);

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
        }}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => (
          <button className={`btn page-btn ${pageNumber === currentPage && 'active'}`} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
```

#### Complex - PageBtnContainer

```js
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button className={`btn page-btn ${activeClass && 'active'}`} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons = [];

    // Add the first page button
    pageButtons.push(addPageButton({ pageNumber: 1, activeClass: currentPage === 1 }));
    // Add the dots before the current page if there are more than 3 pages
    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ....
        </span>
      );
    }
    // one before current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(addPageButton({ pageNumber: currentPage - 1, activeClass: false }));
    }

    // Add the current page button
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(addPageButton({ pageNumber: currentPage, activeClass: true }));
    }

    // one after current page
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(addPageButton({ pageNumber: currentPage + 1, activeClass: false }));
    }
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className=" page-btn dots" key="dots+1">
          ....
        </span>
      );
    }

    // Add the last page button
    pageButtons.push(
      addPageButton({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages,
      })
    );

    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className="prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
        }}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">{renderPageButtons()}</div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
```

#### PageBtnContainer CSS (optional)

wrappers/PageBtnContainer.js

```js
import styled from 'styled-components';

const Wrapper = styled.section`
  height: 6rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  .btn-container {
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    display: flex;
  }
  .page-btn {
    background: transparent;
    border-color: transparent;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    border-radius: var(--border-radius);
    cursor:pointer:
  }
  .active{
    background:var(--primary-500);
        color: var(--white);

  }
  .prev-btn,.next-btn{
    background: var(--background-secondary-color);
    border-color: transparent;
        border-radius: var(--border-radius);

    width: 100px;
    height: 40px;
        color: var(--primary-500);
text-transform:capitalize;
letter-spacing:var(--letter-spacing);
display:flex;
align-items:center;
justify-content:center;
gap:0.5rem;
cursor:pointer;
  }
  .prev-btn:hover,.next-btn:hover{
    background:var(--primary-500);
        color: var(--white);
        transition:var(--transition);
  }
.dots{
  display:grid;
  place-items:center;
  cursor:text;
}
`;
export default Wrapper;
```

#### Local Build

- remove default values from inputs in Register and Login
- navigate to client and build front-end

```sh
cd client && npm run build
```

- copy/paste all the files/folders

  - from client/dist
  - to server(root)/public

- in server.js point to index.html

```js
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});
```

#### Deploy On Render

[Render](https://render.com/)

- sign up of for account
- create git repository

#### Build Front-End on Render

- add script
- change path

package.json

```js
 "scripts": {
    "setup-production-app": "npm i && cd client && npm i && npm run build",
  },
```

server.js

```js
app.use(express.static(path.resolve(__dirname, './client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});
```

#### Test Locally

- remove client/dist and client/node_modules
- remove node_modules and package-lock.json (optional)
- run "npm run setup-production-app", followed by "node server"

#### Test in Production

- change build command on render

```sh
npm run setup-production-app
```

- push up to github

#### Upload Image As Buffer

- remove public folder

```sh
npm i datauri@4.1.0
```

middleware/multerMiddleware.js

```js
import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
```

controller/userController.js

```js
import { formatImage } from '../middleware/multerMiddleware.js';

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: 'update user' });
};
```

#### Setup Global Loading

- create loading component (import/export)
- check for loading in DashboardLayout page

components/Loading.jsx

```js
const Loading = () => {
  return <div className="loading"></div>;
};

export default Loading;
```

DashboardLayout.jsx

```js
import { useNavigation } from 'react-router-dom';
import { Loading } from '../components';

const DashboardLayout = ({ isDarkThemeEnabled }) => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';

  return (
    <Wrapper>
      ...
      <div className="dashboard-page">{isPageLoading ? <Loading /> : <Outlet context={{ user }} />}</div>
      ...
    </Wrapper>
  );
};
```

#### React Query

React Query is a powerful library that simplifies data fetching, caching, and synchronization in React applications. It provides a declarative and intuitive way to manage remote data by abstracting away the complex logic of fetching and caching data from APIs. React Query offers features like automatic background data refetching, optimistic updates, pagination support, and more, making it easier to build performant and responsive applications that rely on fetching and manipulating data.

[React Query Docs](https://tanstack.com/query/v4/docs/react/overview)

- in the client

```sh
npm i @tanstack/react-query@4.29.5 @tanstack/react-query-devtools@4.29.6
```

App.jsx

```js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

#### Page Error Element

- create components/ErrorElement

```js
import { useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.log(error);
  return <h4>There was an error...</h4>;
};
export default ErrorElement;
```

Stats.jsx

```js
export const loader = async () => {
  const response = await customFetch.get('/jobs/stats');
  return response.data;
};
```

App.jsx

```js
{
  path: 'stats',
  element: <Stats />,
  loader: statsLoader,
  errorElement: <h4>There was an error...</h4>
},
```

```js
{
  path: 'stats',
  element: <Stats />,
  loader: statsLoader,
  errorElement: <ErrorElement />,
},
```

#### First Query

- navigate to stats

Stats.jsx

```js
import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const loader = async () => {
  return null;
};

const Stats = () => {
  const response = useQuery({
    queryKey: ['stats'],
    queryFn: () => customFetch.get('/jobs/stats'),
  });
  console.log(response);
  if (response.isLoading) {
    return <h1>Loading...</h1>;
  }
  return <h1>react query</h1>;
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && <ChartsContainer data={monthlyApplications} />}
    </>
  );
};
export default Stats;
```

```js
const data = useQuery({
  queryKey: ['stats'],
  queryFn: () => customFetch.get('/jobs/stats'),
});
```

const data = useQuery({ ... });: This line declares a constant variable named data and assigns it the result of the useQuery hook. The useQuery hook is provided by React Query and is used to perform data fetching.

queryKey: ['stats'],: The queryKey property is an array that serves as a unique identifier for the query. In this case, the query key is set to ['stats'], indicating that this query is fetching statistics related to jobs.

queryFn: () => customFetch.get('/jobs/stats'),: The queryFn property specifies the function that will be executed when the query is triggered. In this case, it uses an arrow function that calls customFetch.get('/jobs/stats'). The customFetch object is likely a custom wrapper around the fetch function or an external HTTP client library, used to make the actual API request to retrieve job statistics.In React Query, the queryFn property expects a function that returns a promise. The promise should resolve with the data you want to fetch and store in the query cache.

customFetch.get('/jobs/stats'): This line is making an HTTP GET request to the /jobs/stats endpoint, which is the API route that provides the job statistics data.

#### Get Stats with React Query

```js
const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    const response = await customFetch.get('/jobs/stats');
    return response.data;
  },
};

export const loader = async () => {
  return null;
};

const Stats = () => {
  const { isLoading, isError, data } = useQuery(statsQuery);

  if (isLoading) return <h4>Loading...</h4>;
  if (isError) return <h4>Error...</h4>;
  // after loading/error or ?.
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && <ChartsContainer data={monthlyApplications} />}
    </>
  );
};
export default Stats;
```

#### React Query in Stats Loader

App.jsx

```js
{
  path: 'stats',
  element: <Stats />,
  loader: statsLoader(queryClient),
  errorElement: <ErrorElement />,
},
```

Stats.jsx

```js
import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    const response = await customFetch.get('/jobs/statss');
    return response.data;
  },
};

export const loader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
};

const Stats = () => {
  const { data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && <ChartsContainer data={monthlyApplications} />}
    </>
  );
};
export default Stats;
```

#### React Query for Current User

DashboardLayout.jsx

```js
const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/users/current-user');
    return data;
  },
};

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

const Dashboard = ({ prefersDarkMode, queryClient }) => {
  const { user } = useQuery(userQuery)?.data;
};
```

#### Invalidate Queries

Login.jsx

```js
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await axios.post('/api/v1/auth/login', data);
      queryClient.invalidateQueries();
      toast.success('Login successful');
      return redirect('/dashboard');
    } catch (error) {
      toast.error(error.response.data.msg);
      return error;
    }
  };
```

DashboardLayout.jsx

```js
const logoutUser = async () => {
  navigate('/');
  await customFetch.get('/auth/logout');
  queryClient.invalidateQueries();
  toast.success('Logging out...');
};
```

Profile.jsx

```js
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('avatar');
    if (file && file.size > 500000) {
      toast.error('Image size too large');
      return null;
    }
    try {
      await customFetch.patch('/users/update-user', formData);
      queryClient.invalidateQueries(['user']);
      toast.success('Profile updated successfully');
      return redirect('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return null;
    }
  };
```

#### All Jobs Query

AllJobs.jsx

```js
import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
const AllJobsContext = createContext();

const allJobsQuery = (params) => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: ['jobs', search ?? '', jobStatus ?? 'all', jobType ?? 'all', sort ?? 'newest', page ?? 1],
    queryFn: async () => {
      const { data } = await customFetch.get('/jobs', {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

    await queryClient.ensureQueryData(allJobsQuery(params));
    return { searchValues: { ...params } };
  };

const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};
export default AllJobs;

export const useAllJobsContext = () => useContext(AllJobsContext);
```

#### Invalidate Jobs

AddJob.jsx

```js
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post('/jobs', data);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job added successfully ');
      return redirect('all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
```

EditJob.jsx

```js
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/jobs/${params.id}`, data);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job edited successfully');
      return redirect('/dashboard/all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
```

DeleteJob.jsx

```js
export const action =
  (queryClient) =>
  async ({ params }) => {
    try {
      await customFetch.delete(`/jobs/${params.id}`);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    return redirect('/dashboard/all-jobs');
  };
```

#### Edit Job Loader

```js
import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useParams } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const singleJobQuery = (id) => {
  return {
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`);
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleJobQuery(params.id));
      return params.id;
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return redirect('/dashboard/all-jobs');
    }
  };

export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/jobs/${params.id}`, data);
      queryClient.invalidateQueries(['jobs']);

      toast.success('Job edited successfully');
      return redirect('/dashboard/all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const EditJob = () => {
  const id = useLoaderData();

  const {
    data: { job },
  } = useQuery(singleJobQuery(id));

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow type="text" name="jobLocation" labelText="job location" defaultValue={job.jobLocation} />
          <FormRowSelect name="jobStatus" labelText="job status" defaultValue={job.jobStatus} list={Object.values(JOB_STATUS)} />
          <FormRowSelect name="jobType" labelText="job type" defaultValue={job.jobType} list={Object.values(JOB_TYPE)} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;
```

#### Axios Interceptors

DashboardLayout.jsx

```js
const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled }) => {
  const [isAuthError, setIsAuthError] = useState(false);

  const logoutUser = async () => {
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
    navigate('/');
  };

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);
  return (
    ...
  )
};

```

#### Security

```sh
npm install helmet express-mongo-sanitize express-rate-limit

```

Package: helmet
Description: helmet is a security package for Express.js applications that helps protect them by setting various HTTP headers to enhance security, prevent common web vulnerabilities, and improve overall application security posture.
Need: The package is needed to safeguard web applications from potential security threats, such as cross-site scripting (XSS) attacks, clickjacking, and other security exploits.

Package: express-mongo-sanitize
Description: express-mongo-sanitize is a middleware for Express.js that sanitizes user-supplied data coming from request parameters, body, and query strings to prevent potential NoSQL injection attacks on MongoDB databases.
Need: The package addresses the need to protect MongoDB databases from malicious attempts to manipulate data and helps ensure the integrity of data storage and retrieval.

Package: express-rate-limit
Description: express-rate-limit is an Express.js middleware that helps control and limit the rate of incoming requests from a specific IP address or a set of IP addresses to protect the server from abuse, brute-force attacks, and potential denial-of-service (DoS) attacks.
Need: This package is necessary to manage and regulate the number of requests made to the server within a given time frame, preventing excessive usage and improving the overall stability and performance of the application.

server.js

```js
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

app.use(helmet());
app.use(mongoSanitize());
```

routes/authRouter.js

```js
import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});
router.post('/register', apiLimiter, validateRegisterInput, register);
router.post('/login', apiLimiter, validateLoginInput, login);
```
