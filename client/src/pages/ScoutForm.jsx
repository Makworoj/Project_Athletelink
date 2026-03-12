import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const scoutSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  organization: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
});

export default function ScoutForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Add New Scout</h1>

      <Formik
        initialValues={{
          name: '',
          organization: '',
          country: '',
        }}
        validationSchema={scoutSchema}
        onSubmit={(values, { setSubmitting }) => {
          setError(null);
          fetch('http://127.0.0.1:5555/scouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
            .then(res => {
              if (!res.ok) throw new Error('Failed to create scout');
              return res.json();
            })
            .then(() => {
              navigate('/scouts');
            })
            .catch(err => {
              setError(err.message);
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Field
                name="name"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Alex Rivera"
              />
              <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization (optional)</label>
              <Field
                name="organization"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Global Talent Scouts"
              />
              <ErrorMessage name="organization" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Field
                name="country"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="United States"
              />
              <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {error && <div className="text-red-400 text-center py-2">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Scout'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}