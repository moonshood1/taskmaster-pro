import { Outlet } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import UISwitch from "./SwitchUI";

function LayoutWrapper() {
  return (
    <div className="flex h-screen font-franklin">
      <UISwitch />
      <div className="w-1/5 h-full">
        <Sidebar />
      </div>
      <div className="w-4/5 flex flex-col h-full">
        <div className="flex-1 overflow-auto  bg-white p-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutWrapper;
