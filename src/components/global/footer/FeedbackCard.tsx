import React, { useState } from 'react';
import { IoDocumentTextOutline } from "react-icons/io5";

const FeedbackCard = () => {
  const [formData, setFormData] = useState({ message: '', email: '' });

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const { message, email } = formData;
    
    // Create a well-structured feedback message body
    const mailtoLink = `mailto:support@jiffyscan.xyz?subject=Feedback&body=${encodeURIComponent(`
Hello JiffyScan Team,

I hope you're doing well. I wanted to provide some feedback on your platform:

"${message}"

Thank you for taking the time to consider my input. Please feel free to reach out if you need more details.

Best regards,
${email}
    `)}`;

    // Open user's email client with pre-filled subject, body, and email address
    window.location.href = mailtoLink;
};

  return (
    <div className="m-16 mx-auto md:max-w-2xl lg:max-w-[749px] p-4 ">
      <div className="rounded-xl border-2 lg:flex lg:items-center bg-white dark:bg-[#1D1E1F] dark:border-[#444444]">
        <div className="sm:w-full sm:max-w-md py-6 px-6 lg:mt-0 lg:flex-1 lg:justify-center lg:items-center space-y-4">
          <p className="flex gap-2 font-inter font-medium items-center text-md sm:text-xl text-black dark:text-[#989BA6]">
            <IoDocumentTextOutline />
            Faced an Issue? Help us improve.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:space-x-3">
            <div className="w-full">
              <label htmlFor="message" className="sr-only">Message</label>
              <input
                id="message"
                type="text"
                value={formData.message}
                onChange={handleChange}
                className="w-full placeholder:dark:text-[#989BA6] dark:bg-[#19191A] font-gsans placeholder:font-gsans dark:text-[#989BA6] dark:border-[#444444] md:w-[300px] lg:w-[341px] rounded-md border px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700"
                placeholder="Write Message"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="sr-only dark:text-[#989BA6]">Email address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full md:w-[200px] lg:w-[220px] rounded-md dark:bg-[#19191A] font-gsans placeholder:font-gsans border px-5 py-3 text-black dark:border-[#444444] placeholder:dark:text-[#989BA6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700"
                placeholder="Your email"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-3 flex w-full lg:w-[108px] items-center justify-center rounded-md bg-[#0052FF] px-5 py-3 text-base font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-700 sm:mt-0 sm:w-auto"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackCard;