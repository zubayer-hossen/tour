import { useState } from 'react';
import { toast, Bounce } from "react-toastify";
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Register.css';
import {  baseUrlBackend } from '../environment/Environment';



const Register = () => {
  const [message, setMessage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Initially false (form is visible)

  const formik = useFormik({
    initialValues: { 
      name: '', 
      email: '', 
      phone: '', 
      tshirtSize: '', 
      feeStatus: 'Pending...' // ✅ Default value explicitly set
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      tshirtSize: Yup.string().required('Please select a T-Shirt size'),
      // ❌ Removed `feeStatus` from validation since it's hidden
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(`${baseUrlBackend}/api/users/register`, values);
        
        toast.success(`🦄 ${response.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        setIsSuccess(true); // ✅ Hide form and show download button
        setPdfFile(response.data.pdfFile);

      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data) {
          setMessage(error.response.data.message);

          toast.error(`🦄 ${error.response.data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });

        } else {
          toast.error(`❌ Registration failed! Please try again.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const downloadPDF = () => {
    if (!pdfFile) return;
    window.open(`${baseUrlBackend}/pdfs/${pdfFile}`, '_blank');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>🎟️ Tour Registration</h2>
        
        {/* ✅ Form hides after success */}
        {!isSuccess && (
          <form onSubmit={formik.handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" {...formik.getFieldProps('name')} />
            {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}

            <input type="email" name="email" placeholder="Your Email" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}

            <input type="tel" name="phone" placeholder="Your Phone" {...formik.getFieldProps('phone')} />
            {formik.touched.phone && formik.errors.phone && <p className="error">{formik.errors.phone}</p>}

            <select name="tshirtSize" {...formik.getFieldProps('tshirtSize')}>
              <option value="">Select T-Shirt Size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
            {formik.touched.tshirtSize && formik.errors.tshirtSize && <p className="error">{formik.errors.tshirtSize}</p>}

            {/* ✅ Hidden field for feeStatus (Default: "Pending...") */}
            <input type="hidden" name="feeStatus" value="Pending..." {...formik.getFieldProps('feeStatus')} />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Register Now'}
            </button>
          </form>
        )}

        {/* ✅ PDF Download Button (Only visible after success) */}
        {isSuccess && pdfFile && (
          <button onClick={downloadPDF}>📄 DOWNLOAD YOUR TOKEN</button>
        )}
      </div>
    </div>
  );
};

export default Register;
