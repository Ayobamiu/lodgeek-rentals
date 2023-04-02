import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import SettingsWrapper from "../../components/settings/SettingsWrapper";

import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface } from "flowbite";

function TeamCollaboration() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Doe", role: "Designer" },
    { id: 2, name: "Jane Smith", role: "Developer" },
    { id: 3, name: "Bob Johnson", role: "Project Manager" },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const addTeamMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      name: newMemberName,
      role: newMemberRole,
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName("");
    setNewMemberRole("");
  };

  const $modalElement: HTMLElement = document.querySelector("#modalEl");

  const modalOptions: ModalOptions = {
    placement: "bottom-right",
    backdrop: "dynamic",
    backdropClasses:
      "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    closable: true,
    onHide: () => {
      console.log("modal is hidden");
    },
    onShow: () => {
      console.log("modal is shown");
    },
    onToggle: () => {
      console.log("modal has been toggled");
    },
  };

  const modal: ModalInterface = new Modal($modalElement, modalOptions);

  modal.show();

  return (
    <SettingsWrapper>
      <div className="flex flex-col max-w-5xl mx-auto">
        <div className="mt-8 mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Members</h1>
          <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <li key={member.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${member.name}&background=random`}
                          alt={`${member.name}'s profile picture`}
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <div className="text-sm font-medium text-blue-600 truncate">
                            {member.name}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">{member.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="h-5 w-5 text-gray-400"
                      />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SettingsWrapper>
  );
}

export default TeamCollaboration;
