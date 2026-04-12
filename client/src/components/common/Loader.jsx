import './Loader.css';

const Loader = ({ size = 'md', text = '' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-ring">
        <div className="loader-ring-inner" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
