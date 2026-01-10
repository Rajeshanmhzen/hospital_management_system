import Hero from "components/sections/Hero";
import TrustedBy from '../components/sections/TrustedBy';
import Workflow from '../components/sections/Workflow';
import Feature from "components/sections/Feature";
import CTA from '../components/sections/CTA';


export default function Home() {
  return (
   <div className="min-h-screen">
    <main>
     <Hero/>
     <TrustedBy/>
     <Feature/>
     <Workflow/>
     <CTA/>
    </main>
   </div>
  );
}