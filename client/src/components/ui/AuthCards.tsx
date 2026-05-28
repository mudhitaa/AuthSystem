interface AuthCardProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  gradient?: string;
  imageSide?: 'left' | 'right';
}

export default function AuthCard({
  image,
  imageAlt,
  children,
  gradient = 'from-gray-50 to-blue-50',
  imageSide = 'left',
}: AuthCardProps) {
  const imageEl = (
    <div className="hidden lg:block w-1/2 rounded-l-2xl overflow-hidden">
      <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${gradient} px-4`}>
      <div className="flex bg-white shadow-xl rounded-2xl overflow-hidden w-[900px] min-h-[500px]">
        {imageSide === 'left' && imageEl}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          {children}
        </div>
        {imageSide === 'right' && imageEl}
      </div>
    </div>
  );
}