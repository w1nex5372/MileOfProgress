import face from "../img/aa.jpg";

const MainSection = () => {
  return (
    <div className="flex flex-col items-center justify-stretch">
      <h2 className="relative z-10 text-green-500 text-3xl font-bold text-center pt-16 sm:pt-32 pb-10 px-5 sm:px-10 font-sans">
        Small improvements over time lead to big results. Let's work together to
        make progress towards your goals.
      </h2>
      <div className="relative z-20 flex flex-col items-center justify-center mt-10">
        <div className="max-w-screen-lg mx-auto mb-8">
          <h2 className="text-4xl font-bold mb-2 text-green-500 text-center">
            Goals
          </h2>
          <p className="text-lg text-black leading-relaxed text-center">
            Our program is designed to help you achieve the following goals:
          </p>
        </div>
        <div className="grid lg:flex-row grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-500 rounded-lg shadow-lg p-6 m-2 text-white">
            <h3 className="text-lg font-bold mb-2 text-yellow-300">
              Increase Productivity
            </h3>
            <p className="text-white text-base">
              Learn how to manage your time and tasks more effectively to
              increase your productivity and achieve more in less time.
            </p>
          </div>
          <div className="bg-purple-500 rounded-lg shadow-lg p-6 m-2 text-yellow-300">
            <h3 className="text-lg font-bold mb-2">Develop Better Habits</h3>
            <p className="text-white text-base">
              Build new habits and break old ones to create a more positive and
              healthy lifestyle.
            </p>
          </div>
          <div className="bg-green-500 rounded-lg shadow-lg p-6 m-2 text-yellow-300">
            <h3 className="text-lg font-bold mb-2">Achieve Your Goals</h3>
            <p className="text-white text-base">
              Set and achieve your goals with our help and guidance to create
              the life you want.
            </p>
          </div>
          <div className="bg-orange-500 rounded-lg shadow-lg p-6 m-2 text-yellow-300">
            <h3 className="text-lg font-bold mb-2">New Feature</h3>
            <p className="text-white text-base">
              Explore our latest feature designed to help you succeed even more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
