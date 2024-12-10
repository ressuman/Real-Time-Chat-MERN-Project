import { useState } from "react";
import Search from "./search";

export default function Sidebar() {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className="app-sidebar">
      {/* <!--SEARCH USER--> */}
      <Search searchKey={searchKey} setSearchKey={setSearchKey} />
      {/* <!--USER LIST--> */}
    </div>
  );
}
