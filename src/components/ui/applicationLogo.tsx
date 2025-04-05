import Image from "next/image";
import Link from "next/link";

type ApplicationLogoProps = {
  className?: string;
  src: string;
  alt: string;
};

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({
  className,
  src,
  alt,
}) => (
  <Link href="/dashboard" passHref>
    <div className={`relative ${className || ""}`}>
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </div>
  </Link>
);

export default ApplicationLogo;
