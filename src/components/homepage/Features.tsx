import {
  TeamOutlined,
  BellOutlined,
  EditOutlined,
  CreditCardOutlined,
  AccountBookOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { FeatureItem } from "./FeatureItem";

export default function Features() {
  const offerings = [
    {
      header: "Auto-Rent Collection",
      description:
        "Lodgeek makes it easy for property managers and landlords to collect rent payments automatically from tenants.",
      details:
        "With Lodgeek's auto-rent collection feature, property managers and landlords can easily set up recurring rent payments, accept payments from tenants via credit card or bank transfer, and track payment history all in one place.",
      IconComponent: <CreditCardOutlined className="text-2xl" />,
    },
    {
      header: "Sign the Lease",
      description:
        "Lodgeek offers a secure and easy-to-use platform for signing lease agreements online.",
      details:
        "Lodgeek's e-signature feature allows property managers and landlords to easily send lease agreements to tenants for digital signature. This saves time and money by eliminating the need for printing, scanning, and mailing physical documents. Lodgeek also securely stores all lease agreements for easy access and reference.",
      IconComponent: <EditOutlined className="text-2xl" />,
    },
    {
      header: "Financial Reports",
      description:
        "Lodgeek provides detailed financial reports to help property managers and landlords keep track of income and expenses.",
      details:
        "Lodgeek's financial reports provide an overview of rent payments received, expenses incurred, and other financial data related to managing rental properties. Reports can be customized and exported to Excel for easy analysis and accounting.",
      IconComponent: <AccountBookOutlined className="text-2xl" />,
    },
    {
      header: "Rent Reminders",
      description:
        "Lodgeek sends automatic rent reminders to tenants and property managers to help ensure timely rent payments.",
      details:
        "With Lodgeek's rent reminder feature, property managers and landlords can set up reminders to be sent to tenants via email or SMS. This helps reduce the risk of late or missed rent payments, and makes it easier for tenants to stay on top of their rental obligations.",
      IconComponent: <BellOutlined className="text-2xl" />,
    },
    {
      header: "Team Management",
      description:
        "Lodgeek offers team management capabilities for property management companies with multiple staff members.",
      details:
        "Lodgeek's team management feature allows property management companies to add and manage multiple staff members with varying levels of access and permissions. This makes it easy to collaborate on managing rental properties and streamline workflows.",
      IconComponent: <TeamOutlined className="text-2xl" />,
    },
    {
      header: "Invoicing System",
      description:
        "Lodgeek provides an easy-to-use invoicing system for property managers and landlords to bill tenants for rent and other charges.",
      details:
        "Lodgeek's invoicing system allows property managers and landlords to create and send invoices to tenants for rent payments, late fees, and other charges. Invoices can be customized with branding and other details, and can be paid online via credit card or bank transfer for added convenience.",
      IconComponent: <TransactionOutlined className="text-2xl" />,
    },
  ];

  return (
    <section id="features" className="py-24 md:pb-32 bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="md:max-w-4xl mb-12 mx-auto text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-full shadow-sm">
            Features
          </span>
          <h1 className="mb-4 text-3xl md:text-4xl leading-tight font-bold tracking-tighter">
            Manage and expand your rental portfolio from anywhere.
          </h1>
          <p className="text-lg md:text-xl text-coolGray-500 font-medium">
            You can manage every aspect of your rental business in one secure
            platform with our integrated CRM, rental management, payment
            integration, and invoicing capabilities.
          </p>
        </div>
        <div className="flex flex-wrap -mx-4">
          {offerings.map((i) => (
            <FeatureItem key={i.header} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
