import { useAuthStore } from '../store/useAuthStore';

const MyProfile = () => {
  const { userInfo, signOut } = useAuthStore();

  if (!userInfo) return <div>Loading user...</div>;

  return (
    <div className='h-[100vh] bg-green-200 flex flex-col items-center justify-center'>
      <div>Xin chào, {userInfo.full_name}</div>
      <img className='rounded-full h-8 w-8' src={userInfo.avatar_url} alt={userInfo.full_name} />
      <button className='border-black border-2 p-2 bg-white mt-4' onClick={signOut}>
        Sign out
      </button>
    </div>
  );
};

export default MyProfile;
