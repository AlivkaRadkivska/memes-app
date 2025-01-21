import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Publication App</h1>
      <Link to="/create">Go to Create Publication</Link>
    </div>
  );
};

export default Home;
