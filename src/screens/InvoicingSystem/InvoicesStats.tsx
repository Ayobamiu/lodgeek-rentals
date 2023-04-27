import { MetricStat } from "./MetricStat";
import { Carousel } from "antd";
import useInvoice from "../../hooks/useInvoice";

export function InvoicesStats() {
  const { invoiceStats } = useInvoice();
  return (
    <>
      <section className="bg-coolGray-50 container mx-auto lg:flex hidden flex-wrap lg:gap-0 gap-2">
        <MetricStat
          bigNum={invoiceStats.sentInvoicesAmount}
          bigText="Sent Invoices"
          percentage={20}
          smallNum={invoiceStats.sentInvoicesCount}
          smallText="Sent Invoices"
        />
        <MetricStat
          bigNum={invoiceStats.paidInvoicesAmount}
          bigText="Paid Invoices"
          percentage={20}
          smallNum={invoiceStats.paidInvoicesCount}
          smallText="Paid Invoices"
        />
        <MetricStat
          bigNum={invoiceStats.unpaidInvoicesAmount}
          bigText="Unpaid Invoices"
          percentage={20}
          smallNum={invoiceStats.unpaidInvoicesCount}
          smallText="Unpaid Invoices"
        />
        <MetricStat
          bigNum={invoiceStats.overDueInvoicesAmount}
          bigText="Over Due Invoices"
          percentage={20}
          smallNum={invoiceStats.overDueInvoicesCount}
          smallText="Over Due Invoices"
        />
      </section>
      <div className="lg:hidden block">
        <Carousel
          afterChange={() => {}}
          // dots={{ className: "bg-red-500 text-green-500" }}
          autoplay
        >
          <div className="">
            <div className="flex gap-x-2">
              <MetricStat
                bigNum={invoiceStats.sentInvoicesAmount}
                bigText="Sent Invoices"
                percentage={20}
                smallNum={invoiceStats.sentInvoicesCount}
                smallText="Sent Invoices"
              />
              <MetricStat
                bigNum={invoiceStats.paidInvoicesAmount}
                bigText="Paid Invoices"
                percentage={20}
                smallNum={invoiceStats.paidInvoicesCount}
                smallText="Paid Invoices"
              />
            </div>
          </div>
          <div className="">
            <div className="flex gap-x-2">
              <MetricStat
                bigNum={invoiceStats.unpaidInvoicesAmount}
                bigText="Unpaid Invoices"
                percentage={20}
                smallNum={invoiceStats.unpaidInvoicesCount}
                smallText="Unpaid Invoices"
              />
              <MetricStat
                bigNum={invoiceStats.overDueInvoicesAmount}
                bigText="Over Due Invoices"
                percentage={20}
                smallNum={invoiceStats.overDueInvoicesCount}
                smallText="Over Due Invoices"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </>
  );
}
