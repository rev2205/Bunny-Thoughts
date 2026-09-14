export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span>© {year} Bunny Thoughts. All rights reserved.</span>
      <span>Keep thinking. Keep growing. ♡</span>
    </footer>
  );
}
