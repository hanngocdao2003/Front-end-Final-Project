import '../styles/Login.css'
import {useNavigate} from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate();

    const navigateLogin = (event) => {
        navigate('/login')
    }

    return (
        <div className="container">
            <div className="login-form">
                <form>
                    <div className="input-container">
                        <label htmlFor="username" className="floating-label">Username</label>
                        <input type="text" id="username" name="username" placeholder=" " />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password" className="floating-label">Password</label>
                        <input type="password" id="password" name="password" placeholder=" " />
                    </div>
                    <div className="input-container">
                        <label htmlFor="confirmPassword" className="floating-label">Confirm password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder=" " />
                    </div>
                </form>
                <div className="back-login-form-button">
                    <div className="button-container">
                        <button id="backLoginBtn" onClick={navigateLogin}>Go back login</button>
                        <button id="registerAccountBtn">Register account</button>
                    </div>
                    <div className="reset-password">
                        <a href="#">Reset password</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;