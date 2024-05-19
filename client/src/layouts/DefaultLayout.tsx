import Footer from "@/components/Footer";
import Header from "@/components/Header";

type DefaultLayoutProps = {
  children: React.ReactElement;
};

const DefaultLayout = ({children} : DefaultLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default DefaultLayout