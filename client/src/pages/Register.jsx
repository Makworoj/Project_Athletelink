// redeploy trigger
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Register() {
  const { loginAthlete, loginScout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [role, setRole] = useState(null); 
  const [errorMsg, setErrorMsg] = useState('');

  // Base schema (common fields)
  const baseSchema = {
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    country: Yup.string().required('Country is required'),
  };

  // Role-specific schema
  const validationSchema = Yup.object(
    role === 'athlete'
      ? {
          ...baseSchema,
          sport: Yup.string().required('Sport is required'),
          age: Yup.number().min(16, 'Must be at least 16').required('Age is required'),
        }
      : {
          ...baseSchema,
          organization: Yup.string().nullable(),
        }
  );

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMsg('');
    const endpoint = role === 'athlete' ? 'athletes' : 'scouts';

    try {
      const res = await fetch(`https://project-athletelink.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }

      const newUser = await res.json();

      // Auto-login
      if (role === 'athlete') loginAthlete(newUser);
      else loginScout(newUser);

      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">
          {step === 1 ? 'Register' : `Register as ${role === 'athlete' ? 'Athlete' : 'Scout'}`}
        </h1>

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-slate-300 mb-6">I am a:</p>
            <button
              onClick={() => handleRoleSelect('athlete')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-lg font-medium text-lg"
            >
              Athlete
            </button>
            <button
              onClick={() => handleRoleSelect('scout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-lg font-medium text-lg"
            >
              Scout
            </button>
            <p className="text-slate-400 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-400 hover:text-emerald-300">
                Login
              </a>
            </p>
          </div>
        )}

        {step === 2 && (
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              country: '',
              ...(role === 'athlete'
                ? { sport: '', age: '' }
                : { organization: '' }),
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6 text-left">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <Field
                    name="name"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {role === 'athlete' && (
                  <>
                    <div>
                      <label className="block text-sm mb-2">Sport</label>
                      <Field
                        name="sport"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                      />
                      <ErrorMessage name="sport" component="div" className="text-red-400 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Age</label>
                      <Field
                        name="age"
                        type="number"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                      />
                      <ErrorMessage name="age" component="div" className="text-red-400 text-sm mt-1" />
                    </div>
                  </>
                )}

                {role === 'scout' && (
                  <div>
                    <label className="block text-sm mb-2">Organization (optional)</label>
                    <Field
                      name="organization"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2">Country</label>
                  <Field
                    name="country"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                  />
                  <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm mb-2">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {errorMsg && <div className="text-red-400 text-center py-2">{errorMsg}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 2 && (
          <button
            onClick={() => {
              setStep(1);
              setRole(null);
            }}
            className="text-emerald-400 hover:text-emerald-300 mt-6 block mx-auto"
          >
            ← Back to role selection
          </button>
        )}
      </div>
    </div>
  );
}