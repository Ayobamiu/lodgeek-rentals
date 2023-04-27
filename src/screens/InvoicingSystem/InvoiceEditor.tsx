import { Button, DatePicker, Popconfirm } from "antd";
import { updateCurrentInvoice } from "../../app/features/invoiceSlice";
import dayjs from "dayjs";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { AddInvoiceItemModal } from "./AddInvoiceItemModal";
import formatPrice from "../../utils/formatPrice";
import { convertNumToWord } from "../../utils/convertNumToWord";
import { message } from "antd";
import { useMemo, useState } from "react";
import { selectInvoice } from "../../app/features/invoiceSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AddClientModal from "../Clients/AddClientModal";
import { selectCompanyUser } from "../../app/features/companyUserSlice";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";

export function InvoiceEditor() {
  const { currentInvoice } = useAppSelector(selectInvoice);
  const { companyUsers } = useAppSelector(selectCompanyUser);
  const dispatch = useAppDispatch();
  const [modal2Open, setModal2Open] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingTenancy, setUploadingTenancy] = useState(false);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingTenancy(true);
      const url = await UploadPhotoAsync(
        `/rentdocs/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingTenancy(false);
        })
        .catch(() => {
          message.error("Error uploading file.");
        });

      if (url) {
        dispatch(updateCurrentInvoice({ senderCompanyLogo: url }));
      }
    }
  };

  const { subTotal, total } = useMemo(() => {
    const subTotal = currentInvoice.lineItems.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    return { subTotal, total: subTotal + currentInvoice.transactionFee };
  }, [currentInvoice.lineItems]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex mb-8 justify-between">
        <div className="w-2/4">
          <div className="mb-2 md:mb-1 md:flex items-center">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Invoice No.
            </label>
            <span className="mr-4 inline-block md:block">:</span>
            <div className="flex-1">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-full-name"
                type="text"
                placeholder="eg. #INV-100001"
                x-model="invoiceNumber"
                defaultValue={currentInvoice.invoiceNumber}
                onChange={(e) => {
                  dispatch(
                    updateCurrentInvoice({ invoiceNumber: e.target.value })
                  );
                }}
              />
            </div>
          </div>

          <div className="mb-2 md:mb-1 md:flex items-center">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Invoice Date
            </label>
            <span className="mr-4 inline-block md:block">:</span>
            <DatePicker
              onChange={(value) => {
                dispatch(
                  updateCurrentInvoice({
                    date: dayjs(value).toDate().getTime(),
                  })
                );
              }}
              placeholder="eg. 17 Feb, 2020"
              defaultValue={dayjs(currentInvoice.date)}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
            />

            <div className="flex-1">
              {/* <input
    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
    type="text"
    id="datepicker1"
    placeholder="eg. 17 Feb, 2020"
    x-model="invoiceDate"
    //   x-on:change="invoiceDate = document.getElementById('datepicker1').value"
    autoComplete="off"
    readOnly
    defaultValue={currentInvoice.date}
    onChange={(e) => {
      dispatch(
        updateCurrentInvoice({ date: e.target.valueAsNumber })
      );
    }}
  /> */}
            </div>
          </div>

          <div className="mb-2 md:mb-1 md:flex items-center">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Due date
            </label>
            <span className="mr-4 inline-block md:block">:</span>
            <DatePicker
              onChange={(value) => {
                dispatch(
                  updateCurrentInvoice({
                    dueDate: dayjs(value).toDate().getTime(),
                  })
                );
              }}
              defaultValue={dayjs(currentInvoice.dueDate)}
              placeholder="eg. 17 Feb, 2020"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
            />
          </div>
          {currentInvoice.propertyName && (
            <div className="mb-2 md:mb-1 md:flex items-center">
              <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
                Property
              </label>
              <span className="mr-4 inline-block md:block">:</span>
              <textarea
                name="propertyName"
                id="propertyName"
                defaultValue={currentInvoice.propertyName}
                onChange={(e) => {
                  dispatch(
                    updateCurrentInvoice({
                      propertyName: e.target.value,
                    })
                  );
                }}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 h-11 overflow-y-scroll py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
              ></textarea>
            </div>
          )}
        </div>
        <label
          htmlFor="fileInput"
          className="w-32 h-32 mb-1 border rounded-lg overflow-hidden relative bg-gray-100 flex justify-center items-center"
        >
          {uploadingTenancy && (
            <div className="absolute">
              <ActivityIndicator size="4" />
            </div>
          )}
          {currentInvoice.senderCompanyLogo ? (
            <img
              id="image"
              className="object-cover w-full h-32"
              src={currentInvoice.senderCompanyLogo}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-camera"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
              <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          )}
          <input
            name="photo"
            id="fileInput"
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleUploadLogo}
          />
        </label>
      </div>

      <div className="flex flex-wrap justify-between mb-8">
        <div className="w-full md:w-1/3 mb-2 md:mb-0">
          <div className="flex justify-between items-center">
            <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
              Bill/Ship To:
            </label>
            <button
              className="text-blue-500"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              add new client
            </button>
          </div>
          <select
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            placeholder="Select Client"
            onChange={(e) => {
              const value = companyUsers.find((i) => i.id === e.target.value);
              dispatch(
                updateCurrentInvoice({
                  customerId: value ? value.id : "",
                  customer: value,
                  customerCompanyAddress: value ? value.address : "",
                  customerCompanyName: value ? value.company : "",
                  customerName: value ? value.name : "",
                  customerCompanyEmail: value ? value.email : "",
                })
              );
            }}
            defaultValue={currentInvoice.customerId}
          >
            <option selected>Select Client</option>
            {companyUsers.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="email"
            placeholder="Client email"
            x-model="billing.name"
            defaultValue={currentInvoice.customerCompanyEmail}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  customerCompanyEmail: e.target.value,
                })
              );
            }}
          />

          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Client company address"
            x-model="billing.address"
            defaultValue={currentInvoice.customerCompanyAddress}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  customerCompanyAddress: e.target.value,
                })
              );
            }}
          />
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Additional info"
            x-model="billing.extra"
            defaultValue={currentInvoice.customerAdditionalInfo}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  customerAdditionalInfo: e.target.value,
                })
              );
            }}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
            From:
          </label>
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Your company name"
            x-model="from.name"
            defaultValue={currentInvoice.senderCompanyName}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  senderCompanyName: e.target.value,
                })
              );
            }}
          />
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Your company phone"
            x-model="from.address"
            defaultValue={currentInvoice.senderCompanyPhone}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  senderCompanyPhone: e.target.value,
                })
              );
            }}
          />
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Your company email"
            x-model="from.address"
            defaultValue={currentInvoice.senderCompanyEmail}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  senderCompanyEmail: e.target.value,
                })
              );
            }}
          />
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Your company address"
            x-model="from.address"
            defaultValue={currentInvoice.senderCompanyAddress}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  senderCompanyAddress: e.target.value,
                })
              );
            }}
          />
          <input
            className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="inline-full-name"
            type="text"
            placeholder="Additional info"
            x-model="from.extra"
            defaultValue={currentInvoice.senderAdditionalInfo}
            onChange={(e) => {
              dispatch(
                updateCurrentInvoice({
                  senderAdditionalInfo: e.target.value,
                })
              );
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-11 -mx-1 border-b py-2 items-start">
        <div className="col-span-5 px-1">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">
            Description
          </p>
        </div>

        <div className="px-1 col-span-1 text-right">
          <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">
            Quantity
          </p>
        </div>

        <div className="px-1 col-span-2 text-right">
          <p className="leading-none">
            <span className="block uppercase tracking-wide text-sm font-bold text-gray-800">
              Unit Price
            </span>
          </p>
        </div>

        <div className="px-1 col-span-2 text-right">
          <p className="leading-none">
            <span className="block uppercase tracking-wide text-sm font-bold text-gray-800">
              Amount
            </span>
          </p>
        </div>

        <div className="px-1 col-span-1 text-center"></div>
      </div>

      {currentInvoice.lineItems.map((i) => (
        <div key={i.key}>
          <div className="grid grid-cols-11 flex-wrap -mx-1 py-2 border-b items-center lg:text-base text-xs">
            <div className="col-span-5 px-1">
              <p className="text-gray-800">{i.name}</p>
            </div>

            <div className="px-1 col-span-1 text-right">
              <p className="text-gray-800">{i.quantity}</p>
            </div>

            <div className="px-1 col-span-2 text-right">
              <p className="text-gray-800">{formatPrice(i.price)}</p>
            </div>

            <div className="px-1 col-span-2 text-right">
              <p className="text-gray-800">{formatPrice(i.amount)}</p>
            </div>

            <div className="px-1 col-span-1 text-right">
              <Popconfirm
                title="Delete the item"
                description="Are you sure to delete this item?"
                onConfirm={() => {
                  const lineItems = [...currentInvoice.lineItems].filter(
                    (x) => x.key !== i.key
                  );

                  dispatch(updateCurrentInvoice({ lineItems }));
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ className: "bg-red-500" }}
              >
                <Button danger type="link">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      ))}

      <button
        className="mt-6 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded shadow-sm"
        onClick={() => {
          setModal2Open(true);
        }}
      >
        Add Invoice Items
      </button>

      <div className="py-2 ml-auto mt-20 w-80">
        <div className="flex justify-between mb-3">
          <div className="text-gray-800 text-right flex-1">Sub-Total</div>
          <div className="text-right w-40">
            <div className="text-gray-800 font-medium" x-html="netTotal">
              {formatPrice(subTotal)}
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600 text-right flex-1">
            Transaction Fees
          </div>
          <div className="text-right w-40">
            <div className="text-sm text-gray-600" x-html="totalGST">
              {formatPrice(currentInvoice.transactionFee)}
            </div>
          </div>
        </div>

        <div className="py-2 border-t border-b">
          <div className="flex justify-between">
            <div className="text-xl text-gray-600 text-right flex-1">
              Amount due
            </div>
            <div className="text-right w-40">
              <div
                className="text-xl text-gray-800 font-bold"
                x-html="netTotal"
              >
                {formatPrice(total)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {total > 0 && (
        <div className="p-4 bg-gray-100">
          <strong>Total</strong>:{" "}
          {convertNumToWord(total, currentInvoice.currency)}
        </div>
      )}
      <div className="my-5">
        <label
          htmlFor="notes"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          NOTES
        </label>
        <textarea
          id="notes"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Notes"
          defaultValue={currentInvoice.notes}
          onChange={(e) => {
            dispatch(updateCurrentInvoice({ notes: e.target.value }));
          }}
        ></textarea>
      </div>

      {/* Add item Modal */}

      <AddInvoiceItemModal
        isOpen={modal2Open}
        closeModal={() => setModal2Open(false)}
      />
      <AddClientModal
        isModalOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
        }}
      />
      {/* Add item Modal */}
    </div>
  );
}
