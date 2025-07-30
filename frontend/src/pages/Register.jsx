import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        address: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();


  return (
    <>
    <div className="auth-wrap">
    <div className="auth-container">
      <h2 className='auth-title'>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
      <input type="text" placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
      <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
      <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </div>
    </>
  );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { username, email, password, age, gender, address, phone } = formData;
        
        if (!username || !email || !password || !age || !gender || !address || !phone) {
            return "Please fill in all fields";
        }
        
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        
        if (isNaN(age) || age < 1 || age > 120) {
            return "Please enter a valid age";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        
        // Basic phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone) || phone.length < 10) {
            return "Please enter a valid phone number";
        }
        
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        if (!agreeTerms) {
          setError("Please agree to the Terms of Use & Privacy Policy");
          return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                age: parseInt(formData.age),
                gender: formData.gender,
                address: formData.address.trim(),
                phone: formData.phone.trim()
            });

            // Store authentication data using sessionStorage (more secure than localStorage)
            const { token, user } = response.data;
            
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));
            
            setIsLoggedIn(true);
            navigate("/home");
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || "Registration failed";
                setError(errorMessage);
                console.log("Server error message:", errorMessage);
            } else if (error.request) {
                // Request was made but no response received
                setError("Cannot connect to server. Please check if the server is running.");
            } else {
                // Something else happened
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Register for RECIPEDIA</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password (min 6 characters)" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                />
                <input 
                    type="number" 
                    name="age"
                    placeholder="Age" 
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    required
                />
                <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
                <textarea 
                    name="address"
                    placeholder="Address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
             <p className='swap_state'>Already have an account? <span className='link'><Link to="/login">Login</Link></span></p>
            <div className='termsandconditions'>
            <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                <h6>By continuing, I agree to the Terms of Use & Privacy Policy</h6>
              </label>
            </div>
        </div>
    );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    const { username, email, password, age, gender, address, phone } = formData;

    if (
      !username ||
      !email ||
      !password ||
      !age ||
      !gender ||
      !address ||
      !phone
    ) {
      return "Please fill in all fields";
    }
    if (password.length < 6) return "Password must be at least 6 characters";
    if (isNaN(age) || age < 1 || age > 120) return "Please enter a valid age";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10)
      return "Please enter a valid phone number";

    if (!agreeTerms) return "Please agree to the Terms of Use & Privacy Policy";

    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        {
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: formData.address.trim(),
          phone: formData.phone.trim(),
        }
      );

      const { token, user } = res.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Registration failed");
      } else if (err.request) {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="heading">Register for RECIPEDIA</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="6"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleInputChange}
          min="1"
          max="120"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          rows="3"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="swap_state">
        Already have an account?{" "}
        <span className="link">
          <Link to="/login">Login</Link>
        </span>
      </p>

      <div className="termsandconditions">
        <input
          type="checkbox"
          id="terms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
        />
        <label htmlFor="terms">
          <h6>By continuing, I agree to the Terms of Use & Privacy Policy</h6>
        </label>
      </div>
    </div>
  );

};

export default Register;
