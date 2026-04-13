import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ArrowUpRightIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default function ContactOverlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ── Panel ── */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-6 p-10 rounded-lg border border-white/[0.06]"
            style={{ background: 'rgba(14, 14, 14, 0.95)' }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/30 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
            >
              <XIcon />
            </button>

            {/* Title */}
            <h2 className="font-serif text-3xl font-bold text-white mb-2">
              Get in Touch
            </h2>
            <p className="text-sm font-sans text-dim leading-relaxed mb-8">
              Interested in a piece or a collaboration? I'd love to hear from
              you.
            </p>

            {/* Contact Links */}
            <div className="space-y-5">
              <ContactLink
                icon={<MailIcon />}
                label="Email"
                value="rajsinhaaayushifr16@gmail.com"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rajsinhaaayushifr16@gmail.com"
              />
              <ContactLink
                icon={<InstagramIcon />}
                label="Instagram"
                value="@brush_it_0ff"
                href="https://www.instagram.com/brush_it_0ff?igsh=b2hzOTF1ejduZXds"
              />
              <ContactLink
                icon={<MapPinIcon />}
                label="Studio"
                value="New Delhi, India"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] my-8" />

            {/* CTA */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rajsinhaaayushifr16@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full py-3 rounded-md border border-accent/20 text-accent text-sm font-sans tracking-wider uppercase hover:bg-accent/10 transition-all duration-300 no-underline"
            >
              Send a Message
              <ArrowUpRightIcon className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactLink({ icon, label, value, href }) {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-4 group cursor-default no-underline"
    >
      <div className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-dim group-hover:text-accent group-hover:border-accent/30 transition-all duration-300">
        {icon}
      </div>
      <div>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-dim font-sans">
          {label}
        </span>
        <span className="block text-sm text-white/80 font-sans group-hover:text-accent transition-colors duration-300">
          {value}
        </span>
      </div>
    </Wrapper>
  );
}
