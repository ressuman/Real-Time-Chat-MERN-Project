import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-animation">
          <span className="digit">4</span>
          <span className="animated-chat-bubble">
            <i className="fa fa-comments"></i>
          </span>
          <span className="digit">4</span>
        </div>
        <h1 className="not-found-heading">Oops! Page Not Found</h1>
        <p className="not-found-text">
          It seems like you&apos;ve wandered off the chat! The page you&apos;re
          looking for doesn&apos;t exist.
        </p>
        <Link to="/" className="go-home-button">
          Go Back to Chat
        </Link>
      </div>
      <div className="footer-note">
        <p>
          Need help? <Link to="/support">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
