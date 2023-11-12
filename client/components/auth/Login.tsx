'use client';
import { Route } from '@/@types/type';
import { styles } from '@/app/styles/style';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { cn } from '@/utils/utils';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import * as Yup from 'yup';

interface LoginProps {
  setRoute: (route: Route) => void;
  setOpen: (value: boolean) => void;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: Yup.string().required('Please enter your password').min(6),
});
const Login: React.FC<LoginProps> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error, data }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });
  useEffect(() => {
    if (isSuccess) {
      toast.success('Login success fully');
      setOpen(false);
    }
    if (error) {
      console.log('❄️ ~ file: Login.tsx:44 ~ error:', error);
      console.log('status' in error);
      console.log('❄️ ~ file: Login.tsx:45 ~ error:', error);
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, []);
  /* rtk query */
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full">
      <h1 className={cn(styles.title)}>Login with E-Learning</h1>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="email"
          className={cn(
            'text-[16px] font-Poppins text-black dark:text-white',
            styles.label,
          )}
        >
          Enter your Email
        </label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="Enter your email"
          className={cn(
            styles.input,
            errors.email && touched.email && 'border-red-500',
          )}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label
            htmlFor="password"
            className={cn(styles.label)}
          >
            Enter your password
          </label>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={cn(
              styles.input,
              errors.password && touched.password && 'border-red-500',
            )}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>
        <div className="w-full mt-5">
          <input
            type="submit"
            value={'Login'}
            className={styles.button}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle
            size={30}
            className="cursor-pointer mr-2"
          />
          <AiFillGithub
            size={30}
            className="cursor-pointer ml-2"
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] ">
          Not have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute('Sign-Up')}
          >
            Sign up
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};
export default Login;
