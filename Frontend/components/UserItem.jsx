import React from "react";

const UserItem = ({ user }) => {
  return (
    <div>
      <p>
        {user.nombre} {user.apellido}
      </p>
    </div>
  );
};

export default UserItem;
