export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow w-full flex justify-center px-6 ">
        <div className="w-[1260px] mt-10">{children}</div>
      </div>
    </div>
  );
}
