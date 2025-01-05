import { useNavigation } from "./useNavigation";
import { MenuItem } from "./MenuItem";
import { menuItems } from "./config/menuItems";

export default function MenuItems() {
  const { userType } = useNavigation();

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {menuItems.map((item) => {
        const isAllowed = !userType || item.allowedUserTypes.includes(userType);
        return isAllowed ? (
          <MenuItem
            key={item.name}
            {...item}
            userType={userType}
          />
        ) : null;
      })}
    </div>
  );
}