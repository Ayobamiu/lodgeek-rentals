import { useState } from "react";
import { Button, Checkbox, Divider, Drawer, Form, Select, Space } from "antd";
import { PaymentCurrency } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectProperties } from "../../app/features/propertySlice";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { selectBankRecords } from "../../app/features/bankRecordSlice";
import { AddBankRecordModal } from "../../components/banks/AddBankRecordModal";
import {
  selectInvoice,
  updateCurrentInvoice,
} from "../../app/features/invoiceSlice";
import { useParams } from "react-router-dom";

const { Option } = Select;

const InvoiceSettingsDrawer = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  let { invoiceId } = useParams();

  // const invoiceFrequencyOptions = [
  //   { value: InvoiceFrequency.Weekly, label: "Weekly" },
  //   {
  //     value: InvoiceFrequency["Every two weeks"],
  //     label: "Every two weeks",
  //   },
  //   { value: InvoiceFrequency.Monthly, label: "Monthly" },
  //   {
  //     value: InvoiceFrequency["Every two months"],
  //     label: "Every two months",
  //   },
  //   {
  //     value: InvoiceFrequency["Every three months"],
  //     label: "Every three months",
  //   },
  //   {
  //     value: InvoiceFrequency["Every six months"],
  //     label: "Every six months",
  //   },
  //   { value: InvoiceFrequency.Annually, label: "Annually" },
  // ];

  const currencyOptions = [
    { value: PaymentCurrency.NGN, label: PaymentCurrency.NGN },
    // { value: PaymentCurrency.USD, label: PaymentCurrency.USD },
    // { value: PaymentCurrency.EUR, label: PaymentCurrency.EUR },
  ];

  const properties = useAppSelector(selectProperties);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const bankRecords = useAppSelector(selectBankRecords);
  const { currentInvoice } = useAppSelector(selectInvoice);
  const dispatch = useAppDispatch();
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);

  // const setNextPaymentDate = (date: number, frequency: InvoiceFrequency) => {
  //   const nextPaymentDate = moment(date)
  //     .add(
  //       [InvoiceFrequency["Every six months"]].includes(frequency)
  //         ? 6
  //         : [InvoiceFrequency["Every three months"]].includes(frequency)
  //         ? 3
  //         : [
  //             InvoiceFrequency["Every two months"],
  //             InvoiceFrequency["Every two weeks"],
  //           ].includes(frequency)
  //         ? 2
  //         : 1,
  //       [InvoiceFrequency.Annually].includes(frequency)
  //         ? "year"
  //         : [
  //             InvoiceFrequency.Monthly,
  //             InvoiceFrequency["Every two months"],
  //             InvoiceFrequency["Every three months"],
  //             InvoiceFrequency["Every six months"],
  //           ].includes(frequency)
  //         ? "month"
  //         : "week"
  //     )
  //     .toDate()
  //     .getTime();
  //   dispatch(updateCurrentInvoice({ nextPaymentDate }));
  // };

  return (
    <>
      <AddBankRecordModal
        openModal={openAddRecordModal}
        setOpenModal={setOpenAddRecordModal}
      />
      <Drawer
        title="Invoice settings"
        // width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Close</Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Divider orientation="left" orientationMargin="0">
            Currency
          </Divider>

          <Form.Item name="currency" label="Currency">
            <Select
              placeholder="Select Currency"
              defaultValue={currentInvoice.currency}
              onChange={(e) => {
                dispatch(updateCurrentInvoice({ currency: e }));
              }}
              disabled={typeof invoiceId === "string"}
            >
              {currencyOptions.map((i) => (
                <Option key={i.value} value={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider orientation="left" orientationMargin="0">
            Related Property
          </Divider>

          <Form.Item name="propertyId" label="Related Property">
            <Select
              placeholder="Select a Related Property (if any)"
              defaultValue={currentInvoice.propertyId}
              onChange={(e) => {
                const property = properties.find((i) => i.id === e);
                dispatch(
                  updateCurrentInvoice({
                    propertyId: e,
                    propertyName: property?.title,
                  })
                );
              }}
              size="large"
              disabled={typeof invoiceId === "string"}
            >
              {properties.map((i) => (
                <Option key={i.id} value={i.id}>
                  {i.title}
                </Option>
              ))}
            </Select>
            <br />
            <span className="text-coolGray-400 text-xs">
              You won't be able to change this once saved.
            </span>
          </Form.Item>

          <Divider orientation="left" orientationMargin="0">
            Partial payment
          </Divider>
          <Form.Item
            name="acceptPartialPayment"
            label="Is partial payment allowed?"
            tooltip="Customers can select items to pay for partially on the Invoice."
          >
            <Checkbox
              defaultChecked={currentInvoice.acceptPartialPayment}
              onChange={(e) => {
                dispatch(
                  updateCurrentInvoice({
                    acceptPartialPayment: e.target.checked,
                  })
                );
              }}
              disabled={typeof invoiceId === "string"}
            >
              Is partial payment allowed?
            </Checkbox>
            <br />
            <span className="text-coolGray-400 text-xs">
              You won't be able to change this once saved.
            </span>
          </Form.Item>
          {/* <Divider orientation="left" orientationMargin="0">
            Recurring invoice
          </Divider>

          <Space direction="vertical">
            <Form.Item
              name="recurring"
              label="Is this a recurring invoice?"
              required
            >
              <Checkbox
                defaultChecked={currentInvoice.recurring}
                onChange={(e) => {
                  if (e.target.checked) {
                    const startDate = moment(currentInvoice.startDate)
                      .toDate()
                      .getTime();
                    setNextPaymentDate(startDate, currentInvoice.frequency);
                  }
                  dispatch(
                    updateCurrentInvoice({
                      recurring: e.target.checked,
                      recurringInvoiceStatus: e.target.checked
                        ? RecurringInvoiceStatus.Active
                        : RecurringInvoiceStatus.Cancelled,
                    })
                  );
                }}
              >
                Is this a recurring invoice?
              </Checkbox>
            </Form.Item>

            {currentInvoice.recurring && (
              <>
                <Form.Item
                  name="frequency"
                  label="How often should the invoice be generated?"
                  rules={[
                    {
                      required: currentInvoice.recurring,
                      message:
                        "Please select how often should the invoice be generated",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    defaultValue={currentInvoice.frequency}
                    onChange={(e) => {
                      const startDate = moment(currentInvoice.startDate)
                        .toDate()
                        .getTime();
                      setNextPaymentDate(startDate, e);

                      dispatch(updateCurrentInvoice({ frequency: e }));
                    }}
                    placeholder="Select frequency"
                  >
                    {invoiceFrequencyOptions.map((i) => (
                      <Option key={i.value} value={i.value}>
                        {i.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="endDate"
                  label="The start and end dates of the recurring period."
                  rules={[
                    {
                      required: currentInvoice.recurring,
                      message: "Please select start and end dates",
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    size="large"
                    style={{ width: "100%" }}
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    defaultValue={[
                      dayjs(currentInvoice.startDate),
                      dayjs(currentInvoice.endDate),
                    ]}
                    format="MMMM D, YYYY"
                    onChange={(values) => {
                      if (values) {
                        const startDate = values[0]?.toDate().getTime();
                        const endDate = values[1]?.toDate().getTime();
                        if (startDate) {
                          setNextPaymentDate(
                            startDate,
                            currentInvoice.frequency
                          );
                        }

                        dispatch(
                          updateCurrentInvoice({
                            startDate,
                            endDate,
                          })
                        );
                      }
                    }}
                  />
                </Form.Item>
              </>
            )}
          </Space> */}

          <Divider orientation="left" orientationMargin="0">
            Remittance account
          </Divider>

          <Form.Item
            name="remittanceAccount"
            label="Remittance account"
            rules={[
              {
                required: true,
                message: "Please select a Remittance account",
              },
            ]}
          >
            <Select
              placeholder="Select a Remittance account"
              defaultValue={currentInvoice.remittanceAccount}
              onChange={(e) => {
                dispatch(updateCurrentInvoice({ remittanceAccount: e }));
              }}
              disabled={typeof invoiceId === "string"}
            >
              {bankRecords.map((record, index) => (
                <Option key={record.id} value={record.id}>
                  {record.accountNumber} - {record.bankName} -{" "}
                  {record.accountName}{" "}
                  {selectedCompany?.remittanceAccount === record.id &&
                    "(default account)"}
                </Option>
              ))}
            </Select>
            <br />
            <span className="text-coolGray-400 text-xs">
              You won't be able to change this once saved.
            </span>
            <div
              className="text-green-500 underline cursor-pointer"
              onClick={() => {
                setOpenAddRecordModal(true);
              }}
            >
              Add new account
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default InvoiceSettingsDrawer;
