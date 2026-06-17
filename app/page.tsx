"use client"
import Hero from "@/components/Hero";
import Navbar from "@/components/navbar";
import Signup from "@/components/signup";

export default function Home() {
  return (
    <div className="md:w-8/12 mx-auto">
      <Signup />
      <Navbar />
      <Hero />
      <img alt="" src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png" className="md:block hidden fixed right-0 top-0 bottom-0 h-7/10 my-auto -z-99" />
    </div>
  );
}
