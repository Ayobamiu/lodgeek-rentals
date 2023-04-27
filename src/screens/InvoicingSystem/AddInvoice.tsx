import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import InvoiceBuilder from "./InvoiceBuilder";

const AddInvoice = () => {
  return (
    <DashboardWrapper className="p-0 bg-gray-100">
      <InvoiceBuilder />
    </DashboardWrapper>
  );
};

export default AddInvoice;
