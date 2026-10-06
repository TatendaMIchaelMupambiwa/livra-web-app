// user-info.tsx
"use client";

import usersGlobalStore from "@/store/users-store";

function UserInfo() {
  const user = usersGlobalStore((state) => state.user);

  return (
    <div className="text-sm text-white">
      <p>Welcome: {user?.name}</p>
    </div>
  );
}

export default UserInfo;