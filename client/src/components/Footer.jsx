const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 md:px-16 lg:px-24 flex" >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Track2Crack. Built by students for students.</p>
        </div>
      </footer>
  );
};

export default Footer;