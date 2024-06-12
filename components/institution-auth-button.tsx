import React, { useState } from "react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";

interface Institution {
  name: string;
  action: () => void;
  logo?: string;
}

const institutions: Institution[] = [
  {
    name: "CWRU",
    action: () => {
      localStorage.setItem(lastUsedLoginProviderLocalStorageKey, "institution");
      console.log("CWRU login");
    },
    logo: "https://case.edu/brand/themes/custom/crew_branding/favicon.ico",
  },
  // Add more institutions here
];

function InstitutionAuthButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Button onClick={handleModal} variant={"outline"} className="w-full">
        Login with Institution
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModal}
        title="Select Institution"
        description="Select your institution to login."
      >
        {institutions.map((institution) => (
          <div className="flex items-center mb-2" key={institution.name}>
            <Button
              key={institution.name}
              onClick={institution.action}
              variant={"secondary"}
            >
              <img
                src={institution.logo}
                alt={institution.name}
                className="h-[120%] mr-2 rounded-md"
              />
              Continue with {institution.name}
            </Button>
          </div>
        ))}
      </Modal>
    </>
  );
}

export default InstitutionAuthButton;
