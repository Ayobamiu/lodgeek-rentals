import DashboardWrapper from "../../components/dashboard/DashboardWrapper";

const FinancialReport = () => {
  return (
    <DashboardWrapper>
      <div>
        <section className="bg-white p-8">
          <div className="flex flex-wrap items-center -m-2">
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap items-center -m-2">
                <div className="flex-1 p-2">
                  <h2 className="font-semibold text-black text-3xl">
                    Financial Reports
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap justify-end -m-2">
                <div className="w-full md:w-auto p-2"></div>
                <div className="w-full md:w-auto p-2">
                  <button className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button">
                    <span>Download reports</span>
                  </button>
                </div>
                <div className="w-full md:w-auto p-2"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default FinancialReport;
