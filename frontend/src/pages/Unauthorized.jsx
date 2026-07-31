import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}

export default Unauthorized;
