import Image from "next/image";
import Link from "next/link";

type ApplicationLogoProps = {
  className?: string;
  src: string;
  alt: string;
  link: string;
};

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({
  className,
  src,
  alt,
  link = "/",
}) => (
  <Link href={link} passHref>
    <div className={`relative ${className || ""}`}>
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </div>
  </Link>
);

export default ApplicationLogo;
