import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Defines the validation rules for the form inputs using the Yup library
const opportunitySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  club: Yup.string().nullable(),
  country: Yup.string().required('Country is required'),
});

export default function OpportunityForm() {
  // Retrieves the current scout's data to ensure they are authorized to post
  const { currentScout } = useAuth();
  // Hook to redirect the user to the list page after a successful post
  const navigate = useNavigate();
  // State to store and display any error messages returned by the server
  const [error, setError] = useState(null);

  // Security check: kicks non-scouts out of the creation page immediately
  if (!currentScout) {
    navigate('/opportunities');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Post New Opportunity</h1>

      {/* Formik manages the form state, validation, and submission lifecycle */}
      <Formik
        initialValues={{
          title: '',
          club: '',
          country: '',
          // Automatically links the new post to the logged-in scout's ID
          scout_id: currentScout.id,   
        }}
        validationSchema={opportunitySchema}
        onSubmit={(values, { setSubmitting }) => {
          setError(null);
          // Sends the form data to the backend API to create the record
          fetch('http://127.0.0.1:5555/opportunities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
            .then(res => {
              // Checks if the server responded with an error status
              if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Failed to post'); });
              return res.json();
            })
            // Navigates back to the main directory once the save is successful
            .then(() => navigate('/opportunities'))
            .catch(err => {
              setError(err.message);
              // Re-enables the button so the user can try again after an error
              setSubmitting(false);
            });
        }}
      >
        {/* Render prop providing the current submission status of the form */}
        {({ isSubmitting }) => (
          <Form className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <div>
              <label className="block text-sm font-medium mb-2">Opportunity Title *</label>
              <Field name="title" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="Youth Academy Striker Position" />
              {/* Automatically displays validation errors if the field is empty or invalid */}
              <ErrorMessage name="title" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Club (optional)</label>
              <Field name="club" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="FC Barcelona Academy" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <Field name="country" className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="Spain" />
              <ErrorMessage name="country" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            {/* Passes the scout_id to the server without requiring user input */}
            <Field type="hidden" name="scout_id" />

            {/* Displays backend-specific errors like connection or database issues */}
            {error && <div className="text-red-400 text-center py-2">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            >
              {/* Changes button text to give visual feedback during the network request */}
              {isSubmitting ? 'Posting...' : 'Post Opportunity'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}