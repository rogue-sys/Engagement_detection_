import SideBar from "@/components/side-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full gap-2 flex flex-col md:flex-row">
      <SideBar />
      <main className="p-[10px] sm:p-[20px] md:p-[30px] lg:p-[50px]">{children}</main>
    </section>
  );
}
