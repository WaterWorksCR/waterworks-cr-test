import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.3em] text-accent">
              Water Works
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/70">
              C&R
            </p>
            <p className="mt-6 text-sm text-white/70">
              Water systems, bulk supply, and service that keep West Texas
              flowing.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Visit
            </h3>
            <p className="mt-4 text-base">2425 Stafford Blvd</p>
            <p className="text-base">Pecos, TX 79772</p>
            <p className="mt-3 text-sm text-white/70">Mon - Sat · 7AM - 6PM</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Stay Connected
            </h3>
            <div className="mt-4 flex items-center gap-4 text-white/70">
              <a
                href="#"
                className="rounded-full border border-white/20 p-2 transition hover:border-accent hover:text-accent"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/20 p-2 transition hover:border-accent hover:text-accent"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-full border border-white/20 p-2 transition hover:border-accent hover:text-accent"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">
              &copy; {new Date().getFullYear()} Water Works C&R. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
