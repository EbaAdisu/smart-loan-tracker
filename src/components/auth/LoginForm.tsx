'use client';

import FormError from '@/components/ui/FormError';
import FormField from '@/components/ui/FormField';
import FormSubmitButton from '@/components/ui/FormSubmitButton';
import { authClient } from '@/lib/auth-client';
import {
  LoginFormData,
  loginSchema,
} from '@/lib/validation/schemas/authSchemas';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();

  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginFormData,
    { setSubmitting, setFieldError }: FormikHelpers<LoginFormData>
  ) => {
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const message = error.message || 'An error occurred during sign in';
        setFieldError('submit', message);
        toast.error(message);
      } else {
        toast.success('Signed in successfully');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      const message = 'An unexpected error occurred';
      setFieldError('submit', message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <FormField
              name="email"
              label="Email"
              type="email"
              required
              formik={formik}
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              required
              formik={formik}
            />

            <FormError formik={formik} />

            <FormSubmitButton formik={formik}>Sign In</FormSubmitButton>
          </form>
        )}
      </Formik>
    </>
  );
}
