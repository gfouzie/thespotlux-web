export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Spotlux!</h1>
          <p className="text-text-col/70 text-lg mb-8">
            You&apos;re successfully logged in. This is your private dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
