import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

const ProfilePage = () => {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-bg-col text-text-col p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Profile</h1>
          <div className="bg-bg-col/50 backdrop-blur-sm rounded-xl border border-text-col/20 p-8">
            <p className="text-text-col/70 text-center">
              Profile page coming soon...
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
