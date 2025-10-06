'use client';

import FormError from '@/components/ui/FormError';
import FormField from '@/components/ui/FormField';
import FormSubmitButton from '@/components/ui/FormSubmitButton';
import { authClient } from '@/lib/auth-client';
import {
  RegisterFormData,
  registerSchema,
} from '@/lib/validation/schemas/authSchemas';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();

  const initialValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting, setFieldError }: FormikHelpers<RegisterFormData>
  ) => {
    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        const message =
          error.message || 'An error occurred during registration';
        setFieldError('submit', message);
        toast.error(message);
      } else {
        toast.success('Account created successfully');
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
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <FormField
              name="name"
              label="Name"
              type="text"
              required
              formik={formik}
            />

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

            <FormSubmitButton formik={formik}>Create Account</FormSubmitButton>
          </form>
        )}
      </Formik>
    </>
  );
}
