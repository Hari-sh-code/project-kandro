import { VscAccount } from "react-icons/vsc";

const NavBar = () => {
  return (
    <div className="p-2 border-b">
      <div className="px-2 flex items-center justify-between">
        <h1 className="font-bold">Kandro</h1>

        <VscAccount className="h-10 w-10" />
      </div>
    </div>
  );
};

export default NavBar;
