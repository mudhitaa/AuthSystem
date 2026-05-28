interface HeadingProps {
  text: string;
  subtitle?: string;
  classname?: string;
}

export const Heading = ({ text, subtitle, classname = '' }: HeadingProps) => {
  return (
    <div className="text-center mb-6">
      <h1 className={`text-3xl font-bold ${classname}`}>{text}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}