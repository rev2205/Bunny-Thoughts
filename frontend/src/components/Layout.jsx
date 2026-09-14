import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children, showSidebar = true }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-wrapper">
      <Header />
      <Nav />
      <div className={`site-main${showSidebar ? '' : ' single-column'}`}>
        <main className="main-content">{children}</main>
        {showSidebar && <Sidebar />}
      </div>
      <Footer />
      <button
        className="scroll-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        ▲
      </button>
    </div>
  );
}
