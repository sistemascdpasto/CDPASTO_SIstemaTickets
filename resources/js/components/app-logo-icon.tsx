import { type ImgHTMLAttributes } from 'react';

/**
 * Brand icon for CD Nariño. Kept named `AppLogoIcon` so every existing
 * reference (auth layouts, header) picks it up automatically.
 */
export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/image/icono-square.png" alt="CD Nariño" className={className} {...props} />;
}
