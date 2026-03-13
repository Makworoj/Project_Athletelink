import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Defines the validation rules and error messages for the form fields
const athleteSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  sport: Yup.string().required('Sport is required'),
  country: Yup.string().required('Country is required'),
  age: Yup.number()
    .min(16, 'Must be at least 16 years old')
    .max(40, 'Must be under 40')
    .required('Age is required'),
  scout_id: Yup.number().nullable().integer('Must be a valid scout ID'),
});

export default function AthleteForm() {
  // Allows programmatically redirection to different routes after form submission
  const navigate = useNavigate();
  // Tracks server-side error messages to display them to the user
  const [error, setError] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Add New Athlete</h1>

      <Formik
        initialValues={{
          name: '',
          sport: '',
          country: '',
          age: '',
          scout_id: '',
        }}
        validationSchema={athleteSchema}
        onSubmit={(values, { setSubmitting }) => {
          setError(null);
          // Sends the validated form data to the backend API via a POST request
          fetch('http://127.0.0.1:5555/athletes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
            .then(res => {
              if (!res.ok) throw new Error('Failed to create athlete');
              return res.json();
            })
            .then(() => {
              // Sends the user back to the list view upon successful creation
              navigate('/athletes');
            })
            .catch(err => {
              setError(err.message);
              // Re-enables the submit button if the request fails
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              {/* Connects the input to Formik state automatically */}
              <Field
                name="name"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="John Doe"
              />
              {/* Renders validation errors specifically for the 'name' field */}
              <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sport *</label>
              <Field
                name="sport"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Football, Basketball, etc."
              />
              <ErrorMessage name="sport" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Field
                name="country"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Kenya"
              />
              <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age *</label>
              <Field
                name="age"
                type="number"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <ErrorMessage name="age" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Scout ID (optional)</label>
              <Field
                name="scout_id"
                type="number"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Leave blank if not assigned"
              />
              <ErrorMessage name="scout_id" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Conditionally renders server-side errors if the fetch fails */}
            {error && <div className="text-red-400 text-center py-2">{error}</div>}

            <button
              type="submit"
              // Prevents duplicate submissions while the request is in flight
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Athlete'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}