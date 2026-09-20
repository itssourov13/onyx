import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import { EncodingLab } from '@/components/security/encoding-lab';

export default function SecurityEncodingsPage(){
  return <main><PageHero eyebrow="Security / ENCODING LAB" title="Normalize the bytes before you reason about them.">Small local transformations for URL components, UTF-8 Base64 and UTF-8 hexadecimal values. The lab deliberately avoids network decoding services or remote lookup.</PageHero><section className="section"><div className="container"><EncodingLab/></div></section></main>;
}

export const metadata = createPageMetadata('/security/encodings', 'Encoding Lab — Onyx Archive', 'Local URL, Base64 and hexadecimal encoding transforms.');
