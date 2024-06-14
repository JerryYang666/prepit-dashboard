import React, { useState } from "react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { School } from "lucide-react";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";

interface Institution {
  name: string;
  action: () => void;
  logo?: string;
}

const institutions: Institution[] = [
  {
    name: "Case Western Reserve University",
    action: () => {
      console.log("CWRU login");
      const currentUrl = window.location.href;
      const ssoVerifyUrl = "https://api.prepit-ai.com/v1/prod/admin/cwru_sso_callback";
      window.location.href = `https://login.case.edu/cas/login?service=${ssoVerifyUrl}?came_from=${currentUrl}`;
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
        <School className="mr-2" />
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
              onClick={() => {
                localStorage.setItem(
                  lastUsedLoginProviderLocalStorageKey,
                  "institution",
                );
                institution.action();
              }}
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
