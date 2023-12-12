import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function Logout() {
  async function logOut() {
    "use server";
    const token = cookies().get("session");
    await fetch("http:/localhost:3000/api/auth", {
      method: "DELETE",
      headers: {
        Cookie: `session=${token?.value}`,
      },
    });
    cookies().delete("session");
    redirect("/login");
  }

  return (
    <form action={logOut}>
      <button className="text-white hover:cursor-pointer" type="submit">
        Logout
      </button>
    </form>
  );
}

export default Logout;
