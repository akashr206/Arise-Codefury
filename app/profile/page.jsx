"use client";

import UserInfo from "@/components/profile/UserInfo";
import TabsComponent from "@/components/profile/TabsComponent";
const page = () => {
  return (
    <div className=" absolute flex flex-col gap-4">
      <UserInfo />
      <div className="sticky top-80">
        <TabsComponent />
      </div>
    </div>
  );
};

export default page;
