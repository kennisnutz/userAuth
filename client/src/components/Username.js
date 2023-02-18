import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';

function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);
  // const username = useAuthStore((state) => state.auth.username);

  useEffect(() => {
    // console.log(username);
  });
  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate('/password');
    },
  });
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold"> Welcome</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Connect with us and start exploring
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img className={styles.profile_img} src={avatar} alt="avatar" />
            </div>
            <div className="textbox flex flex-col items-center py-4">
              <input
                {...formik.getFieldProps('username')}
                type="text"
                className={styles.textbox}
                placeholder="Username"
              />
              <button className={styles.btn} type="submit">
                Lets Go
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not signed up?{' '}
                <Link className="text-red-500" to="/register">
                  Register Now!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Username;
