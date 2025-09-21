const LoginPage = () => {
  return (
    <div className="min-h-screen bg-bg-col text-text-col flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Spotlux</h1>
        <p className="text-text-col/80 mb-8">Sign in to your account</p>
        <button className="bg-primary-col text-bg-col px-6 py-3 rounded-lg font-semibold hover:bg-primary-col/90 transition-colors">
          Login with Spotlux
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
