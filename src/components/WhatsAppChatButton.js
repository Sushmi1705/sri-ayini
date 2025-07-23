const WhatsAppChatButton = () => {
    return (
      <a
        href="https://wa.me/9363489242" // Change this to your actual WhatsApp number
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/assets/images/icons/whatsapp-icon.png" // Place the icon in public folder
          alt="Chat on WhatsApp"
          style={{ width: '70px', height: '70px' }}
        />
      </a>
    );
  };
  
  export default WhatsAppChatButton;
  