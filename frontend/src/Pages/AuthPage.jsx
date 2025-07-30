import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../store/slices/authSlice";
import { login, sendOtp, verifyOtp } from "../Api/auth.api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../validations/auth.validation";
import "../styles/auth.css";

const AuthPage = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  // Store form values safely in a ref instead of DOM
  const signupFormRef = useRef({
    email: "",
    phoneNumber: "",
    password: "",
    userType: "solo_traveler",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Separate initial values for login and signup
  const loginInitialValues = {
    email: "",
    password: "",
  };

  const signupInitialValues = {
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: "solo_traveler",
    otp: "",
  };

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    setErrors({});
    try {
      const response = await login(values.email, values.password);
      console.log("response: ", response);
      if (response && response.token) {
        dispatch(logoutAction());
        dispatch(
          loginAction({
            user_profile: response.user_profile,
            token: response.token,
          })
        );
        response.haveProfile
          ? navigate("/discover")
          : response.user_profile.user_type === "solo_traveler"
          ? navigate("/profile-solo")
          : navigate("/profile-agency");
      } else {
        setErrors({});
        setErrors({
          general: response?.message || "Invalid login response from server",
        });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (values, { setSubmitting, setErrors }) => {
    setErrors({});
    try {
      // Store form values in ref for OTP verification
      signupFormRef.current = {
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        userType: values.userType,
      };

      const res = await sendOtp(
        values.email,
        values.phoneNumber,
        values.password,
        values.confirmPassword,
        values.userType
      );
      if (res.success) setShowOtpPopup(true);
      else {
        console.log("else res from auth: ", res);
        setErrors({
          general: res.message || "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting, setErrors }) => {
    setErrors({});
    try {
      const { email, phoneNumber, password, userType } = signupFormRef.current;
      const response = await verifyOtp(
        values.otp,
        email,
        phoneNumber,
        password,
        userType
      );
      console.log(response);
      if (response && response.token) {
        dispatch(logoutAction());
        dispatch(
          loginAction({
            user_profile: response.user_profile,
            token: response.token,
          })
        );
        setShowOtpPopup(false);

        const newUserType = response.user_profile.user_type;
        if (newUserType === "solo_traveler") {
          navigate("/profile");
        } else if (newUserType === "agency") {
          navigate("/profile-agency");
        } else {
          console.warn("Unknown user type:", newUserType);
        }
      } else {
        setErrors({
          general: "Invalid login response from server",
        });
      }
    } catch (error) {
      setErrors({
        otp:
          error.response?.data?.message || "Incorrect OTP. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-signup min-h-full">
      <div
        className={`container ${isSignUpActive ? "active" : ""}`}
        id="container"
      >
        {/* Sign-up form */}
        <div className="form-container sign-up">
          <Formik
            initialValues={signupInitialValues}
            validationSchema={signupValidationSchema}
            onSubmit={handleSignUpSubmit}
          >
            {({ isSubmitting, values, setFieldValue, errors }) => (
              <Form>
                <h1>Sign-up</h1>
                <div className="input-group">
                  <Field type="email" name="email" placeholder="Email" />
                  <ErrorMessage
                    name="email"
                    component="span"
                    className="error-message"
                  />
                </div>
                <div className="input-group">
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="span"
                    className="error-message"
                  />
                </div>
                <div className="input-group">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="error-message"
                  />
                </div>
                <div className="input-group">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="span"
                    className="error-message"
                  />
                </div>
                <select
                  name="userType"
                  value={values.userType}
                  onChange={(e) => setFieldValue("userType", e.target.value)}
                >
                  <option value="solo_traveler">Solo Traveler</option>
                  <option value="agency">Agency</option>
                </select>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
                {errors.general && (
                  <div className="form-error-message">{errors.general}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        {/* Login form */}
        <div className="form-container sign-in">
          <Formik
            initialValues={loginInitialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleLoginSubmit}
          >
            {({ isSubmitting, errors, handleSubmit }) => (
              <Form>
                <h1>Log-In</h1>
                <div className="input-group">
                  <Field type="email" name="email" placeholder="Email" />
                  <ErrorMessage
                    name="email"
                    component="span"
                    className="error-message"
                  />
                </div>
                <div className="input-group">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="error-message"
                  />
                </div>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging In..." : "Enter"}
                </button>
                {errors.general && (
                  <div className="form-error-message">{errors.general}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome !!</h1>
              <p>Log in to an existing account</p>
              <button onClick={() => setIsSignUpActive(false)}>Log-in</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello !!</h1>
              <p>Create a new account</p>
              <button onClick={() => setIsSignUpActive(true)}>Sign-up</button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP popup */}
      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup">
            <h2>Enter OTP</h2>
            <p>Please check your email for the OTP code.</p>
            <Formik
              initialValues={{ otp: "" }}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  // Use the stored form values from ref
                  const { email, phoneNumber, password, userType } =
                    signupFormRef.current;

                  const result = await verifyOtp(
                    values.otp,
                    email,
                    phoneNumber,
                    password,
                    userType
                  );
                  dispatch(logoutAction());
                  dispatch(
                    loginAction({
                      user_id: result.user_id,
                      token: result.token,
                      userType: result.user_type,
                    })
                  );
                  setShowOtpPopup(false);
                  navigate("/profile");
                } catch (error) {
                  setErrors({
                    otp: error.response?.data?.message || "Invalid OTP",
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, values, setFieldValue }) => (
                <Form>
                  <Field type="text" name="otp" placeholder="Enter OTP" />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="error-message"
                  />
                  {errors.otp && (
                    <div className="error-message">{errors.otp}</div>
                  )}
                  <div className="otp-buttons">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() =>
                        handleVerifyOtp(values, {
                          setSubmitting: (submitting) =>
                            setFieldValue("isSubmitting", submitting),
                          setErrors: (errors) =>
                            setFieldValue("errors", errors),
                        })
                      }
                    >
                      {isSubmitting ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpPopup(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
