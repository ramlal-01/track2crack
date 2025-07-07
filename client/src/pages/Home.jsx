import FeatureCard from '../components/FeatureCard';
import {
  Book,
  Brain,
  FileText,
  ListChecks,
  History,
  AlarmClock,
  User,
  BookOpen,
  BarChart,
  Puzzle,
  BookmarkCheck,
  Target,
  BarChart3
} from "lucide-react"; 


const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-purple-50 py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Master <span className="text-blue-600">DSA</span> & <span className="text-purple-600">Core CS</span><br />
              <span className="font-semibold text-gray-700">With Progress Tracking.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700">
              Stay organized with smart tracking, curated notes, and chapter-wise quizzes — all in one platform.
            </p>
            <a
              href="/register"
              className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300"
            >
              Get Started
            </a>
          </div>

          <div className="w-full h-64 md:h-80 flex items-center justify-center">
            <img
              src="/assets/heroImage.svg"
              alt="Track2Crack Hero"
              className="h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="text-gray-600 body-font bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-blue-500 tracking-widest font-semibold title-font mb-1">
              FEATURES
            </h2>
            <h1 className="sm:text-4xl text-3xl font-bold title-font text-gray-900">
              What You Can Do with Track2Crack
            </h1>
          </div>

          <div className="flex flex-wrap -m-4">
            {/* Feature 1 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <Book className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    DSA Sheet Tracker
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    Track progress across structured 450-question DSA sheets. Bookmark, filter by topic, and monitor completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Core Subject Notes
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    Study OS, DBMS, CN and more using tagged notes and top resources — all organized by importance.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    MCQ Quizzes
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    Topic-wise quizzes with real MCQs. Review past attempts, bookmark tricky ones, and boost your prep.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Theory Concept Tracker
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    Track your understanding of DSA, Java, and OOPS theory concepts. Smart quiz-based reinforcement included.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Quiz History Review
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    Access and analyze your quiz attempt history. Track accuracy, revisit bookmarks, and stay sharp.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col transition transform hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0 transform transition hover:scale-105">
                    <AlarmClock className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Smart Revision Tab
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
                    All your bookmarked items and reminders in one place — built to help you revise smarter, not harder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      

      <section id="about" className="bg-gray-50 py-20 px-4 md:px-16">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Getting Started
          </h2>
          <h1 className="text-3xl font-bold text-gray-900">How It Works</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition rounded-lg p-6 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div className="text-blue-600 font-bold text-xl mb-2">1</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Create an Account</h3>
            <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
              Sign up and personalize your dashboard to start your journey.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition rounded-lg p-6 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-blue-600 font-bold text-xl mb-2">2</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Start Learning</h3>
            <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
              Access curated notes, DSA sheets, and theory quizzes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition rounded-lg p-6 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600">
              <BarChart className="w-6 h-6" />
            </div>
            <div className="text-blue-600 font-bold text-xl mb-2">3</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Track & Revise</h3>
            <p className="leading-[1.8] text-[17px] text-gray-700 xl:w-11/12">
              Monitor your progress, bookmark important content, and revise smartly.
            </p>
          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
     <section  className="bg-white py-20 px-6 md:px-16 lg:px-24 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Why Track2Crack?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">All-in-One Prep</h3>
              <p className="text-gray-600">No juggling between platforms — everything from DSA to core CS in one place.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Smart Tracking</h3>
              <p className="text-gray-600">Track progress, bookmark tricky topics, and set reminders to revise.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Focused Learning</h3>
              <p className="text-gray-600">No fluff — curated content for what actually matters in placements.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Distraction-Free UI</h3>
              <p className="text-gray-600">Minimalist design that keeps you focused on learning and nothing else.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24 border-t border-gray-200">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-4">
            Have a question, feedback, or need support? We’d love to hear from you.
          </p>
          <p className="text-blue-600 font-medium text-lg">
            Email: <a href="mailto:support@track2crack.in" className="underline">support@track2crack.in</a>
          </p>
        </div>
      </section>
     
    </>
  );
};

export default Home;
