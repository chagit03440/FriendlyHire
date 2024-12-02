// context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
    role: string | null;
    setRole: (role: string | null) => void;
    mail: string | null;
    setMail: (mail: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [mail, setMail] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ role, setRole, mail, setMail }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
