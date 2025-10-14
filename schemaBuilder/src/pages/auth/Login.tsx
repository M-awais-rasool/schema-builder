// import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { DatabaseGrid } from '../../components/auth/DatabaseGrid';
import { LoginForm } from '../../components/auth/LoginForm';

export default function Login() {
  // const navigate = useNavigate();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   navigate('/dashboard');
  // };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
     <div className="size-full min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <DatabaseGrid />
      <div className="relative z-10 w-full px-4 py-8 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
    </div>
  );
}