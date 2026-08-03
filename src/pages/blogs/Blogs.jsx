import React from 'react';

const Blogs = () => {
  return (
    <section className="section__container blog__container">
      <h2 className="section__header">Locate US</h2>
      <p className="section__subheader">
        We are settled near CMH Rawalpindi
      </p>
      <div className="md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Blog items would go here */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1450.233882024264!2d73.73417091816705!3d32.928992177952644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f90c5a7e440b5%3A0xa7cf15150baef8db!2sAl%20Madina%20Kids%20Collection!5e0!3m2!1sen!2s!4v1753193059020!5m2!1sen!2s" 
          width="1280" 
          height="450" 
          style={{ border: 0 }}
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Location"
        ></iframe>
      </div>
    </section>
  );
};

export default Blogs;