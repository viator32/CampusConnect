import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

interface SharePopupProps {
  url: string;
  onClose: () => void;
}

export default function SharePopup({ url, onClose }: SharePopupProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    onClose();
  };

  return (
    <div className="absolute right-0 z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2">
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <button
        onClick={copyLink}
        className="text-sm text-gray-600 hover:text-orange-500 px-2"
      >
        Copy Link
      </button>
    </div>
  );
}
