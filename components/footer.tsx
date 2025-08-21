function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex justify-center items-center space-x-4 py-8 text-sm md:text-base">
      <p>
        gxuvain.dev -
        {currentYear}
      </p>
    </div>
  );
}

export default Footer;
