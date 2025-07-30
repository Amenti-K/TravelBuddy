import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { login as loginAction } from "../../store/slices/authSlice";
import { login } from "../../Api/auth.api";
import { authValidationSchema } from "../../validations/auth.validation";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLoginSubmit = async (values) => {
    console.log(values);
    try {
      const { user_profile, token, haveProfile } = await login(
        values.email,
        values.password
      );
      dispatch(login({ user_profile, token }));
      haveProfile ? navigate("/profile/confirmation") : navigate("/profile");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={authValidationSchema}
          onSubmit={() => {
            handleLoginSubmit(values, { setSubmitting, setErrors });
          }}
        >
          {({ isSubmitting, errors, values }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>

              <button
                type="button"
                onClick={() => handleLoginSubmit(values)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Logging In..." : "Log In"}
              </button>

              {errors.general && (
                <div className="text-sm text-center text-red-600">
                  {errors.general}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
