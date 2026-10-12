import Loading from ".";

export default function LoadingScreen() {
  return (
    <div className="fixed z-50 top-0 left-0 min-h-screen w-full flex justify-center items-center bg-white">
      <Loading />
    </div>
  );
}
