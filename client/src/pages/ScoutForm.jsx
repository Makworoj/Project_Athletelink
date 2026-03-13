import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define the validation schema to ensure name and country are always provided
const scoutSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  organization: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
});

export default function ScoutForm() {
  // Hook used to send the user back to the scout directory after successful creation
  const navigate = useNavigate();
  // Local state to capture and display server-side errors
  const [error, setError] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Add New Scout</h1>

      {/* Formik handles the form lifecycle, including values, validation, and submission */}
      <Formik
        initialValues={{
          name: '',
          organization: '',
          country: '',
        }}
        validationSchema={scoutSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Reset error state before attempting a new submission
          setError(null);
          
          // Send the new scout data to the backend via a POST request
          fetch('http://127.0.0.1:5555/scouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
            .then(res => {
              // Trigger an error if the server response is not in the 200-299 range
              if (!res.ok) throw new Error('Failed to create scout');
              return res.json();
            })
            .then(() => {
              // Redirect the user to the scouts list page upon success
              navigate('/scouts');
            })
            .catch(err => {
              // Store the error message to display it in the UI
              setError(err.message);
              // Re-enable the submit button so the user can fix issues and try again
              setSubmitting(false);
            });
        }}
      >
        {/* Render prop function to access the current submission state */}
        {({ isSubmitting }) => (
          <Form className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Field
                name="name"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                placeholder="Alex Rivera"
              />
              {/* Displays validation errors for the 'name' field automatically */}
              <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization (optional)</label>
              <Field
                name="organization"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                placeholder="Global Talent Scouts"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Field
                name="country"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
                placeholder="United States"
              />
              <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Visual feedback for API-level errors */}
            {error && <div className="text-red-400 text-center py-2 font-medium">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Dynamic button text based on the submission status */}
              {isSubmitting ? 'Creating...' : 'Create Scout'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}