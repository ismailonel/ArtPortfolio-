import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <div className="grid items-start gap-8 md:grid-cols-[220px,1fr]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <Image
                            src="/images/profile.svg"
                            alt="Profile picture"
                            width={600}
                            height={600}
                            className="h-auto w-full object-cover"
                            priority
                        />
                    </div>
                    <div className="container-prose">
                        <h1>About</h1>
                        <p>
                            I am a painter based in [Your City], inspired by nature, light, and human
                            emotion. My practice explores color fields, texture, and the interplay between
                            abstraction and representation.
                        </p>
                        <p>
                            My work has been exhibited in group and solo shows and is held in private
                            collections worldwide. When not in the studio, I enjoy teaching workshops and
                            collaborating on community art projects.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

