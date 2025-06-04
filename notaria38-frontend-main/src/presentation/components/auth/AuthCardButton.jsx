import PropTypes from 'prop-types';

export default function AuthCardButton ({type = 'button', onClick, children}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        w-full bg-[#D07024] text-white py-2 px-4 mb-4 rounded-md 
        hover:bg-[#bb6823] transition duration-200 cursor-pointer
      "
    >
      {children}
    </button>
  );
};

AuthCardButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
};
