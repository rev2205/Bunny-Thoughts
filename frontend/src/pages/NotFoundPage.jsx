import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="not-found">
        <h1>404</h1>
        <p>Hmm, that page doesn't exist. The bunny looked everywhere.</p>
        <Link to="/" className="btn btn-primary">
          ← Back to Home
        </Link>
      </div>
    </Layout>
  );
}
