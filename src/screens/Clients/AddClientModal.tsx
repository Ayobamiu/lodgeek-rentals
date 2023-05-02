import { Collapse, message, Modal, Select } from "antd";
import {
  CompanyUser,
  CompanyUserRole,
  CompanyUserStatus,
  FirebaseCollections,
} from "../../models";
import {
  addCompanyUser,
  selectCompanyUser,
  updateCompanyUser,
  updateCurrentCompanyUser,
} from "../../app/features/companyUserSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { generateFirebaseId } from "../../firebase/config";
import {
  createCompanyUser,
  updateCompanyUserInDatabase,
} from "../../firebase/apis/companyUser";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { sendEmail } from "../../api/email";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
const { Panel } = Collapse;

const AddClientModal = ({
  closeModal,
  isModalOpen,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const { currentCompanyUser } = useAppSelector(selectCompanyUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const dispatch = useAppDispatch();

  const [updating, setUpdating] = useState(false);
  const userStatuses = [
    CompanyUserStatus.active,
    CompanyUserStatus.blocked,
    CompanyUserStatus.inactive,
  ];
  const userRoles = [
    CompanyUserRole.admin,
    CompanyUserRole.customer,
    CompanyUserRole.staff,
  ];

  return (
    <Modal
      title={`${currentCompanyUser.id ? "Update" : "Add"} User`}
      open={isModalOpen}
      onOk={closeModal}
      onCancel={closeModal}
      footer={null}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setUpdating(true);
          if (currentCompanyUser.id) {
            //Update user
            await updateCompanyUserInDatabase(currentCompanyUser)
              .then(() => {
                dispatch(updateCompanyUser(currentCompanyUser));
                closeModal();
              })
              .finally(() => {
                setUpdating(false);
              });
          } else {
            //Add new user
            const newUser: CompanyUser = {
              ...currentCompanyUser,
              id: generateFirebaseId(FirebaseCollections.companyUser),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              companyId: selectedCompany?.id || "",
            };
            await createCompanyUser(newUser)
              .then(async () => {
                const emailSubject = `You've been added to ${selectedCompany?.name}'s client list`;

                const paragraphs = [
                  "Hi there,",
                  `We wanted to let you know that you have been added to ${selectedCompany?.name}'s client list by your property manager. 
                This means that you will be receiving important updates and information related to your property.`,
                  `If you have any questions or concerns, please don't hesitate to
                contact us at
                <a
                  class="text-blue-600 hover:underline dark:text-blue-400"
                  href="mailto:contact@lodgeek.com"
                  >contact@lodgeek.com</a
                >.`,
                  `Best regards, <br />
                Lodgeek Team`,
                ];
                const generatedEmail = generateSimpleEmail({
                  paragraphs,
                });
                // await sendEmail()
                await sendEmail(
                  newUser.email,
                  emailSubject,
                  paragraphs.join(" \n"),
                  generatedEmail
                ).then(() => {
                  dispatch(addCompanyUser(newUser));
                  closeModal();
                  message.success("User added.");
                });
              })
              .finally(() => {
                setUpdating(false);
              });
          }
        }}
        onReset={() => {
          closeModal();
        }}
      >
        {/* <div className="flex w-full justify-center my-5">
          <label className="relative">
            <input type="file" name="logo" id="logo" className="w-0 h-0" />
            <img
              className="w-10 h-10 rounded-full"
              src={currentCompanyUser.photoUrl}
              alt="User Photo"
            />
            <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
              <FontAwesomeIcon icon={faImage} />
            </span>
          </label>
        </div> */}
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter name"
            required
            defaultValue={currentCompanyUser.name}
            onChange={(e) => {
              dispatch(updateCurrentCompanyUser({ name: e.target.value }));
            }}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter email"
            required
            defaultValue={currentCompanyUser.email}
            onChange={(e) => {
              dispatch(updateCurrentCompanyUser({ email: e.target.value }));
            }}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="number"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone
          </label>
          <input
            type="tel"
            id="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter number"
            required
            defaultValue={currentCompanyUser.phone}
            onChange={(e) => {
              dispatch(updateCurrentCompanyUser({ phone: e.target.value }));
            }}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="roles"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Roles
          </label>

          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            defaultValue={currentCompanyUser.roles}
            placeholder="Select Roles"
            onChange={(e) => {
              dispatch(updateCurrentCompanyUser({ roles: e }));
            }}
            options={userRoles.map((i) => {
              return { value: i, label: i };
            })}
            size="large"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Status
          </label>

          <Select
            allowClear
            style={{ width: "100%" }}
            defaultValue={currentCompanyUser.status}
            placeholder="Select Status"
            onChange={(e) => {
              dispatch(updateCurrentCompanyUser({ status: e }));
            }}
            options={userStatuses.map((i) => {
              return { value: i, label: i };
            })}
            size="large"
          />
        </div>

        <Collapse ghost className="">
          <Panel header="Additional Info" key="1">
            <div className="mb-3">
              <label
                htmlFor="Company"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company
              </label>
              <input
                type="text"
                id="Company"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Company"
                defaultValue={currentCompanyUser.company}
                onChange={(e) => {
                  dispatch(
                    updateCurrentCompanyUser({ company: e.target.value })
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="Country"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Country
              </label>
              <input
                type="text"
                id="Country"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Country"
                defaultValue={currentCompanyUser.country}
                onChange={(e) => {
                  dispatch(
                    updateCurrentCompanyUser({ country: e.target.value })
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="City"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <input
                type="text"
                id="City"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter City"
                defaultValue={currentCompanyUser.city}
                onChange={(e) => {
                  dispatch(updateCurrentCompanyUser({ city: e.target.value }));
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="Address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                typeof="address"
                autoComplete="address"
                id="Address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Address"
                defaultValue={currentCompanyUser.address}
                onChange={(e) => {
                  dispatch(
                    updateCurrentCompanyUser({ address: e.target.value })
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="Website"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Website
              </label>
              <input
                type="text"
                id="Website"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Website"
                defaultValue={currentCompanyUser.website}
                onChange={(e) => {
                  dispatch(
                    updateCurrentCompanyUser({ website: e.target.value })
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="Dateofbirth"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date of birth
              </label>
              <input
                type="date"
                id="Dateofbirth"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Date of birth"
                defaultValue={currentCompanyUser.dob}
                onChange={(e) => {
                  dispatch(
                    updateCurrentCompanyUser({ dob: e.target.valueAsNumber })
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="About"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                About
              </label>
              <input
                type="text"
                id="About"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="About user"
                defaultValue={currentCompanyUser.about}
                onChange={(e) => {
                  dispatch(updateCurrentCompanyUser({ about: e.target.value }));
                }}
              />
            </div>
          </Panel>
        </Collapse>

        <div className="w-full flex justify-end gap-3">
          <button
            type="reset"
            className=" bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="flex items-center justify-center gap-x-3 disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {currentCompanyUser.id ? "Update" : "Submit"}{" "}
            {updating && <ActivityIndicator size="4" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
