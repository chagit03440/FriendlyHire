import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-12">
      <div className="container max-w-3xl mx-auto px-6">
        {/* Heading */}
        <h1 className="text-6xl font-bold text-center mb-6 text-orange-400">About Us</h1>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to bridge the gap between alumni and job seekers by providing a centralized, user-friendly platform. Whether you&apos;re a recent graduate searching for your dream job or an experienced professional looking to help others in your field, FriendlyHire is here to make the process seamless and effective.
          </p>
        </section>

        {/* Why FriendlyHire Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why FriendlyHire?</h2>
          <p className="text-lg leading-relaxed mb-4">
            During their job searches, many alumni faced challenges finding a dedicated space that connects them with opportunities offered by their peers. FriendlyHire was born out of the need to create a platform where:
          </p>
          <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
            <li><strong>Opportunities are centralized:</strong> All job listings shared by alumni are easily accessible in one place.</li>
            <li><strong>Connections thrive:</strong> Graduates can build valuable professional relationships with peers in various industries.</li>
            <li><strong>Applications are streamlined:</strong> Submitting your resume and applying to jobs is effortless and secure.</li>
          </ul>
        </section>

        {/* What We Offer Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <p className="text-lg leading-relaxed mb-4">
            FriendlyHire is designed with alumni and students in mind, providing features to:
          </p>
          <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
            <li><strong>Explore Opportunities:</strong> Browse job postings shared by alumni working in top companies.</li>
            <li><strong>Apply with Ease:</strong> Submit resumes directly through the platform.</li>
            <li><strong>Share Openings:</strong> Help others by posting job vacancies from your organization.</li>
            <li><strong>Build Networks:</strong> Strengthen professional relationships within the college community.</li>
          </ul>
        </section>

        {/* Technology Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
          <p className="text-lg leading-relaxed">
            FriendlyHire combines cutting-edge technologies to provide a secure, efficient, and intuitive experience:
          </p>
          <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
            <li><strong>Built with Next.js:</strong> For a fast, responsive user interface.</li>
            <li><strong>Secured with JWT and SSL:</strong> To protect your data.</li>
            <li><strong>Powered by MongoDB:</strong> To manage profiles and job listings seamlessly.</li>
          </ul>
        </section>

        {/* Join Us Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="text-lg leading-relaxed">
            Whether you&apos;re looking to grow your career or help others advance theirs, FriendlyHire is the platform to make it happen. Together, we can build a thriving professional community that supports, uplifts, and inspires.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Start your journey with FriendlyHire today!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
