'use client';
import * as Yup from 'yup';
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { Route } from '@/@types/type';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { cn } from '@/utils/utils';
import { styles } from '@/app/styles/style';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

interface SignUpProps {
  setRoute: (route: Route) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: Yup.string().required('Please enter your password').min(6),
});
const SignUp: React.FC<SignUpProps> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { isError, data, isSuccess, error }] = useRegisterMutation();
  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || 'Registration successful';
      toast.success(message);
      setRoute('Verification');
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });
  /* rtk query */
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full">
      <h1 className={cn(styles.title)}>Join to E-Learning</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="name"
            className={cn(styles.label)}
          >
            Enter your Name
          </label>
          <input
            type="text"
            name=""
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Enter your name"
            className={cn(
              styles.input,
              errors.name && touched.name && 'border-red-500',
            )}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        <label
          htmlFor="email"
          className={cn(styles.label)}
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
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input
            type="submit"
            value={'Sign Up'}
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
          Already have an account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute('Sign-Up')}
          >
            Sign in
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};
export default SignUp;
