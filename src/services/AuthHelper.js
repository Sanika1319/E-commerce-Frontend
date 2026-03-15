export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("Invalid user JSON", err);
    return null;
  }
};

export const getUserId = () => {
  const user = getLoggedInUser();
  return user?.id ?? null;   // ✅ change this
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};