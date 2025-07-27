 
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 text-white py-8 px-6 md:px-16 lg:px-24 flex border-t border-indigo-500/20" >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
              
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Track2Crack
            </span>
          </div>
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Track2Crack. Built by students for students.
          </p>
        </div>
      </footer>
  );
};

export default Footer;