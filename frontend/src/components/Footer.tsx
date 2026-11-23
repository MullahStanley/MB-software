import React from 'react';
import { Phone, Mail, MapPin, Instagram, Music2, MessageCircle, Linkedin } from 'lucide-react';

const SOCIALS = [
  { name: 'WhatsApp', href: 'https://chat.whatsapp.com/GgJNI3MDJIcC2olzxNkqAr?mode=gi_t', icon: MessageCircle },
  { name: 'Instagram', href: 'https://www.instagram.com/mental.beacon.ke/', icon: Instagram },
  { name: 'TikTok', href: 'https://www.tiktok.com/@mentalbeacon.ke', icon: Music2 },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/mental-beacon/', icon: Linkedin },
];

export const Footer: React.FC = () => (
  <footer className="bg-[#1B4326] text-[#F4F1EA] border-t-2 border-[#1B4326] py-10 mt-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
      <div>
        <div className="font-serif font-bold text-lg mb-2">Mental Beacon</div>
        <p className="text-sm text-[#F4F1EA]/70 mb-4">Becoming a Centre of Youth Mental Health and Support.</p>
        <div className="space-y-2 text-sm">
          <a href="tel:+254796192656" className="flex items-center gap-2 text-[#F4F1EA]/80 hover:text-[#F4F1EA]">
            <Phone className="w-4 h-4" /> +254 796 192 656
          </a>
          <a href="mailto:support@mentalbeacon.co.ke" className="flex items-center gap-2 text-[#F4F1EA]/80 hover:text-[#F4F1EA]">
            <Mail className="w-4 h-4" /> support@mentalbeacon.co.ke
          </a>
          <div className="flex items-center gap-2 text-[#F4F1EA]/80">
            <MapPin className="w-4 h-4" /> Nairobi, Kenya
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3">Quick links</div>
        <div className="space-y-1 text-sm">
          <a href="#top" className="block text-[#F4F1EA]/80 hover:text-[#F4F1EA]">Home</a>
          <a href="#top" className="block text-[#F4F1EA]/80 hover:text-[#F4F1EA]">Our Approach</a>
          <a href="#top" className="block text-[#F4F1EA]/80 hover:text-[#F4F1EA]">MB Care</a>
          <a href="#top" className="block text-[#F4F1EA]/80 hover:text-[#F4F1EA]">Booking</a>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3">Follow us</div>
        <div className="flex gap-3">
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" title={s.name}>
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
        <p className="text-xs text-[#F4F1EA]/50 mt-4">We respond within 24–48 hours. No message goes unread.</p>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/10 text-xs text-[#F4F1EA]/50">
      © {new Date().getFullYear()} Mental Beacon. All rights reserved.
    </div>
  </footer>
);
