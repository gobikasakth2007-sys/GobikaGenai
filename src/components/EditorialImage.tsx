import { useState } from 'react';
import { Landmark } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export function EditorialImage({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-[16/9]',
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`m-0 ${className}`}>
      <div className={`relative overflow-hidden bg-[#EBE6DF] border border-[#E5DFD5] ${aspectClass}`}>
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F4F0E8] to-[#E7E0D4] text-[#44403C]">
            <Landmark className="w-8 h-8 text-[#1E3A8A]/70 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[#1C1917] max-w-xs">{alt}</p>
            <p className="text-xs text-[#78716C] mt-1">Sri Krishna Arts &amp; Science College</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs font-serif italic text-[#57534E] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
