import { WhatsAppIcon, WHATSAPP_URL } from "./WhatsAppIcon";

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
