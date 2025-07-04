import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  fullName: string;
  email: string;
  phone: string;
  isAuthenticated: boolean;
  profileCompletionStatus: {
    personalInformation: boolean;
    addressInformation: boolean;
    identityVerification: boolean;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfileStatus: (
    step: keyof User["profileCompletionStatus"],
    completed: boolean
  ) => void;
  isProfileComplete: () => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = (userData: User | null) => {
    setUserState(userData);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const updateProfileStatus = (
    step: keyof User["profileCompletionStatus"],
    completed: boolean
  ) => {
    if (user) {
      setUserState({
        ...user,
        profileCompletionStatus: {
          ...user.profileCompletionStatus,
          [step]: completed,
        },
      });
    }
  };

  const isProfileComplete = () => {
    if (!user) return false;
    const { personalInformation, addressInformation, identityVerification } =
      user.profileCompletionStatus;
    return personalInformation && addressInformation && identityVerification;
  };

  const logout = () => {
    setUserState(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        updateProfileStatus,
        isProfileComplete,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
