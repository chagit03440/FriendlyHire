"use client"
import LoadSpinner from '@/app/components/LoadSpinner';
import ProfilePage from '@/app/components/Profile';
import { useUser } from '@/app/context/UserContext';
import { getCandidate } from '@/app/services/candidateServices';
import { getEmployee } from '@/app/services/employeeServices';
import ICandidate from '@/app/types/candidate';
import IUser from '@/app/types/user';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { role, mail } = useUser(); // Context for the current user
  const [user, setUser] = useState<IUser & ICandidate | null>(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      if (!mail) {
        setLoading(false); 
        return;
      }

      try {
        if (role === 'employee') {
          const thisUser = await getEmployee(mail);
          setUser(thisUser); 
        } else {
          const thisUser = await getCandidate(mail);
          setUser(thisUser); 
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, mail]);

  if (loading) {
    return <div><LoadSpinner/></div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <ProfilePage user={user} />
    </div>
  );
};

export default Page;
