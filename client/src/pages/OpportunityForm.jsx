import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const opportunitySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  club: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
  scout_id: Yup.number().required('Scout ID is required').integer('Must be a valid scout ID'),
});

export default function OpportunityForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Post New Opportunity</h1>

      <Formik
        initialValues={{
          title: '',
          club: '',
          country: '',
          scout_id: '',
        }}
        validationSchema={opportunitySchema}
        onSubmit={(values, { setSubmitting }) => {
          setError(null);
          fetch('http://127.0.0.1:5555/opportunities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
            .then(res => {
              if (!res.ok) throw new Error('Failed to create opportunity');
              return res.json();
            })
            .then(() => {
              navigate('/opportunities');
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
              <label className="block text-sm font-medium mb-2">Opportunity Title *</label>
              <Field
                name="title"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Youth Academy Striker Position"
              />
              <ErrorMessage name="title" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Club (optional)</label>
              <Field
                name="club"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="FC Barcelona Academy"
              />
              <ErrorMessage name="club" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Field
                name="country"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Spain"
              />
              <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Scout ID *</label>
              <Field
                name="scout_id"
                type="number"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Enter scout ID"
              />
              <ErrorMessage name="scout_id" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {error && <div className="text-red-400 text-center py-2">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Opportunity'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}